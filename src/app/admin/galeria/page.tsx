import Link from "next/link";
import type { Metadata } from "next";

import { PRODUCTS } from "@/lib/data";
import { getSiteMedia } from "@/lib/siteMedia";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

import {
  deleteMedia,
  resetSiteMedia,
  updateMediaOrder,
  uploadMedia,
  upsertSiteMedia,
} from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Imágenes de la página — Dvivenza",
  robots: { index: false, follow: false },
};

interface MediaRow {
  id: string;
  kind: "image" | "video";
  public_url: string;
  alt: string | null;
  sort_order: number;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-marfil px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-content">{children}</div>
    </main>
  );
}

/** Editor de un hueco de imagen fijo (portada o producto). */
function SlotEditor({
  slot,
  label,
  currentUrl,
}: {
  slot: string;
  label: string;
  currentUrl: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-beige bg-white p-4 shadow-soft-sm">
      <div className="relative mb-3 aspect-[4/5] overflow-hidden rounded-xl bg-arena/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentUrl}
          alt={label}
          className="h-full w-full object-cover"
        />
      </div>
      <p className="mb-2 text-sm font-medium text-chocolate">{label}</p>
      <form action={upsertSiteMedia} className="mt-auto space-y-2">
        <input type="hidden" name="slot" value={slot} />
        <input
          type="file"
          name="file"
          accept="image/*"
          required
          className="block w-full rounded-xl border border-beige bg-marfil px-2 py-1.5 text-xs text-chocolate file:mr-2 file:rounded-full file:border-0 file:bg-chocolate file:px-3 file:py-1 file:text-marfil"
        />
        <button
          type="submit"
          className="w-full rounded-full bg-dorado px-3 py-1.5 text-xs font-semibold text-marfil transition-transform hover:scale-[1.02]"
        >
          Reemplazar imagen
        </button>
      </form>
      <form action={resetSiteMedia} className="mt-2">
        <input type="hidden" name="slot" value={slot} />
        <button
          type="submit"
          className="w-full rounded-full border border-beige px-3 py-1 text-[11px] text-cafe transition-colors hover:bg-arena/40"
        >
          Restaurar por defecto
        </button>
      </form>
    </div>
  );
}

export default async function GalleryAdminPage() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return (
      <Shell>
        <div className="rounded-3xl border border-beige bg-white p-10 text-center shadow-soft-sm">
          <h1 className="font-serif text-2xl text-chocolate">
            Base de datos no conectada
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-cafe">
            Configura las variables de Supabase en Vercel para poder gestionar
            las imágenes.
          </p>
        </div>
      </Shell>
    );
  }

  const siteMedia = await getSiteMedia();
  const { data } = await supabase
    .from("gallery_media")
    .select("id, kind, public_url, alt, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const media = (data ?? []) as MediaRow[];

  const heroUrl = siteMedia["hero"] || "/images/hero.jpg";
  const heroProductUrl =
    siteMedia["hero-producto"] || "/images/hero-producto.jpg";
  const productSlots = PRODUCTS.map((p) => ({
    slot: `product-${p.slug}`,
    label: p.name,
    currentUrl: siteMedia[`product-${p.slug}`] || p.image,
  }));

  return (
    <Shell>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-dorado">Dvivenza</p>
          <h1 className="font-serif text-3xl text-chocolate sm:text-4xl">
            Imágenes de la página
          </h1>
          <p className="mt-1 text-sm text-cafe">
            Cambia la portada, las fotos de productos y la galería. Máximo ~4 MB
            por archivo.
          </p>
        </div>
        <Link
          href="/admin"
          className="rounded-full border border-beige bg-white px-4 py-2 text-sm text-chocolate transition-colors hover:bg-arena/40"
        >
          ← Pedidos
        </Link>
      </header>

      {/* PORTADA */}
      <section className="mb-10">
        <h2 className="mb-4 font-serif text-xl text-chocolate">Portada (inicio)</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <SlotEditor slot="hero" label="Imagen grande de portada" currentUrl={heroUrl} />
          <SlotEditor
            slot="hero-producto"
            label="Imagen del producto (bajo el título)"
            currentUrl={heroProductUrl}
          />
        </div>
      </section>

      {/* PRODUCTOS */}
      <section className="mb-10">
        <h2 className="mb-4 font-serif text-xl text-chocolate">
          Fotos de productos
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {productSlots.map((s) => (
            <SlotEditor
              key={s.slot}
              slot={s.slot}
              label={s.label}
              currentUrl={s.currentUrl}
            />
          ))}
        </div>
      </section>

      {/* GALERÍA — subir */}
      <section className="mb-6">
        <h2 className="mb-4 font-serif text-xl text-chocolate">Galería</h2>
        <form
          action={uploadMedia}
          className="rounded-3xl border border-beige bg-white p-6 shadow-soft-sm"
        >
          <p className="text-sm text-cafe">
            Sube varias imágenes o videos a la vez (JPG, PNG, WEBP, MP4, WEBM).
            Máximo ~4 MB por archivo; para videos, usa clips cortos o
            comprimidos.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="block flex-1">
              <span className="mb-1 block text-sm font-medium text-chocolate">
                Archivos
              </span>
              <input
                type="file"
                name="files"
                accept="image/*,video/*"
                multiple
                required
                className="block w-full rounded-2xl border border-beige bg-marfil px-3 py-2 text-sm text-chocolate file:mr-3 file:rounded-full file:border-0 file:bg-chocolate file:px-4 file:py-1.5 file:text-marfil"
              />
            </label>
            <label className="block flex-1">
              <span className="mb-1 block text-sm font-medium text-chocolate">
                Descripción (opcional)
              </span>
              <input
                type="text"
                name="alt"
                placeholder="Ej. Retrato de familia"
                className="block w-full rounded-2xl border border-beige bg-marfil px-3 py-2.5 text-sm text-chocolate focus:border-dorado focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-dorado px-6 py-2.5 text-sm font-semibold text-marfil transition-transform hover:scale-[1.02]"
            >
              Subir
            </button>
          </div>
        </form>
      </section>

      {/* GALERÍA — medios actuales */}
      <section>
        <h3 className="mb-4 text-sm font-medium text-cafe">
          En la galería ({media.length})
        </h3>

        {media.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-beige bg-white/60 p-10 text-center">
            <p className="text-cafe">
              Aún no has subido medios a la galería. Mientras tanto se muestran
              las imágenes por defecto.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {media.map((item) => (
              <div
                key={item.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-beige bg-white shadow-soft-sm"
              >
                <div className="relative aspect-square overflow-hidden bg-arena/40">
                  {item.kind === "video" ? (
                    <video
                      src={item.public_url}
                      muted
                      loop
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.public_url}
                      alt={item.alt ?? ""}
                      className="h-full w-full object-cover"
                    />
                  )}
                  <span className="absolute left-2 top-2 rounded-full bg-chocolate/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-marfil">
                    {item.kind === "video" ? "Video" : "Foto"}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-2 p-3">
                  <form
                    action={updateMediaOrder}
                    className="flex items-center gap-2"
                  >
                    <input type="hidden" name="id" value={item.id} />
                    <label className="text-xs text-cafe" htmlFor={`ord-${item.id}`}>
                      Orden
                    </label>
                    <input
                      id={`ord-${item.id}`}
                      type="number"
                      name="sort_order"
                      defaultValue={item.sort_order}
                      className="w-16 rounded-lg border border-beige bg-marfil px-2 py-1 text-sm text-chocolate focus:border-dorado focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-arena px-2 py-1 text-xs font-medium text-chocolate hover:bg-beige"
                    >
                      OK
                    </button>
                  </form>

                  <form action={deleteMedia} className="mt-auto">
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      className="w-full rounded-lg border border-dorado/40 px-2 py-1 text-xs font-medium text-dorado transition-colors hover:bg-dorado hover:text-marfil"
                    >
                      Eliminar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="mt-8 text-center text-xs text-cafe/70">
        Los cambios aparecen en la página de inicio en unos segundos.
      </p>
    </Shell>
  );
}
