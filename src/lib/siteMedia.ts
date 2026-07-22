import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/server";

/**
 * Devuelve un mapa { slot: url } con las imágenes editables de secciones fijas
 * (portada, productos). Si Supabase no está configurado o hay error, devuelve
 * un mapa vacío y la web usa las imágenes por defecto del código.
 *
 * Slots: 'hero', 'product-<slug>'.
 */
export async function getSiteMedia(): Promise<Record<string, string>> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return {};

  const { data, error } = await supabase
    .from("site_media")
    .select("slot, public_url");

  if (error || !data) return {};

  const map: Record<string, string> = {};
  for (const row of data as { slot: string; public_url: string }[]) {
    if (row.slot && row.public_url) map[row.slot] = row.public_url;
  }
  return map;
}
