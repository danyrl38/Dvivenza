"use client";

import { useOrder } from "@/components/order/OrderContext";
import { TextField } from "@/components/order/fields";

export function StepClientInfo() {
  const { data, setField } = useOrder();

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <TextField
        id="fullName"
        label="Nombre completo"
        className="sm:col-span-2"
        placeholder="Tu nombre"
        autoComplete="name"
        value={data.fullName}
        onChange={(e) => setField("fullName", e.target.value)}
        required
      />
      <TextField
        id="email"
        type="email"
        label="Correo electrónico"
        placeholder="tucorreo@ejemplo.com"
        autoComplete="email"
        value={data.email}
        onChange={(e) => setField("email", e.target.value)}
        required
      />
      <TextField
        id="whatsapp"
        type="tel"
        label="WhatsApp"
        placeholder="+52 55 1234 5678"
        autoComplete="tel"
        value={data.whatsapp}
        onChange={(e) => setField("whatsapp", e.target.value)}
        required
      />
      <TextField
        id="city"
        label="Ciudad"
        placeholder="Tu ciudad"
        autoComplete="address-level2"
        value={data.city}
        onChange={(e) => setField("city", e.target.value)}
        required
      />
      <TextField
        id="country"
        label="País"
        placeholder="Tu país"
        autoComplete="country-name"
        value={data.country}
        onChange={(e) => setField("country", e.target.value)}
        required
      />
    </div>
  );
}
