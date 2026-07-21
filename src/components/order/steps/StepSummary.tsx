"use client";

import { useOrder } from "@/components/order/OrderContext";
import { ART_TYPE_OPTIONS, BUDGET_OPTIONS } from "@/lib/data";
import { formatDateEs } from "@/lib/utils";

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 border-b border-beige/50 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <dt className="text-sm uppercase tracking-wide text-cafe/70">{label}</dt>
      <dd className="text-pretty text-chocolate sm:text-right">{value}</dd>
    </div>
  );
}

export function StepSummary() {
  const { data, references } = useOrder();

  const artTypeLabel =
    ART_TYPE_OPTIONS.find((o) => o.value === data.artType)?.label ?? "—";
  const budgetLabel =
    BUDGET_OPTIONS.find((o) => o.value === data.budget)?.label ?? "";

  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-1 font-serif text-xl text-chocolate">Tus datos</h3>
        <dl>
          <Row label="Nombre" value={data.fullName} />
          <Row label="Correo" value={data.email} />
          <Row label="WhatsApp" value={data.whatsapp} />
          <Row label="Ciudad" value={data.city} />
          <Row label="País" value={data.country} />
        </dl>
      </section>

      <section>
        <h3 className="mb-1 font-serif text-xl text-chocolate">Tu obra</h3>
        <dl>
          <Row label="Tipo de obra" value={artTypeLabel} />
          <Row label="Descripción" value={data.description} />
          <Row label="Personas" value={data.peopleCount} />
          <Row label="Tamaño" value={data.size} />
          <Row label="Material" value={data.material} />
          <Row label="Marco" value={data.frame} />
          <Row label="Texto personalizado" value={data.customText} />
          <Row label="Colores especiales" value={data.specialColors} />
          <Row
            label="Fecha deseada"
            value={data.desiredDate ? formatDateEs(data.desiredDate) : ""}
          />
          <Row label="Presupuesto" value={budgetLabel} />
        </dl>
      </section>

      {references.length > 0 && (
        <section>
          <h3 className="mb-3 font-serif text-xl text-chocolate">
            Referencias ({references.length})
          </h3>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {references.map((ref) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={ref.id}
                src={ref.previewUrl}
                alt={ref.file.name}
                className="aspect-square w-full rounded-xl border border-beige object-cover"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
