import type { Metadata } from "next";

import { LegalLayout } from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description:
    "Aviso de privacidad de Dvivenza: cómo recopilamos, usamos y protegemos tus datos personales.",
};

export default function PrivacidadPage() {
  return (
    <LegalLayout
      title="Aviso de privacidad"
      updatedAt="julio de 2026"
      intro="En Dvivenza valoramos y protegemos tu información. Este aviso explica qué datos recopilamos y cómo los utilizamos."
      sections={[
        {
          heading: "Datos que recopilamos",
          body: [
            "Recopilamos los datos que nos proporcionas al solicitar una cotización: nombre, correo, WhatsApp, ciudad, país, las imágenes de referencia que subes y los detalles de tu pedido.",
          ],
        },
        {
          heading: "Uso de la información",
          body: [
            "Utilizamos tus datos únicamente para elaborar tu cotización, producir tu obra, coordinar el envío y mantener contacto contigo sobre tu pedido.",
            "No vendemos ni compartimos tu información con terceros con fines publicitarios.",
          ],
        },
        {
          heading: "Imágenes de referencia",
          body: [
            "Las fotografías que compartes se usan exclusivamente para crear tu obra. Puedes solicitar su eliminación una vez finalizado tu pedido.",
          ],
        },
        {
          heading: "Tus derechos",
          body: [
            "Puedes solicitar el acceso, rectificación o eliminación de tus datos personales en cualquier momento escribiéndonos por nuestros canales de contacto.",
          ],
        },
      ]}
    />
  );
}
