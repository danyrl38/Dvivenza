"use client";

import { motion } from "framer-motion";

import { STEPS, TOTAL_STEPS, useOrder } from "@/components/order/OrderContext";
import { cn } from "@/lib/utils";

export function Stepper() {
  const { step, goTo, isStepValid } = useOrder();
  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div>
      {/* Móvil: barra de progreso */}
      <div className="md:hidden">
        <div className="flex items-baseline justify-between">
          <p className="font-serif text-lg text-chocolate">
            {STEPS[step].title}
          </p>
          <p className="text-sm text-cafe">
            Paso {step + 1} de {TOTAL_STEPS}
          </p>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-beige/60">
          <motion.div
            className="h-full rounded-full bg-dorado"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Desktop: pasos numerados */}
      <ol className="hidden items-center md:flex">
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          // Solo se puede saltar a un paso ya visitado o al inmediato siguiente si el actual es válido.
          const reachable = i <= step || (i === step + 1 && isStepValid(step));
          return (
            <li key={s.key} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => reachable && goTo(i)}
                className="group flex flex-col items-center gap-2 disabled:cursor-not-allowed"
                aria-current={active ? "step" : undefined}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium transition-all duration-300",
                    active && "border-dorado bg-dorado text-marfil shadow-soft-sm",
                    done && "border-cafe bg-cafe text-marfil",
                    !active && !done && "border-beige bg-marfil text-cafe",
                  )}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span
                  className={cn(
                    "whitespace-nowrap text-xs font-medium transition-colors duration-300",
                    active ? "text-chocolate" : "text-cafe/70",
                  )}
                >
                  {s.title}
                </span>
              </button>
              {i < TOTAL_STEPS - 1 && (
                <span
                  className={cn(
                    "mx-2 mb-6 h-px flex-1 transition-colors duration-300 lg:mx-3",
                    i < step ? "bg-cafe" : "bg-beige",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
