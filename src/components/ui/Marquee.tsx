import {
  IconBrush,
  IconChat,
  IconFrame,
  IconHand,
  IconHeart,
  IconPalette,
  IconSparkle,
  IconTruck,
} from "@/components/ui/Icons";

// -----------------------------------------------------------------------------
// Banda de desplazamiento infinito con iconos alusivos al oficio.
// El truco: el contenido se duplica y la pista se anima hasta -50%,
// de modo que el bucle es perfectamente continuo.
// -----------------------------------------------------------------------------

const ITEMS = [
  { Icon: IconHand, label: "100% hecho a mano" },
  { Icon: IconFrame, label: "Piezas únicas" },
  { Icon: IconTruck, label: "Envíos a todo el país" },
  { Icon: IconChat, label: "Atención personalizada" },
  { Icon: IconPalette, label: "Materiales de calidad" },
  { Icon: IconHeart, label: "Regalos memorables" },
  { Icon: IconBrush, label: "Pintado a mano" },
  { Icon: IconSparkle, label: "Diseño a tu medida" },
];

export function Marquee() {
  return (
    <div
      className="relative w-full overflow-hidden border-y border-beige/60 bg-arena/30 py-4"
      aria-label="Ventajas de D'Vivenza"
    >
      {/* Degradados en los bordes para un corte suave */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-marfil to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-marfil to-transparent sm:w-24" />

      <div className="marquee-track flex w-max animate-marquee items-center">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
            {ITEMS.map(({ Icon, label }) => (
              <div
                key={`${copy}-${label}`}
                className="flex shrink-0 items-center gap-2.5 px-6 sm:px-8"
              >
                <Icon className="h-5 w-5 shrink-0 text-dorado" />
                <span className="whitespace-nowrap text-sm font-medium uppercase tracking-widest text-cafe">
                  {label}
                </span>
                <span className="ml-6 h-1.5 w-1.5 shrink-0 rounded-full bg-beige sm:ml-8" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
