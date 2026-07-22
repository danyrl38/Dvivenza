"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";

import { IconArrowLeft, IconArrowRight } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/Section";
import { GALLERY } from "@/lib/data";
import { VIEWPORT } from "@/lib/motion";
import type { GalleryMediaItem } from "@/lib/types";

/** Tarjeta del carrusel: altura fija, ancho automático → conserva la forma. */
function CarouselTile({ item }: { item: GalleryMediaItem }) {
  const shared =
    "h-full w-auto max-w-[85vw] object-cover transition-transform duration-500 group-hover:scale-[1.04]";

  return (
    <figure className="group relative h-[320px] shrink-0 snap-start overflow-hidden rounded-2xl border border-beige/50 bg-arena/40 shadow-soft-sm sm:h-[400px] lg:h-[440px]">
      {item.kind === "video" ? (
        <video
          src={item.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className={shared}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          decoding="async"
          className={shared}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-chocolate/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </figure>
  );
}

export function Gallery({ media }: { media?: GalleryMediaItem[] }) {
  const scroller = useRef<HTMLDivElement>(null);

  // Usa los medios gestionados en Supabase si existen; si no, los de por defecto.
  const all: GalleryMediaItem[] = media && media.length > 0 ? media : GALLERY;
  // En la home mostramos una selección; el resto vive en /galeria.
  const items = all.slice(0, 12);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };

  return (
    <section id="galeria" className="bg-arena/20 py-20 md:py-28 lg:py-32">
      <div className="container-content">
        <SectionHeading
          eyebrow="Galería"
          title="Obras que guardan historias"
          description="Cada pieza es única. Explora algunos de los recuerdos que hemos transformado en arte."
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.6 }}
        className="relative mt-12"
      >
        {/* Pista del carrusel (sangrado a los bordes) */}
        <div
          ref={scroller}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-2 md:px-10"
        >
          {items.map((item) => (
            <CarouselTile key={item.id} item={item} />
          ))}
        </div>

        {/* Flechas */}
        <div className="container-content mt-8 flex items-center justify-between gap-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Ver obras anteriores"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-beige bg-marfil text-chocolate transition-all duration-300 hover:border-chocolate hover:bg-chocolate hover:text-marfil"
            >
              <IconArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Ver más obras"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-beige bg-marfil text-chocolate transition-all duration-300 hover:border-chocolate hover:bg-chocolate hover:text-marfil"
            >
              <IconArrowRight className="h-5 w-5" />
            </button>
          </div>

          <Link
            href="/galeria"
            className="rounded-full border border-chocolate px-6 py-2.5 text-sm font-medium text-chocolate transition-all duration-300 hover:bg-chocolate hover:text-marfil"
          >
            Ver más obras
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
