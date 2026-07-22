"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { HERO } from "@/lib/data";
import { TRANSITION_EASE } from "@/lib/motion";

export function Hero({ imageSrc }: { imageSrc?: string }) {
  const heroImage = imageSrc || "/images/hero.jpg";
  return (
    <section className="relative overflow-hidden bg-marfil pt-28 md:pt-32">
      <div className="container-content">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* Texto */}
          <div className="max-w-xl">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: TRANSITION_EASE }}
              className="eyebrow"
            >
              {HERO.eyebrow}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: TRANSITION_EASE, delay: 0.1 }}
              className="mt-5 text-balance text-5xl font-medium leading-[1.05] text-chocolate md:text-6xl lg:text-7xl"
            >
              {HERO.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: TRANSITION_EASE, delay: 0.2 }}
              className="mt-6 max-w-lg text-pretty text-lg leading-relaxed text-cafe"
            >
              {HERO.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: TRANSITION_EASE, delay: 0.3 }}
              className="mt-9 flex flex-col gap-4 sm:flex-row"
            >
              <Button href="/pedido" size="lg">
                {HERO.primaryCta}
              </Button>
              <Button href="/#galeria" variant="secondary" size="lg">
                {HERO.secondaryCta}
              </Button>
            </motion.div>
          </div>

          {/* Imagen */}
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: TRANSITION_EASE, delay: 0.15 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-soft-lg">
              <Image
                src={heroImage}
                alt="Obra de arte personalizada hecha a mano por Dvivenza"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {/* Detalle flotante */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: TRANSITION_EASE, delay: 0.6 }}
              className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-beige/50 bg-marfil/90 px-6 py-4 shadow-soft backdrop-blur-sm sm:block"
            >
              <p className="font-serif text-3xl font-semibold text-chocolate">100%</p>
              <p className="text-sm text-cafe">hecho a mano</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Barra de confianza */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-20 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 border-t border-beige/50 pt-10 text-center text-sm uppercase tracking-widest text-cafe/70 md:mt-24"
        >
          <span>Piezas únicas</span>
          <span className="hidden md:inline">·</span>
          <span>Envíos a todo el país</span>
          <span className="hidden md:inline">·</span>
          <span>Atención personalizada</span>
        </motion.div>
      </div>
    </section>
  );
}
