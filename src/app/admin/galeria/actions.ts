"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseAdminClient } from "@/lib/supabase/server";

const BUCKET = "galeria";

function refresh() {
  revalidatePath("/admin/galeria");
  revalidatePath("/");
}

function cleanExt(name: string, isVideo: boolean): string {
  return (name.split(".").pop() || (isVideo ? "mp4" : "jpg"))
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/** Sube uno o varios archivos al bucket y devuelve {path, publicUrl}. */
async function uploadFile(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdminClient>>,
  file: File,
  prefix = "",
): Promise<{ path: string; publicUrl: string } | null> {
  const isVideo = file.type.startsWith("video/");
  const ext = cleanExt(file.name, isVideo);
  const path = `${prefix}${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;
  const bytes = await file.arrayBuffer();
  const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
    contentType: file.type || (isVideo ? "video/mp4" : "image/jpeg"),
    upsert: false,
  });
  if (error) {
    console.error("[galeria] Error al subir:", error.message);
    return null;
  }
  const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data
    .publicUrl;
  return { path, publicUrl };
}

/** Sube una o varias imágenes/videos a la galería. */
export async function uploadMedia(formData: FormData): Promise<void> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return;

  const files = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);
  const alt = String(formData.get("alt") || "").trim();

  for (const file of files) {
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) continue; // ignora tipos no soportados

    const uploaded = await uploadFile(supabase, file);
    if (!uploaded) continue;

    const { error: insertError } = await supabase.from("gallery_media").insert({
      kind: isVideo ? "video" : "image",
      storage_path: uploaded.path,
      public_url: uploaded.publicUrl,
      alt,
      sort_order: 0,
    });
    if (insertError) {
      console.error("[galeria] Error al guardar registro:", insertError.message);
      await supabase.storage.from(BUCKET).remove([uploaded.path]);
    }
  }

  refresh();
}

/** Reemplaza la imagen de un slot fijo (portada o producto). */
export async function upsertSiteMedia(formData: FormData): Promise<void> {
  const slot = String(formData.get("slot") || "").trim();
  const file = formData.get("file");
  if (!slot || !(file instanceof File) || file.size === 0) return;
  if (!file.type.startsWith("image/")) return;

  const supabase = getSupabaseAdminClient();
  if (!supabase) return;

  // Guarda referencia al archivo anterior para limpiarlo después.
  const { data: prev } = await supabase
    .from("site_media")
    .select("storage_path")
    .eq("slot", slot)
    .single();

  const uploaded = await uploadFile(supabase, file, "site/");
  if (!uploaded) return;

  const { error } = await supabase.from("site_media").upsert({
    slot,
    public_url: uploaded.publicUrl,
    storage_path: uploaded.path,
    updated_at: new Date().toISOString(),
  });
  if (error) {
    console.error("[galeria] Error al guardar site_media:", error.message);
    await supabase.storage.from(BUCKET).remove([uploaded.path]);
    return;
  }

  // Limpia el archivo anterior si existía.
  const prevPath = (prev as { storage_path: string | null } | null)?.storage_path;
  if (prevPath) await supabase.storage.from(BUCKET).remove([prevPath]);

  refresh();
}

/** Restaura un slot fijo a su imagen por defecto (borra la personalizada). */
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
  if (path) await supabase.storage.from(BUCKET).remove([path]);
  await supabase.from("site_media").delete().eq("slot", slot);

  refresh();
}

/** Elimina un medio (registro + archivo en Storage). */
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

  if (row?.storage_path) {
    await supabase.storage.from(BUCKET).remove([row.storage_path as string]);
  }
  await supabase.from("gallery_media").delete().eq("id", id);

  refresh();
}

/** Actualiza el orden (número) de un medio. Menor número = aparece antes. */
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
