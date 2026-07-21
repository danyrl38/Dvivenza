"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { Section, SectionHeading } from "@/components/ui/Section";
import { PRODUCTS } from "@/lib/data";
import { fadeUp, staggerContainer, VIEWPORT } from "@/lib/motion";

export function Products() {
  return (
    <Section id="productos" className="bg-marfil">
      <SectionHeading
        eyebrow="Productos"
        title="Piezas hechas para durar"
        description="Elige el formato perfecto para tu recuerdo. Todas nuestras obras se crean a mano, con materiales cuidadosamente seleccionados."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {PRODUCTS.map((product) => (
          <motion.article
            key={product.slug}
            variants={fadeUp}
            className="group flex flex-col overflow-hidden rounded-3xl border border-beige/40 bg-marfil transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft-lg"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-arena/40">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-7">
              <h3 className="text-2xl font-medium text-chocolate">
                {product.name}
              </h3>
              <p className="mt-3 flex-1 text-pretty leading-relaxed text-cafe">
                {product.description}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-beige/50 pt-5">
                <span className="text-sm text-cafe/80">
                  <span className="block text-xs uppercase tracking-widest text-dorado">
                    Producción
                  </span>
                  {product.productionTime}
                </span>
                <Link
                  href={`/pedido?tipo=${product.artType}`}
                  className="rounded-full bg-arena/60 px-5 py-2.5 text-sm font-medium text-chocolate transition-all duration-300 hover:bg-chocolate hover:text-marfil"
                >
                  Personalizar
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  );
}
