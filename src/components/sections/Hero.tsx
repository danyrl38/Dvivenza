"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";
import { HERO } from "@/lib/data";
import { TRANSITION_EASE } from "@/lib/motion";

export function Hero({
  imageSrc,
  productImageSrc,
}: {
  imageSrc?: string;
  productImageSrc?: string;
}) {
  const heroImage = imageSrc || "/images/hero.jpg";
  const productImage = productImageSrc || "/images/hero-producto.jpg";

  return (
    <section className="relative overflow-hidden bg-marfil pt-28 md:pt-32">
      {/* Ornamento sutil de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-dorado/10 blur-3xl"
      />

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
              className="mt-5 text-balance text-4xl font-medium leading-[1.08] text-chocolate sm:text-5xl md:text-6xl lg:text-7xl"
            >
              {HERO.title}
            </motion.h1>

            {/* Imagen del producto, justo debajo del título */}
            <motion.figure
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: TRANSITION_EASE, delay: 0.18 }}
              className="art-frame relative mt-7 max-w-md"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                <Image
                  src={productImage}
                  alt="Retrato personalizado hecho a mano por Dvivenza"
                  fill
                  sizes="(max-width: 1024px) 90vw, 420px"
                  className="object-cover"
                />
              </div>
              <figcaption className="absolute -right-3 -top-3 rounded-full bg-dorado px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-marfil shadow-soft-sm">
                Hecho a mano
              </figcaption>
            </motion.figure>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: TRANSITION_EASE, delay: 0.26 }}
              className="mt-7 max-w-lg text-pretty text-lg leading-relaxed text-cafe"
            >
              {HERO.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: TRANSITION_EASE, delay: 0.34 }}
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

          {/* Imagen principal */}
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
              className="absolute -bottom-6 -left-2 hidden rounded-2xl border border-beige/50 bg-marfil/90 px-6 py-4 shadow-soft backdrop-blur-sm sm:block lg:-left-6"
            >
              <p className="font-serif text-3xl font-semibold text-chocolate">100%</p>
              <p className="text-sm text-cafe">hecho a mano</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Banda infinita de ventajas */}
      <div className="mt-20 md:mt-24">
        <Marquee />
      </div>
    </section>
  );
}
