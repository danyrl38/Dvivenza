"use client";

import { motion } from "framer-motion";

import { useOrder } from "@/components/order/OrderContext";
import { ART_TYPE_OPTIONS } from "@/lib/data";
import { cn } from "@/lib/utils";

export function StepArtType() {
  const { data, setField } = useOrder();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
      {ART_TYPE_OPTIONS.map((option) => {
        const active = data.artType === option.value;
        return (
          <motion.button
            key={option.value}
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => setField("artType", option.value)}
            aria-pressed={active}
            className={cn(
              "flex flex-col items-start rounded-2xl border p-5 text-left transition-all duration-300",
              active
                ? "border-dorado bg-arena/50 shadow-soft"
                : "border-beige bg-marfil hover:border-cafe/40 hover:bg-arena/20",
            )}
          >
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border text-sm transition-colors duration-300",
                active
                  ? "border-dorado bg-dorado text-marfil"
                  : "border-beige text-cafe",
              )}
              aria-hidden="true"
            >
              {active ? "✓" : ""}
            </span>
            <span className="mt-4 text-lg font-medium text-chocolate">
              {option.label}
            </span>
            <span className="mt-1 text-sm text-cafe">{option.description}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
