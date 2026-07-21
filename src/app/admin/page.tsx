import type { Metadata } from "next";

import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/types";
import { formatDateEs } from "@/lib/utils";

import { updateOrderStatus } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel de pedidos — Dvivenza",
  robots: { index: false, follow: false },
};

const STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "referencias";

const ART_LABELS: Record<string, string> = {
  retrato: "Retrato",
  mascota: "Mascota",
  pareja: "Pareja",
  familia: "Familia",
  prenda: "Prenda",
  funda: "Funda",
  otro: "Otro",
};

const STATUS_META: Record<OrderStatus, { label: string; className: string }> = {
  nuevo: { label: "Nuevo", className: "bg-dorado/20 text-chocolate" },
  en_revision: { label: "En revisión", className: "bg-arena text-cafe" },
  cotizado: { label: "Cotizado", className: "bg-beige/60 text-chocolate" },
  en_produccion: {
    label: "En producción",
    className: "bg-cafe/20 text-chocolate",
  },
  entregado: { label: "Entregado", className: "bg-[#3f6b4f]/15 text-[#3f6b4f]" },
  cancelado: { label: "Cancelado", className: "bg-[#a3564f]/12 text-[#a3564f]" },
};

const STATUS_ORDER: OrderStatus[] = [
  "nuevo",
  "en_revision",
  "cotizado",
  "en_produccion",
  "entregado",
  "cancelado",
];

interface AdminOrder {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  whatsapp: string | null;
  city: string | null;
  country: string | null;
  art_type: string;
  description: string;
  people_count: string | null;
  size: string | null;
  material: string | null;
  frame: string | null;
  custom_text: string | null;
  special_colors: string | null;
  desired_date: string | null;
  budget: string | null;
  reference_paths: string[] | null;
  status: OrderStatus;
  comments: string | null;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-marfil px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-content">{children}</div>
    </main>
  );
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <Shell>
      <div className="rounded-3xl border border-beige bg-white p-10 text-center shadow-soft-sm">
        <h1 className="font-serif text-2xl text-chocolate">{title}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-cafe">{body}</p>
      </div>
    </Shell>
  );
}

export default async function AdminPage() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return (
      <Notice
        title="Base de datos no conectada"
        body="Configura las variables de Supabase (NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY) en Vercel para ver los pedidos."
      />
    );
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <Notice
        title="No pudimos cargar los pedidos"
        body={error.message}
      />
    );
  }

  const orders = (data ?? []) as AdminOrder[];

  // Enlaces firmados (bucket privado) para las imágenes de referencia.
  const signedByOrder: Record<string, string[]> = {};
  await Promise.all(
    orders.map(async (order) => {
      if (!order.reference_paths?.length) return;
      const urls = await Promise.all(
        order.reference_paths.map(async (path) => {
          const { data: signed } = await supabase.storage
            .from(STORAGE_BUCKET)
            .createSignedUrl(path, 60 * 60);
          return signed?.signedUrl ?? null;
        }),
      );
      signedByOrder[order.id] = urls.filter((u): u is string => Boolean(u));
    }),
  );

  const counts = STATUS_ORDER.map((status) => ({
    status,
    count: orders.filter((o) => o.status === status).length,
  }));

  return (
    <Shell>
      <header className="mb-8 flex flex-col gap-1">
        <p className="text-xs uppercase tracking-widest text-dorado">Dvivenza</p>
        <h1 className="font-serif text-3xl text-chocolate sm:text-4xl">
          Panel de pedidos
        </h1>
        <p className="text-sm text-cafe">
          {orders.length} solicitud{orders.length === 1 ? "" : "es"} en total.
        </p>
      </header>

      {/* Resumen por estado */}
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {counts.map(({ status, count }) => (
          <div
            key={status}
            className="rounded-2xl border border-beige bg-white p-4 shadow-soft-sm"
          >
            <p className="text-2xl font-semibold text-chocolate">{count}</p>
            <p className="mt-1 text-xs text-cafe">{STATUS_META[status].label}</p>
          </div>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-beige bg-white/60 p-12 text-center">
          <p className="text-cafe">
            Aún no hay pedidos. Cuando un cliente envíe una solicitud, aparecerá
            aquí.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {orders.map((order) => {
            const refs = signedByOrder[order.id] ?? [];
            const meta = STATUS_META[order.status] ?? STATUS_META.nuevo;
            return (
              <article
                key={order.id}
                className="flex flex-col rounded-3xl border border-beige bg-white p-6 shadow-soft-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-xl text-chocolate">
                      {order.full_name}
                    </h2>
                    <p className="text-sm text-cafe">
                      {ART_LABELS[order.art_type] || order.art_type}
                      {order.people_count ? ` · ${order.people_count}` : ""}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${meta.className}`}
                  >
                    {meta.label}
                  </span>
                </div>

                <p className="mt-4 whitespace-pre-line rounded-2xl bg-marfil px-4 py-3 text-sm leading-relaxed text-chocolate">
                  {order.description}
                </p>

                {/* Datos de contacto y detalles */}
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <Field label="Email">
                    <a
                      href={`mailto:${order.email}`}
                      className="text-cafe underline-offset-2 hover:underline"
                    >
                      {order.email}
                    </a>
                  </Field>
                  {order.whatsapp ? (
                    <Field label="WhatsApp">
                      <a
                        href={`https://wa.me/${order.whatsapp.replace(/\D/g, "")}`}
                        className="text-cafe underline-offset-2 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {order.whatsapp}
                      </a>
                    </Field>
                  ) : null}
                  {(order.city || order.country) && (
                    <Field label="Ubicación">
                      {[order.city, order.country].filter(Boolean).join(", ")}
                    </Field>
                  )}
                  {order.desired_date && (
                    <Field label="Fecha deseada">
                      {formatDateEs(order.desired_date)}
                    </Field>
                  )}
                  {order.budget && <Field label="Presupuesto">{order.budget}</Field>}
                  {order.size && <Field label="Tamaño">{order.size}</Field>}
                  {order.material && <Field label="Material">{order.material}</Field>}
                  {order.frame && <Field label="Marco">{order.frame}</Field>}
                  {order.custom_text && (
                    <Field label="Texto">{order.custom_text}</Field>
                  )}
                  {order.special_colors && (
                    <Field label="Colores">{order.special_colors}</Field>
                  )}
                </dl>

                {/* Imágenes de referencia */}
                {refs.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-cafe/70">
                      Referencias ({refs.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {refs.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block h-16 w-16 overflow-hidden rounded-xl border border-beige"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt={`Referencia ${i + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pie: fecha + cambio de estado */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-beige pt-4">
                  <span className="text-xs text-cafe/70">
                    {formatDateEs(order.created_at.slice(0, 10))}
                  </span>
                  <form action={updateOrderStatus} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={order.id} />
                    <label className="sr-only" htmlFor={`status-${order.id}`}>
                      Cambiar estado
                    </label>
                    <select
                      id={`status-${order.id}`}
                      name="status"
                      defaultValue={order.status}
                      className="rounded-full border border-beige bg-marfil px-3 py-1.5 text-sm text-chocolate focus:border-dorado focus:outline-none"
                    >
                      {STATUS_ORDER.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_META[status].label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="rounded-full bg-chocolate px-4 py-1.5 text-sm font-medium text-marfil transition-colors hover:bg-cafe"
                    >
                      Guardar
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </Shell>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs text-cafe/60">{label}</dt>
      <dd className="text-chocolate">{children}</dd>
    </div>
  );
}
