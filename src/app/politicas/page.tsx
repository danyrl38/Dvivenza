import type { Metadata } from "next";

import { LegalLayout } from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Políticas",
  description:
    "Políticas de pedidos, producción, envíos y devoluciones de D'Vivenza.",
};

export default function PoliticasPage() {
  return (
    <LegalLayout
      title="Políticas"
      updatedAt="julio de 2026"
      intro="Estas políticas describen cómo trabajamos cada pedido en D'Vivenza para asegurar una experiencia única, de calidad y transparente."
      sections={[
        {
          heading: "Pedidos y cotizaciones",
          body: [
            "Cada obra es única y se cotiza de forma personalizada según el tipo de pieza, tamaño, materiales y nivel de detalle.",
            "Para iniciar la producción se solicita un anticipo. El saldo restante se liquida antes del envío o entrega.",
          ],
        },
        {
          heading: "Producción",
          body: [
            "Al tratarse de arte hecho a mano, pueden variar ligeramente. Los tiempos de producción son estimados y se confirman en tu cotización.",
            "Compartimos avances y aprobaciones durante el proceso para asegurar que la obra refleje tu visión.",
          ],
        },
        {
          heading: "Envíos",
          body: [
            "Realizamos envíos a todo el país con empaque especial que protege cada pieza. Los costos y tiempos se detallan en tu cotización.",
          ],
        },
        {
          heading: "Cambios y devoluciones",
          body: [
            "Por tratarse de productos personalizados hechos a mano, no se aceptan devoluciones una vez aprobada la obra final.",
            "Si tu pieza llega dañada durante el envío, contáctanos dentro de las 48 horas siguientes y te ayudaremos a resolverlo.",
          ],
        },
      ]}
    />
  );
}
