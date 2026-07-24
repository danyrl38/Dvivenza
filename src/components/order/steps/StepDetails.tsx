"use client";

import { useOrder } from "@/components/order/OrderContext";
import {
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/order/fields";
import { GARMENT_OPTIONS, MATERIAL_OPTIONS, SIZE_OPTIONS } from "@/lib/data";

export function StepDetails() {
  const { data, setField } = useOrder();

  const isFunda = data.artType === "funda";
  const isPrenda = data.artType === "prenda";
  // El valor específico (modelo de teléfono / tipo de prenda) se guarda en
  // el mismo campo `size` para no requerir columnas nuevas en la base de datos.

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <TextField
        id="peopleCount"
        label="Número de personas"
        optional
        type="number"
        min={1}
        placeholder="Ej. 2"
        value={data.peopleCount}
        onChange={(e) => setField("peopleCount", e.target.value)}
      />

      {isFunda ? (
        <TextField
          id="size"
          label="Modelo de teléfono"
          optional
          placeholder="Ej. iPhone 14 Pro, Samsung S23"
          value={data.size}
          onChange={(e) => setField("size", e.target.value)}
        />
      ) : isPrenda ? (
        <SelectField
          id="size"
          label="Tipo de prenda"
          optional
          options={GARMENT_OPTIONS}
          placeholder="Elige el tipo de prenda"
          value={data.size}
          onChange={(e) => setField("size", e.target.value)}
        />
      ) : (
        <>
          <SelectField
            id="size"
            label="Tamaño"
            optional
            options={SIZE_OPTIONS}
            placeholder="Elige un tamaño"
            value={data.size}
            onChange={(e) => setField("size", e.target.value)}
          />
          <SelectField
            id="material"
            label="Material"
            optional
            options={MATERIAL_OPTIONS}
            placeholder="Elige un material"
            value={data.material}
            onChange={(e) => setField("material", e.target.value)}
          />
        </>
      )}

      <TextField
        id="customText"
        label="Texto personalizado"
        optional
        placeholder="Una frase, nombre o fecha especial"
        className="sm:col-span-2"
        value={data.customText}
        onChange={(e) => setField("customText", e.target.value)}
      />
      <TextAreaField
        id="specialColors"
        label="Colores especiales"
        optional
        rows={3}
        placeholder="¿Hay una paleta o colores que quieras destacar?"
        className="sm:col-span-2"
        value={data.specialColors}
        onChange={(e) => setField("specialColors", e.target.value)}
      />
    </div>
  );
}
