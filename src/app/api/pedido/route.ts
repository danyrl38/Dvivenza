import { NextResponse } from "next/server";

import { sendOrderNotification } from "@/lib/notify";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { OrderRecord } from "@/lib/types";
import { isValidEmail } from "@/lib/utils";

export const runtime = "nodejs";

// -----------------------------------------------------------------------------
// POST /api/pedido
// Recibe la solicitud de cotización y la persiste en Supabase (tabla `orders`).
// Si Supabase aún no está configurado, responde en modo demo para que el sitio
// funcione igualmente en desarrollo/preview.
// -----------------------------------------------------------------------------

interface OrderPayload {
  fullName: string;
  email: string;
  whatsapp: string;
  city: string;
  country: string;
  artType: string;
  description: string;
  peopleCount?: string;
  size?: string;
  material?: string;
  frame?: string;
  customText?: string;
  specialColors?: string;
  desiredDate?: string;
  budget?: string;
  shippingAddress?: string;
  referencePaths?: string[];
}

export async function POST(request: Request) {
  let body: OrderPayload;
  try {
    body = (await request.json()) as OrderPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Cuerpo de la solicitud inválido." },
      { status: 400 },
    );
  }

  // Validación mínima en el servidor.
  const errors: string[] = [];
  if (!body.fullName?.trim()) errors.push("El nombre es obligatorio.");
  if (!isValidEmail(body.email || "")) errors.push("El correo no es válido.");
  if (!body.artType?.trim()) errors.push("Selecciona un tipo de obra.");
  if (!body.description?.trim() || body.description.trim().length < 10)
    errors.push("Cuéntanos un poco más sobre tu idea.");

  if (errors.length > 0) {
    return NextResponse.json({ ok: false, error: errors.join(" ") }, { status: 422 });
  }

  const record: OrderRecord = {
    full_name: body.fullName.trim(),
    email: body.email.trim(),
    whatsapp: body.whatsapp?.trim() || "",
    city: body.city?.trim() || "",
    country: body.country?.trim() || "",
    art_type: body.artType,
    description: body.description.trim(),
    people_count: body.peopleCount?.trim() || null,
    size: body.size?.trim() || null,
    material: body.material?.trim() || null,
    frame: body.frame?.trim() || null,
    custom_text: body.customText?.trim() || null,
    special_colors: body.specialColors?.trim() || null,
    desired_date: body.desiredDate?.trim() || null,
    budget: body.budget?.trim() || null,
    shipping_address: body.shippingAddress?.trim() || null,
    reference_paths: Array.isArray(body.referencePaths) ? body.referencePaths : [],
    status: "nuevo",
  };

  const supabase = getSupabaseAdminClient();

  // Modo demo: sin Supabase configurado, no fallamos.
  if (!supabase) {
    console.info("[pedido] Supabase no configurado — pedido recibido en modo demo:", {
      full_name: record.full_name,
      email: record.email,
      art_type: record.art_type,
    });
    // Aun sin base de datos, intentamos avisar por email si Resend está activo.
    await sendOrderNotification(record);
    return NextResponse.json({
      ok: true,
      demo: true,
      message:
        "Recibimos tu solicitud. (Modo demo: configura Supabase para guardar los pedidos).",
    });
  }

  const saveOrder = (rec: Record<string, unknown>) =>
    supabase.from("orders").insert(rec).select("id").single();

  let { data, error } = await saveOrder(record);

  // Resiliencia: si una columna opcional aún no existe en la tabla (p. ej.
  // `shipping_address` sin migrar), reintentamos sin ella para NO perder el
  // pedido. El resto de los datos se guarda igual.
  if (error && /column|schema cache/i.test(error.message)) {
    const fallback: Record<string, unknown> = { ...record };
    delete fallback.shipping_address;
    console.warn(
      "[pedido] Reintentando sin columnas opcionales:",
      error.message,
    );
    ({ data, error } = await saveOrder(fallback));
  }

  if (error) {
    console.error("[pedido] Error al guardar en Supabase:", error.message);
    return NextResponse.json(
      { ok: false, error: "No pudimos guardar tu solicitud. Intenta de nuevo." },
      { status: 500 },
    );
  }

  // Pedido guardado: notificamos por email (no bloquea la respuesta si falla).
  await sendOrderNotification({ ...record, id: data?.id });

  return NextResponse.json({ ok: true, id: data?.id });
}
