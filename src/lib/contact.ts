// -----------------------------------------------------------------------------
// Datos de contacto públicos, tomados de variables de entorno con valores por
// defecto razonables para desarrollo.
// -----------------------------------------------------------------------------

const whatsappNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5215555555555";

export const CONTACT = {
  whatsappNumber,
  whatsappUrl: `https://wa.me/${whatsappNumber}`,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hola@dvivenza.com",
  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/dvivenza",
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || "https://tiktok.com/@dvivenza",
} as const;

/** Construye un enlace de WhatsApp con mensaje prellenado. */
export function whatsappLink(message: string): string {
  return `${CONTACT.whatsappUrl}?text=${encodeURIComponent(message)}`;
}
