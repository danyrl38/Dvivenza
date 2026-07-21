"use client";

import { AnimatePresence, motion } from "framer-motion";

import { useOrder } from "@/components/order/OrderContext";
import { FieldLabel } from "@/components/order/fields";
import { daysFromToday, formatDateEs, todayIso } from "@/lib/utils";

const URGENT_THRESHOLD_DAYS = 14;

export function StepDeliveryDate() {
  const { data, setField } = useOrder();
  const days = data.desiredDate ? daysFromToday(data.desiredDate) : Infinity;
  const isUrgent = data.desiredDate !== "" && days < URGENT_THRESHOLD_DAYS;

  return (
    <div className="max-w-md">
      <FieldLabel htmlFor="desiredDate" optional>
        Fecha deseada de entrega
      </FieldLabel>
      <input
        id="desiredDate"
        type="date"
        min={todayIso()}
        value={data.desiredDate}
        onChange={(e) => setField("desiredDate", e.target.value)}
        className="w-full rounded-2xl border border-beige bg-marfil px-5 py-3.5 text-chocolate transition-all duration-300 focus:border-dorado focus:outline-none focus:ring-2 focus:ring-dorado/20"
      />

      {data.desiredDate && (
        <p className="mt-3 text-sm text-cafe">
          Fecha seleccionada:{" "}
          <span className="font-medium text-chocolate">
            {formatDateEs(data.desiredDate)}
          </span>
        </p>
      )}

      <AnimatePresence>
        {isUrgent && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            className="mt-5 flex items-start gap-3 rounded-2xl border border-dorado/40 bg-dorado/10 px-5 py-4"
          >
            <span className="text-lg text-dorado" aria-hidden="true">
              ⚡
            </span>
            <p className="text-sm leading-relaxed text-chocolate">
              Es posible que esta fecha requiera un servicio urgente. Lo
              confirmaremos contigo al enviarte tu cotización.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-6 text-sm text-cafe/70">
        Si aún no tienes una fecha definida, puedes dejar este campo vacío.
      </p>
    </div>
  );
}
