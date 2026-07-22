"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { SectionHeading } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Skeleton";
import { GALLERY } from "@/lib/data";
import type { GalleryMediaItem } from "@/lib/types";
import { cn } from "@/lib/utils";

function GalleryTile({ item }: { item: GalleryMediaItem }) {
  const [loaded, setLoaded] = useState(false);

  if (item.kind === "video") {
    return (
      <div className="group relative overflow-hidden rounded-2xl bg-arena/40 shadow-soft-sm">
        <video
          src={item.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-chocolate/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-arena/40 shadow-soft-sm">
      {!loaded && <Skeleton className="absolute inset-0 rounded-2xl" />}
      {item.width && item.height ? (
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onLoad={() => setLoaded(true)}
          className={cn(
            "h-auto w-full object-cover transition-all duration-500 group-hover:scale-[1.03]",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      ) : (
        // Medios subidos por el administrador (sin dimensiones conocidas).
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={cn(
            "h-auto w-full object-cover transition-all duration-500 group-hover:scale-[1.03]",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-chocolate/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}

export function Gallery({ media }: { media?: GalleryMediaItem[] }) {
  // Usa los medios gestionados en Supabase si existen; si no, los de por defecto.
  const items: GalleryMediaItem[] =
    media && media.length > 0 ? media : GALLERY;

  return (
    <section id="galeria" className="bg-arena/20 py-20 md:py-28 lg:py-32">
      <div className="container-content">
        <SectionHeading
          eyebrow="Galería"
          title="Obras que guardan historias"
          description="Cada pieza es única. Explora algunos de los recuerdos que hemos transformado en arte."
        />

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
                <GalleryTile item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
