"use client";

import { useOrder } from "@/components/order/OrderContext";
import { TextAreaField } from "@/components/order/fields";
import { StepBudget } from "@/components/order/steps/StepBudget";

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

/** Paso 4: presupuesto + dirección de envío. */
export function StepEnvio() {
  const { data, setField } = useOrder();

  return (
    <div className="space-y-12">
      <section>
        <SubHeading hint="Nos ayuda a proponerte la mejor solución. Opcional.">
          Presupuesto estimado
        </SubHeading>
        <StepBudget />
      </section>

      <section className="border-t border-beige/50 pt-10">
        <SubHeading hint="¿A dónde enviaríamos tu obra? Puedes completarla después.">
          Dirección de envío
        </SubHeading>
        <TextAreaField
          id="shippingAddress"
          label="Dirección completa"
          optional
          rows={4}
          placeholder="Calle y número, colonia, ciudad, estado, código postal y referencias."
          autoComplete="street-address"
          value={data.shippingAddress}
          onChange={(e) => setField("shippingAddress", e.target.value)}
        />
      </section>
    </div>
  );
}
