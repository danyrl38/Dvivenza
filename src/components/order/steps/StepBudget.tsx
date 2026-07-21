"use client";

import { motion } from "framer-motion";

import { useOrder } from "@/components/order/OrderContext";
import { BUDGET_OPTIONS } from "@/lib/data";
import { cn } from "@/lib/utils";

export function StepBudget() {
  const { data, setField } = useOrder();

  return (
    <div>
      <fieldset className="flex flex-col gap-3">
        <legend className="sr-only">Presupuesto estimado</legend>
        {BUDGET_OPTIONS.map((option) => {
          const active = data.budget === option.value;
          return (
            <motion.button
              key={option.value}
              type="button"
              whileTap={{ scale: 0.99 }}
              onClick={() => setField("budget", active ? "" : option.value)}
              aria-pressed={active}
              className={cn(
                "flex items-center justify-between rounded-2xl border px-6 py-4 text-left transition-all duration-300",
                active
                  ? "border-dorado bg-arena/50 shadow-soft-sm"
                  : "border-beige bg-marfil hover:border-cafe/40 hover:bg-arena/20",
              )}
            >
              <span className="font-medium text-chocolate">{option.label}</span>
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border transition-colors duration-300",
                  active ? "border-dorado bg-dorado text-marfil" : "border-beige",
                )}
                aria-hidden="true"
              >
                {active ? "✓" : ""}
              </span>
            </motion.button>
          );
        })}
      </fieldset>
      <p className="mt-6 text-sm text-cafe/70">
        Este campo es opcional y nos ayuda a proponerte la mejor solución para ti.
      </p>
    </div>
  );
}
