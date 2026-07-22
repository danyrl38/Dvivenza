import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { GALLERY } from "@/lib/data";
import { getGalleryMedia } from "@/lib/gallery";
import type { GalleryMediaItem } from "@/lib/types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Galería",
  description:
    "Todas las obras personalizadas de Dvivenza: retratos, mascotas, familia, prendas y más, hechas a mano.",
};

function Tile({ item }: { item: GalleryMediaItem }) {
  return (
    <figure className="group relative overflow-hidden rounded-2xl border border-beige/50 bg-arena/40 shadow-soft-sm">
      {item.kind === "video" ? (
        <video
          src={item.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : item.width && item.height ? (
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          decoding="async"
          className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-chocolate/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </figure>
  );
}

export default async function GaleriaPage() {
  const media = await getGalleryMedia();
  const items: GalleryMediaItem[] = media.length > 0 ? media : GALLERY;

  return (
    <>
      {/* Barra estática de la galería (bajo la barra principal) */}
      <div className="sticky top-16 z-40 border-b border-beige/60 bg-marfil/90 backdrop-blur-md md:top-20">
        <div className="container-content flex h-14 items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <Link
              href="/"
              className="text-sm text-cafe transition-colors hover:text-chocolate"
            >
              ← Inicio
            </Link>
            <span className="font-serif text-lg text-chocolate md:text-xl">
              Galería
            </span>
            <span className="hidden text-sm text-cafe/70 sm:inline">
              {items.length} obras
            </span>
          </div>

          <Link
            href="/pedido"
            className="rounded-full bg-chocolate px-5 py-2 text-sm font-medium text-marfil transition-all duration-300 hover:bg-cafe"
          >
            Empezar
          </Link>
        </div>
      </div>

      <section className="bg-marfil pb-24 pt-10 md:pb-32">
        <div className="container-content">
          <header className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Nuestro trabajo</p>
            <h1 className="mt-4 text-balance font-serif text-4xl font-medium leading-[1.1] text-chocolate md:text-5xl lg:text-6xl">
              Cada obra, una historia
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-cafe">
              Retratos, mascotas, parejas y familias — todos pintados a mano,
              pieza por pieza.
            </p>
          </header>

          <div className="masonry mt-14 columns-1 sm:columns-2 lg:columns-3">
            {items.map((item) => (
              <Tile key={item.id} item={item} />
            ))}
          </div>

          {/* CTA de cierre */}
          <div className="mx-auto mt-20 max-w-2xl rounded-3xl border border-beige/60 bg-arena/25 p-10 text-center">
            <h2 className="font-serif text-2xl text-chocolate md:text-3xl">
              ¿Ya tienes tu idea?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-pretty text-cafe">
              Cuéntanos qué recuerdo quieres transformar y te enviamos una
              cotización sin compromiso.
            </p>
            <Link
              href="/pedido"
              className="mt-7 inline-block rounded-full bg-dorado px-8 py-3 text-sm font-semibold text-marfil shadow-soft-sm transition-transform duration-300 hover:scale-[1.03]"
            >
              Empezar mi obra
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
