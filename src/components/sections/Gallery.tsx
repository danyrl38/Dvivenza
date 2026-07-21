"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { SectionHeading } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Skeleton";
import { GALLERY, GALLERY_FILTERS } from "@/lib/data";
import type { GalleryCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

type Filter = GalleryCategory | "todos";

function GalleryImage({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-arena/40 shadow-soft-sm">
      {!loaded && <Skeleton className="absolute inset-0 rounded-2xl" />}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        onLoad={() => setLoaded(true)}
        className={cn(
          "h-auto w-full object-cover transition-all duration-500 group-hover:scale-[1.03]",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-chocolate/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}

export function Gallery() {
  const [filter, setFilter] = useState<Filter>("todos");

  const items = useMemo(
    () =>
      filter === "todos"
        ? GALLERY
        : GALLERY.filter((item) => item.category === filter),
    [filter],
  );

  return (
    <section id="galeria" className="bg-arena/20 py-20 md:py-28 lg:py-32">
      <div className="container-content">
        <SectionHeading
          eyebrow="Galería"
          title="Obras que guardan historias"
          description="Cada pieza es única. Explora algunos de los recuerdos que hemos transformado en arte."
        />

        {/* Filtros */}
        <div className="mt-12 flex flex-wrap justify-center gap-2 md:gap-3">
          {GALLERY_FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                aria-pressed={active}
                className={cn(
                  "relative rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300",
                  active ? "text-marfil" : "text-cafe hover:text-chocolate",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="gallery-filter-pill"
                    className="absolute inset-0 rounded-full bg-chocolate"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Masonry */}
        <motion.div
          layout
          className="masonry mt-12 columns-1 sm:columns-2 lg:columns-3"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35 }}
              >
                <GalleryImage
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
