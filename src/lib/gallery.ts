import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { GalleryCategory, GalleryMediaItem } from "@/lib/types";

interface GalleryMediaRow {
  id: string;
  kind: "image" | "video";
  public_url: string;
  alt: string | null;
  category: string | null;
}

/**
 * Devuelve los medios de la galería gestionados en Supabase, ordenados.
 * Si Supabase no está configurado, la tabla está vacía o hay un error,
 * devuelve un arreglo vacío para que la home use las imágenes por defecto.
 */
export async function getGalleryMedia(): Promise<GalleryMediaItem[]> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("gallery_media")
    .select("id, kind, public_url, alt, category")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as GalleryMediaRow[]).map((row) => ({
    id: row.id,
    kind: row.kind,
    src: row.public_url,
    alt: row.alt ?? "",
    category: (row.category ?? "retratos") as GalleryCategory,
  }));
}
