"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseAdminClient } from "@/lib/supabase/server";

// Nota: en un módulo "use server" todos los exports deben ser funciones async,
// por eso esta constante NO se exporta (el cliente usa su propia copia).
const GALLERY_BUCKET = "galeria";

// -----------------------------------------------------------------------------
// Las subidas van DIRECTAS del navegador a Supabase mediante una URL firmada.
// Así se evita el límite de ~4.5 MB que Vercel impone al cuerpo de las
// peticiones (que hacía fallar la subida de fotos de celular).
// El servidor solo emite el "ticket" y registra el resultado.
// -----------------------------------------------------------------------------

function refresh() {
  revalidatePath("/admin/galeria");
  revalidatePath("/");
  revalidatePath("/galeria");
}

function cleanExt(name: string, isVideo: boolean): string {
  return (name.split(".").pop() || (isVideo ? "mp4" : "jpg"))
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 5);
}

type Ticket =
  | { ok: true; path: string; token: string }
  | { ok: false; error: string };

/** Genera una URL firmada para que el navegador suba el archivo directamente. */
export async function createUploadTicket(
  fileName: string,
  isVideo: boolean,
  prefix = "",
): Promise<Ticket> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };

  const ext = cleanExt(fileName, isVideo);
  const path = `${prefix}${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  const { data, error } = await supabase.storage
    .from(GALLERY_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? "No se pudo preparar la subida.",
    };
  }
  return { ok: true, path: data.path, token: data.token };
}

/** Registra en la galería un archivo ya subido a Storage. */
export async function registerGalleryMedia(
  path: string,
  kind: "image" | "video",
  alt: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };

  const publicUrl = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(path).data
    .publicUrl;

  const { error } = await supabase.from("gallery_media").insert({
    kind,
    storage_path: path,
    public_url: publicUrl,
    alt: alt.trim(),
    sort_order: 0,
  });

  if (error) {
    await supabase.storage.from(GALLERY_BUCKET).remove([path]);
    return { ok: false, error: error.message };
  }
  refresh();
  return { ok: true };
}

/** Asigna a un hueco fijo (portada / producto) un archivo ya subido. */
export async function setSiteMediaFromPath(
  slot: string,
  path: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };

  const { data: prev } = await supabase
    .from("site_media")
    .select("storage_path")
    .eq("slot", slot)
    .single();

  const publicUrl = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(path).data
    .publicUrl;

  const { error } = await supabase.from("site_media").upsert({
    slot,
    public_url: publicUrl,
    storage_path: path,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    await supabase.storage.from(GALLERY_BUCKET).remove([path]);
    return { ok: false, error: error.message };
  }

  const prevPath = (prev as { storage_path: string | null } | null)?.storage_path;
  if (prevPath && prevPath !== path) {
    await supabase.storage.from(GALLERY_BUCKET).remove([prevPath]);
  }

  refresh();
  return { ok: true };
}

/** Elimina un medio de la galería (registro + archivo). */
export async function deleteMedia(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "").trim();
  if (!id) return;

  const supabase = getSupabaseAdminClient();
  if (!supabase) return;

  const { data: row } = await supabase
    .from("gallery_media")
    .select("storage_path")
    .eq("id", id)
    .single();

  const path = (row as { storage_path: string | null } | null)?.storage_path;
  if (path) await supabase.storage.from(GALLERY_BUCKET).remove([path]);
  await supabase.from("gallery_media").delete().eq("id", id);

  refresh();
}

/** Actualiza el orden de un medio. Menor número = aparece antes. */
export async function updateMediaOrder(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "").trim();
  const order = Number.parseInt(String(formData.get("sort_order") || "0"), 10);
  if (!id || Number.isNaN(order)) return;

  const supabase = getSupabaseAdminClient();
  if (!supabase) return;

  await supabase
    .from("gallery_media")
    .update({ sort_order: order })
    .eq("id", id);

  refresh();
}

/** Restaura un hueco fijo a su imagen por defecto. */
export async function resetSiteMedia(formData: FormData): Promise<void> {
  const slot = String(formData.get("slot") || "").trim();
  if (!slot) return;

  const supabase = getSupabaseAdminClient();
  if (!supabase) return;

  const { data: row } = await supabase
    .from("site_media")
    .select("storage_path")
    .eq("slot", slot)
    .single();

  const path = (row as { storage_path: string | null } | null)?.storage_path;
  if (path) await supabase.storage.from(GALLERY_BUCKET).remove([path]);
  await supabase.from("site_media").delete().eq("slot", slot);

  refresh();
}
