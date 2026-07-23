import "server-only";

import type { OrderRecord } from "@/lib/types";

// -----------------------------------------------------------------------------
// Notificación por email cuando entra un nuevo pedido.
// Usa la API REST de Resend (https://resend.com) — sin dependencias extra.
// Se activa SOLO si defines RESEND_API_KEY. Si no, no hace nada (no rompe).
//   RESEND_API_KEY      → tu API key de Resend
//   ORDER_NOTIFY_EMAIL  → a quién avisar (por defecto NEXT_PUBLIC_CONTACT_EMAIL)
//   RESEND_FROM         → remitente verificado (por defecto el dominio de pruebas)
// -----------------------------------------------------------------------------

const ART_TYPE_LABELS: Record<string, string> = {
  retrato: "Retrato",
  mascota: "Mascota",
  pareja: "Pareja",
  familia: "Familia",
  prenda: "Prenda",
  funda: "Funda",
  otro: "Otro",
};

type NotifyInput = OrderRecord & { id?: string };

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ] as string,
  );
}

export async function sendOrderNotification(order: NotifyInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to =
    process.env.ORDER_NOTIFY_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const from = process.env.RESEND_FROM || "D'Vivenza <onboarding@resend.dev>";

  // Notificaciones desactivadas: sin API key o sin destinatario.
  if (!apiKey || !to) return;

  const artLabel = ART_TYPE_LABELS[order.art_type] || order.art_type;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://dvivenza.vercel.app";

  const fields: Array<[string, string | null | undefined]> = [
    ["Nombre", order.full_name],
    ["Email", order.email],
    ["WhatsApp", order.whatsapp],
    ["Ciudad", order.city],
    ["País", order.country],
    ["Tipo de obra", artLabel],
    ["N.º de personas", order.people_count],
    ["Tamaño", order.size],
    ["Material", order.material],
    ["Marco", order.frame],
    ["Texto personalizado", order.custom_text],
    ["Colores especiales", order.special_colors],
    ["Fecha deseada", order.desired_date],
    ["Presupuesto", order.budget],
    ["Dirección de envío", order.shipping_address],
    [
      "Referencias",
      order.reference_paths?.length
        ? `${order.reference_paths.length} imagen(es) adjunta(s)`
        : "Sin imágenes",
    ],
  ];

  const rowsHtml = fields
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 16px;color:#B45C41;font-weight:600;font-size:13px;white-space:nowrap;vertical-align:top;">${k}</td><td style="padding:8px 16px;color:#3A2A2C;font-size:14px;">${escapeHtml(
          String(v),
        )}</td></tr>`,
    )
    .join("");

  const html = `
  <div style="background:#FFF8F0;padding:32px 16px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px -24px rgba(79,62,53,0.25);">
      <div style="background:#3A2A2C;padding:28px 32px;">
        <p style="margin:0;color:#EC5F2E;letter-spacing:0.25em;font-size:11px;text-transform:uppercase;">D'Vivenza</p>
        <h1 style="margin:6px 0 0;color:#FFF8F0;font-size:22px;font-weight:600;">Nuevo pedido recibido</h1>
      </div>
      <div style="padding:24px 16px;">
        <p style="margin:0 0 16px;padding:0 16px;color:#3A2A2C;font-size:15px;">
          <strong>${escapeHtml(order.full_name)}</strong> solicitó una cotización de <strong>${escapeHtml(
            artLabel,
          )}</strong>.
        </p>
        <div style="padding:0 16px 12px;">
          <p style="margin:0 0 4px;color:#B45C41;font-size:13px;font-weight:600;">Descripción de la idea</p>
          <p style="margin:0;color:#3A2A2C;font-size:14px;line-height:1.6;background:#FFF8F0;border-radius:12px;padding:12px 14px;">${escapeHtml(
            order.description,
          )}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;">${rowsHtml}</table>
        <div style="text-align:center;padding:24px 16px 8px;">
          <a href="${siteUrl}/admin" style="display:inline-block;background:#EC5F2E;color:#3A2A2C;text-decoration:none;font-weight:600;font-size:14px;padding:12px 28px;border-radius:999px;">Ver en el panel</a>
        </div>
      </div>
      <div style="background:#FFF8F0;padding:16px 32px;text-align:center;">
        <p style="margin:0;color:#B45C41;font-size:12px;">Responde a este correo para escribirle directamente al cliente.</p>
      </div>
    </div>
  </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: order.email,
        subject: `Nuevo pedido — ${artLabel} · ${order.full_name}`,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[notify] Resend respondió con error:", res.status, detail);
    }
  } catch (err) {
    console.error("[notify] No se pudo enviar la notificación:", err);
  }
}
