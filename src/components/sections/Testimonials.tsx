"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { SectionHeading } from "@/components/ui/Section";
import { TESTIMONIALS } from "@/lib/data";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 6000;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const count = TESTIMONIALS.length;

  const go = useCallback(
    (next: number) => {
      setDirection(next > index ? 1 : -1);
      setIndex((next + count) % count);
    },
    [index, count],
  );

  const next = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i + 1) % count);
  }, [count]);

  useEffect(() => {
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [next]);

  const current = TESTIMONIALS[index];

  return (
    <section id="opiniones" className="bg-chocolate py-20 text-marfil md:py-28 lg:py-32">
      <div className="container-content">
        <SectionHeading
          eyebrow="Opiniones"
          title="Historias que emocionan"
          className="[&_h2]:text-marfil [&_.eyebrow]:text-dorado [&_p]:text-arena/80"
          description="Lo que sienten quienes ya conservan su recuerdo hecho arte."
        />

        <div className="relative mx-auto mt-14 max-w-3xl">
          <div className="relative min-h-[280px] md:min-h-[240px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.blockquote
                key={current.id}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-6 flex gap-1" aria-label={`${current.rating} de 5 estrellas`}>
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <span key={i} className="text-dorado">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-balance font-serif text-2xl font-light leading-relaxed text-marfil md:text-3xl">
                  “{current.quote}”
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <span className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-dorado/40">
                    <Image
                      src={current.avatar}
                      alt={current.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </span>
                  <div className="text-left">
                    <p className="font-medium text-marfil">{current.name}</p>
                    <p className="text-sm text-arena/70">{current.location}</p>
                  </div>
                </div>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Controles */}
          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Opinión anterior"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-marfil/25 text-marfil transition-colors duration-300 hover:border-dorado hover:text-dorado"
            >
              ←
            </button>

            <div className="flex gap-2">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Ir a la opinión ${i + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === index ? "w-8 bg-dorado" : "w-2 bg-marfil/30 hover:bg-marfil/50",
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Siguiente opinión"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-marfil/25 text-marfil transition-colors duration-300 hover:border-dorado hover:text-dorado"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
