import "server-only";

import { createClient } from "@supabase/supabase-js";

// -----------------------------------------------------------------------------
// Cliente de Supabase para el servidor, con la Service Role Key.
// NUNCA se debe exponer esta clave al cliente. Se usa en rutas de API/servidor
// para insertar pedidos saltándose las políticas RLS de forma controlada.
// -----------------------------------------------------------------------------

export function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
