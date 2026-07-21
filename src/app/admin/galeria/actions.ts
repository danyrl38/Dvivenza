"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseAdminClient } from "@/lib/supabase/server";

const BUCKET = "galeria";

const VALID_CATEGORIES = new Set([
  "retratos",
  "mascotas",
  "parejas",
  "familia",
  "prendas",
  "fundas",
]);

function refresh() {
  revalidatePath("/admin/galeria");
  revalidatePath("/");
}

/** Sube una o varias imágenes/videos a la galería. */
export async function uploadMedia(formData: FormData): Promise<void> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return;

  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  const rawCategory = String(formData.get("category") || "retratos");
  const category = VALID_CATEGORIES.has(rawCategory) ? rawCategory : "retratos";
  const alt = String(formData.get("alt") || "").trim();

  for (const file of files) {
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) continue; // ignora tipos no soportados

    const ext = (file.name.split(".").pop() || (isVideo ? "mp4" : "jpg"))
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const bytes = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, {
        contentType: file.type || (isVideo ? "video/mp4" : "image/jpeg"),
        upsert: false,
      });
    if (uploadError) {
      console.error("[galeria] Error al subir:", uploadError.message);
      continue;
    }

    const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data
      .publicUrl;

    const { error: insertError } = await supabase.from("gallery_media").insert({
      kind: isVideo ? "video" : "image",
      storage_path: path,
      public_url: publicUrl,
      alt,
      category,
      sort_order: 0,
    });
    if (insertError) {
      console.error("[galeria] Error al guardar registro:", insertError.message);
      // Limpia el archivo huérfano si no se pudo registrar.
      await supabase.storage.from(BUCKET).remove([path]);
    }
  }

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
