"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { PRODUCTS } from "@/lib/data";
import { fadeUp, staggerContainer, VIEWPORT } from "@/lib/motion";

// -----------------------------------------------------------------------------
// Sección "Productos" — muro de galería.
// Fondo oscuro (cacao) que la diferencia del resto del sitio, obras montadas
// con passepartout como cuadros colgados, y un color de acento por tipo de
// producto para dar jerarquía y diferenciación.
// -----------------------------------------------------------------------------

const ACCENT: Record<string, { bar: string; dot: string; tag: string }> = {
  "retrato-pintado": { bar: "bg-dorado", dot: "bg-dorado", tag: "Retrato" },
  "cuadro-personalizado": { bar: "bg-uva", dot: "bg-uva", tag: "Cuadro" },
  "funda-personalizada": { bar: "bg-menta", dot: "bg-menta", tag: "Funda" },
  "prenda-personalizada": { bar: "bg-sol", dot: "bg-sol", tag: "Prenda" },
  "arte-para-regalos": { bar: "bg-cafe", dot: "bg-cafe", tag: "Regalo" },
  accesorios: { bar: "bg-beige", dot: "bg-beige", tag: "Accesorio" },
};

const fallbackAccent = { bar: "bg-dorado", dot: "bg-dorado", tag: "Obra" };

function Tag({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-arena/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cafe">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

/** Esquinas decorativas tipo marco. */
function FrameCorners() {
  const corner = "absolute h-5 w-5 border-dorado/50";
  return (
    <span aria-hidden>
      <span className={`${corner} left-2 top-2 border-l border-t`} />
      <span className={`${corner} right-2 top-2 border-r border-t`} />
      <span className={`${corner} bottom-2 left-2 border-b border-l`} />
      <span className={`${corner} bottom-2 right-2 border-b border-r`} />
    </span>
  );
}

export function Products({ images }: { images?: Record<string, string> }) {
  return (
    <section
      id="productos"
      className="paper-texture relative overflow-hidden bg-chocolate py-20 md:py-28 lg:py-32"
    >
      {/* Halos suaves de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-dorado/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-uva/10 blur-3xl"
      />

      <div className="container-content relative">
        {/* Encabezado (versión clara sobre fondo oscuro) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-dorado">
            Productos
          </span>
          <h2 className="max-w-3xl text-balance font-serif text-4xl font-medium leading-[1.1] text-marfil md:text-5xl lg:text-6xl">
            Piezas hechas para durar
          </h2>
          <p className="mx-auto max-w-2xl text-pretty leading-relaxed text-arena/80 md:text-lg">
            Elige el formato perfecto para tu recuerdo. Todas nuestras obras se
            crean a mano, con materiales cuidadosamente seleccionados.
          </p>
          <span className="mt-2 h-px w-24 bg-gradient-to-r from-transparent via-dorado to-transparent" />
        </motion.div>

        {/* Todos los productos, del mismo tamaño */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {PRODUCTS.map((product) => {
            const accent = ACCENT[product.slug] ?? fallbackAccent;
            return (
              <motion.article
                key={product.slug}
                variants={fadeUp}
                className="group flex flex-col overflow-hidden rounded-3xl bg-marfil shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft-lg"
              >
                <span className={`block h-1.5 w-full ${accent.bar}`} />
                {/* Passepartout */}
                <div className="p-3">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-beige/70 bg-arena/40">
                    <Image
                      src={images?.[`product-${product.slug}`] || product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <FrameCorners />
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 px-6 pb-7">
                  <Tag dot={accent.dot} label={accent.tag} />
                  <h3 className="font-serif text-2xl font-medium text-chocolate">
                    {product.name}
                  </h3>
                  <p className="flex-1 text-pretty text-sm leading-relaxed text-cafe">
                    {product.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3 border-t border-beige/60 pt-4">
                    <span className="text-sm text-cafe/80">
                      <span className="block text-[10px] uppercase tracking-widest text-dorado">
                        Producción
                      </span>
                      {product.productionTime}
                    </span>
                    <Link
                      href={`/pedido?tipo=${product.artType}`}
                      className="rounded-full bg-arena/70 px-4 py-2 text-sm font-medium text-chocolate transition-all duration-300 hover:bg-chocolate hover:text-marfil"
                    >
                      Personalizar
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
