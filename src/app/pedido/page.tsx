import type { Metadata } from "next";

import { OrderProvider } from "@/components/order/OrderContext";
import { OrderWizard } from "@/components/order/OrderWizard";
import type { ArtType } from "@/lib/types";

export const metadata: Metadata = {
  title: "Crea tu obra personalizada",
  description:
    "Solicita tu retrato o pieza personalizada. Cuéntanos tu idea, sube tus referencias y recibe una cotización a la medida.",
  alternates: { canonical: "/pedido" },
};

const VALID_ART_TYPES: ArtType[] = [
  "retrato",
  "mascota",
  "pareja",
  "familia",
  "prenda",
  "funda",
  "otro",
];

export default async function PedidoPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const { tipo } = await searchParams;
  const initialArtType =
    tipo && VALID_ART_TYPES.includes(tipo as ArtType) ? (tipo as ArtType) : null;

  return (
    <div className="bg-marfil pb-24">
      {/* Encabezado */}
      <header className="border-b border-beige/40 bg-arena/20 pb-14 pt-32 md:pt-40">
        <div className="container-content max-w-3xl text-center">
          <span className="eyebrow">Pedido personalizado</span>
          <h1 className="mt-4 text-balance text-4xl font-medium leading-tight text-chocolate md:text-5xl lg:text-6xl">
            Empecemos a crear tu obra
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-cafe">
            Cuéntanos tu historia paso a paso. Te acompañamos para que tu recuerdo
            se convierta en una pieza única, hecha especialmente para ti.
          </p>
        </div>
      </header>

      {/* Asistente de pedido */}
      <div className="container-content mt-12 max-w-4xl md:mt-16">
        <OrderProvider initialArtType={initialArtType}>
          <OrderWizard />
        </OrderProvider>
      </div>
    </div>
  );
}
