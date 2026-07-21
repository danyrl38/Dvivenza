"use client";

import { useOrder } from "@/components/order/OrderContext";
import { TextAreaField } from "@/components/order/fields";

const PLACEHOLDER =
  "Cuéntanos la historia detrás de esta obra. Describe cómo la imaginas, colores, estilo, emociones o cualquier detalle importante.";

export function StepDescription() {
  const { data, setField } = useOrder();
  const count = data.description.trim().length;

  return (
    <div>
      <TextAreaField
        id="description"
        label="Descripción de tu obra"
        placeholder={PLACEHOLDER}
        rows={8}
        value={data.description}
        onChange={(e) => setField("description", e.target.value)}
        required
      />
      <p className="mt-2 text-sm text-cafe/70">
        {count < 10
          ? "Escribe al menos unas palabras para ayudarnos a entender tu idea."
          : `${count} caracteres`}
      </p>
    </div>
  );
}
