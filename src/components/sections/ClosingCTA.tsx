"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { fadeUp, VIEWPORT } from "@/lib/motion";

export function ClosingCTA() {
  return (
    <section className="bg-arena/30 py-20 md:py-28">
      <div className="container-content">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="relative overflow-hidden rounded-[2.5rem] bg-chocolate px-8 py-16 text-center text-marfil md:px-16 md:py-24"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-dorado/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-cafe/20 blur-3xl" />

          <span className="eyebrow relative text-dorado">Tu recuerdo merece perdurar</span>
          <h2 className="relative mx-auto mt-5 max-w-2xl text-balance text-4xl font-medium leading-tight md:text-5xl lg:text-6xl">
            Convirtamos tu momento en una obra de arte
          </h2>
          <p className="relative mx-auto mt-6 max-w-xl text-pretty text-lg text-arena/80">
            Cuéntanos tu idea y recibe una cotización personalizada. Sin compromiso.
          </p>
          <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/pedido" variant="inverse" size="lg">
              Crear mi obra
            </Button>
            <Button href="/#galeria" variant="ghostLight" size="lg">
              Ver galería
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
