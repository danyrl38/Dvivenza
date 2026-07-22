"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { IconCheck } from "@/components/ui/Icons";
import { Section, SectionHeading } from "@/components/ui/Section";
import { HOW_STEPS } from "@/lib/data";
import { fadeUp, staggerContainer, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function HowItWorks() {
  const [done, setDone] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setDone((prev) => ({ ...prev, [key]: !prev[key] }));

  const completed = HOW_STEPS.filter((s) => done[s.number]).length;
  const total = HOW_STEPS.length;
  const allDone = completed === total;

  return (
    <Section id="como-funciona" className="bg-marfil paper-texture">
      <SectionHeading
        eyebrow="Cómo funciona"
        title="Tu recuerdo, en tres pasos"
        description="Marca cada paso conforme lo entiendas y, al terminar, empieza tu obra. Un proceso simple y cuidado."
      />

      {/* Progreso */}
      <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-2">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-arena">
          <motion.div
            className="h-full rounded-full bg-dorado"
            initial={false}
            animate={{ width: `${(completed / total) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <p className="text-sm text-cafe">
          {completed} de {total} pasos completados
        </p>
      </div>

      <motion.ol
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="mt-12 grid gap-8 md:mt-14 md:grid-cols-3 md:gap-6 lg:gap-10"
      >
        {HOW_STEPS.map((step) => {
          const checked = Boolean(done[step.number]);
          return (
            <motion.li key={step.number} variants={fadeUp}>
              <button
                type="button"
                onClick={() => toggle(step.number)}
                aria-pressed={checked}
                className={cn(
                  "group relative flex h-full w-full flex-col rounded-3xl border p-8 text-left transition-all duration-300 lg:p-10",
                  checked
                    ? "border-dorado bg-arena/50 shadow-soft"
                    : "border-beige/50 bg-arena/20 hover:border-dorado/40 hover:bg-arena/40 hover:shadow-soft",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={cn(
                      "font-serif text-6xl font-light transition-colors duration-300",
                      checked ? "text-dorado" : "text-dorado/50 group-hover:text-dorado",
                    )}
                  >
                    {step.number}
                  </span>

                  {/* Casilla */}
                  <span
                    className={cn(
                      "mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                      checked
                        ? "border-dorado bg-dorado text-marfil"
                        : "border-beige bg-marfil text-transparent group-hover:border-dorado/60",
                    )}
                  >
                    <IconCheck className="h-4 w-4" />
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-medium text-chocolate">
                  {step.title}
                </h3>
                <p className="mt-3 text-pretty leading-relaxed text-cafe">
                  {step.description}
                </p>
              </button>
            </motion.li>
          );
        })}
      </motion.ol>

      {/* CTA final */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.5 }}
        className={cn(
          "mx-auto mt-14 max-w-2xl rounded-3xl border p-8 text-center transition-all duration-500 md:p-10",
          allDone
            ? "border-dorado bg-arena/50 shadow-soft"
            : "border-beige/60 bg-arena/20",
        )}
      >
        <h3 className="font-serif text-2xl text-chocolate md:text-3xl">
          {allDone ? "¡Todo claro! Empecemos tu obra" : "¿Todo listo para empezar?"}
        </h3>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-cafe">
          Cuéntanos tu idea y sube tus fotos de referencia. Te enviamos una
          cotización sin compromiso.
        </p>
        <div className="mt-7 flex justify-center">
          <Button href="/pedido" size="lg">
            Enviar mis datos y cotizar
          </Button>
        </div>
      </motion.div>
    </Section>
  );
}
