import Link from "next/link";
import type { Metadata } from "next";

import { getSupabaseAdminClient } from "@/lib/supabase/server";

import { deleteMedia, updateMediaOrder, uploadMedia } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galería — Dvivenza",
  robots: { index: false, follow: false },
};

const CATEGORIES = [
  { value: "retratos", label: "Retratos" },
  { value: "mascotas", label: "Mascotas" },
  { value: "parejas", label: "Parejas" },
  { value: "familia", label: "Familia" },
  { value: "prendas", label: "Prendas" },
  { value: "fundas", label: "Fundas" },
];

interface MediaRow {
  id: string;
  kind: "image" | "video";
  public_url: string;
  alt: string | null;
  category: string | null;
  sort_order: number;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-marfil px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-content">{children}</div>
    </main>
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
            Configura las variables de Supabase en Vercel para poder gestionar la
            galería.
          </p>
        </div>
      </Shell>
    );
  }

  const { data } = await supabase
    .from("gallery_media")
    .select("id, kind, public_url, alt, category, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const media = (data ?? []) as MediaRow[];

  return (
    <Shell>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-dorado">Dvivenza</p>
          <h1 className="font-serif text-3xl text-chocolate sm:text-4xl">
            Galería de la página
          </h1>
          <p className="mt-1 text-sm text-cafe">
            Sube tus fotos o videos y elige cuáles se muestran en el inicio.
          </p>
        </div>
        <Link
          href="/admin"
          className="rounded-full border border-beige bg-white px-4 py-2 text-sm text-chocolate transition-colors hover:bg-arena/40"
        >
          ← Pedidos
        </Link>
      </header>

      {/* Formulario de subida */}
      <form
        action={uploadMedia}
        className="mb-10 rounded-3xl border border-beige bg-white p-6 shadow-soft-sm"
      >
        <h2 className="font-serif text-xl text-chocolate">Subir medios</h2>
        <p className="mt-1 text-sm text-cafe">
          Puedes seleccionar varias imágenes o videos a la vez (JPG, PNG, WEBP,
          MP4, WEBM). Máximo ~4 MB por archivo; para videos, usa clips cortos o
          comprimidos.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
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

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-chocolate">
              Categoría (para los filtros)
            </span>
            <select
              name="category"
              defaultValue="retratos"
              className="block w-full rounded-2xl border border-beige bg-marfil px-3 py-2.5 text-sm text-chocolate focus:border-dorado focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-1 block text-sm font-medium text-chocolate">
            Descripción / texto alternativo (opcional)
          </span>
          <input
            type="text"
            name="alt"
            placeholder="Ej. Retrato de familia en tonos cálidos"
            className="block w-full rounded-2xl border border-beige bg-marfil px-3 py-2.5 text-sm text-chocolate focus:border-dorado focus:outline-none"
          />
        </label>

        <button
          type="submit"
          className="mt-5 rounded-full bg-dorado px-6 py-2.5 text-sm font-semibold text-marfil transition-transform hover:scale-[1.02]"
        >
          Subir a la galería
        </button>
      </form>

      {/* Medios actuales */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-chocolate">
            En la galería ({media.length})
          </h2>
        </div>

        {media.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-beige bg-white/60 p-12 text-center">
            <p className="text-cafe">
              Aún no has subido medios. Mientras tanto, la página muestra las
              imágenes por defecto. En cuanto subas la primera, tomarán su lugar.
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
                  <p className="text-xs text-cafe">{item.category}</p>

                  {/* Orden */}
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

                  {/* Eliminar */}
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
        Los cambios aparecen en la página de inicio en unos segundos (menor número
        de orden = se muestra primero).
      </p>
    </Shell>
  );
}
