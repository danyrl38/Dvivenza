"use client";

import { motion } from "framer-motion";

import { Section, SectionHeading } from "@/components/ui/Section";
import { COMPARISONS } from "@/lib/data";

const SWEEP = {
  duration: 7,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

function Comparator({
  antes,
  despues,
  label,
}: {
  antes: string;
  despues: string;
  label: string;
}) {
  return (
    <figure>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-beige/50 shadow-soft">
        {/* Después (obra final): capa base */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={despues}
          alt={`${label} — obra final pintada a mano`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Antes (foto original): capa recortada que se anima */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src={antes}
          alt={`${label} — fotografía original`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ clipPath: "inset(0 50% 0 0)" }}
          animate={{
            clipPath: [
              "inset(0 82% 0 0)",
              "inset(0 12% 0 0)",
              "inset(0 82% 0 0)",
            ],
          }}
          transition={SWEEP}
        />

        {/* Línea divisoria que se desliza */}
        <motion.div
          className="absolute inset-y-0 z-10 w-[3px] -translate-x-1/2 bg-marfil"
          initial={{ left: "50%" }}
          animate={{ left: ["18%", "88%", "18%"] }}
          transition={SWEEP}
        >
          <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-marfil text-sm text-chocolate shadow-soft-sm">
            ⇆
          </span>
        </motion.div>

        {/* Etiquetas */}
        <span className="absolute left-3 top-3 z-10 rounded-full bg-chocolate/75 px-3 py-1 text-xs font-medium text-marfil backdrop-blur-sm">
          Antes
        </span>
        <span className="absolute right-3 top-3 z-10 rounded-full bg-dorado/90 px-3 py-1 text-xs font-medium text-marfil backdrop-blur-sm">
          Después
        </span>
      </div>
      <figcaption className="mt-3 text-center text-sm font-medium text-cafe">
        {label}
      </figcaption>
    </figure>
  );
}

export function BeforeAfter() {
  if (COMPARISONS.length === 0) return null;

  return (
    <Section id="antes-despues" className="bg-arena/20">
      <SectionHeading
        eyebrow="Antes y después"
        title="De la foto a la obra"
        description="Cada retrato nace de una fotografía y cobra vida pintado a mano. Observa la transformación."
      />
      <div className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-2">
        {COMPARISONS.map((c) => (
          <Comparator
            key={c.id}
            antes={c.antes}
            despues={c.despues}
            label={c.label}
          />
        ))}
      </div>
    </Section>
  );
}
