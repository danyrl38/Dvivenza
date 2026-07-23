"use client";

import { StepArtType } from "@/components/order/steps/StepArtType";
import { StepDescription } from "@/components/order/steps/StepDescription";

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 font-serif text-lg text-chocolate md:text-xl">
      {children}
    </h3>
  );
}

/** Paso 2: tipo de obra + descripción, juntos. */
export function StepPedido() {
  return (
    <div className="space-y-10">
      <section>
        <SubHeading>¿Qué quieres crear?</SubHeading>
        <StepArtType />
      </section>
      <section>
        <SubHeading>Cuéntanos tu idea</SubHeading>
        <StepDescription />
      </section>
    </div>
  );
}
