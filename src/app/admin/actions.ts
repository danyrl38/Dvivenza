"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/types";

const VALID_STATUSES: ReadonlySet<OrderStatus> = new Set<OrderStatus>([
  "nuevo",
  "en_revision",
  "cotizado",
  "en_produccion",
  "entregado",
  "cancelado",
]);

/** Actualiza el estado de un pedido desde el panel de administración. */
export async function updateOrderStatus(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "").trim();
  const status = String(formData.get("status") || "").trim() as OrderStatus;

  if (!id || !VALID_STATUSES.has(status)) return;

  const supabase = getSupabaseAdminClient();
  if (!supabase) return;

  await supabase.from("orders").update({ status }).eq("id", id);
  revalidatePath("/admin");
}
