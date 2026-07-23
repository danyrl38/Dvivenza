"use client";

import { StepDeliveryDate } from "@/components/order/steps/StepDeliveryDate";
import { StepDetails } from "@/components/order/steps/StepDetails";
import { StepReferences } from "@/components/order/steps/StepReferences";

function SubHeading({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-4">
      <h3 className="font-serif text-lg text-chocolate md:text-xl">{children}</h3>
      {hint && <p className="mt-1 text-sm text-cafe/70">{hint}</p>}
    </div>
  );
}

/** Paso 3: imágenes de referencia + detalles + fecha de entrega. */
export function StepReferencesDetails() {
  return (
    <div className="space-y-12">
      <section>
        <SubHeading hint="Sube fotos que nos ayuden a capturar tu idea (opcional).">
          Imágenes de referencia
        </SubHeading>
        <StepReferences />
      </section>

      <section className="border-t border-beige/50 pt-10">
        <SubHeading hint="Afina tu pieza. Todos estos campos son opcionales.">
          Detalles de la pieza
        </SubHeading>
        <StepDetails />
      </section>

      <section className="border-t border-beige/50 pt-10">
        <SubHeading>Fecha de entrega deseada</SubHeading>
        <StepDeliveryDate />
      </section>
    </div>
  );
}
