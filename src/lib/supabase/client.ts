"use client";

import { createBrowserClient } from "@supabase/ssr";

// -----------------------------------------------------------------------------
// Cliente de Supabase para el navegador (uso público con la anon key).
// Se usa, por ejemplo, para subir imágenes de referencia a Storage.
// -----------------------------------------------------------------------------

let cachedClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = createBrowserClient(url, anonKey);
  }
  return cachedClient;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export const STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "referencias";
