"use client";

import { AnimatePresence, motion } from "framer-motion";

import { STEPS, TOTAL_STEPS, useOrder } from "@/components/order/OrderContext";
import { Stepper } from "@/components/order/Stepper";
import { Button } from "@/components/ui/Button";
import { StepClientInfo } from "@/components/order/steps/StepClientInfo";
import { StepArtType } from "@/components/order/steps/StepArtType";
import { StepDescription } from "@/components/order/steps/StepDescription";
import { StepReferences } from "@/components/order/steps/StepReferences";
import { StepDetails } from "@/components/order/steps/StepDetails";
import { StepDeliveryDate } from "@/components/order/steps/StepDeliveryDate";
import { StepBudget } from "@/components/order/steps/StepBudget";
import { StepSummary } from "@/components/order/steps/StepSummary";
import { CONTACT } from "@/lib/contact";

const STEP_COMPONENTS = [
  StepClientInfo,
  StepArtType,
  StepDescription,
  StepReferences,
  StepDetails,
  StepDeliveryDate,
  StepBudget,
  StepSummary,
];

function SuccessScreen({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center rounded-3xl border border-beige/50 bg-arena/20 px-6 py-16 text-center md:py-20"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-dorado text-3xl text-marfil"
      >
        ✓
      </motion.div>
      <h2 className="mt-8 text-3xl font-medium text-chocolate md:text-4xl">
        ¡Solicitud enviada!
      </h2>
      <p className="mt-4 max-w-md text-pretty leading-relaxed text-cafe">
        {message}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer">
          Escríbenos por WhatsApp
        </Button>
        <Button href="/" variant="secondary">
          Volver al inicio
        </Button>
      </div>
    </motion.div>
  );
}

export function OrderWizard() {
  const { step, next, prev, isStepValid, submit, submitState, submitMessage } =
    useOrder();

  if (submitState === "success") {
    return <SuccessScreen message={submitMessage} />;
  }

  const StepComponent = STEP_COMPONENTS[step];
  const isLast = step === TOTAL_STEPS - 1;
  const canAdvance = isStepValid(step);
  const submitting = submitState === "submitting";

  return (
    <div>
      <Stepper />

      <div className="mt-10 rounded-3xl border border-beige/50 bg-marfil p-6 shadow-soft-sm md:mt-12 md:p-10">
        {/* Encabezado del paso */}
        <div className="mb-8 hidden md:block">
          <span className="eyebrow">
            Paso {step + 1} · {STEPS[step].subtitle}
          </span>
          <h2 className="mt-2 text-3xl font-medium text-chocolate">
            {STEPS[step].title}
          </h2>
        </div>

        {/* Contenido del paso */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <StepComponent />
          </motion.div>
        </AnimatePresence>

        {/* Mensaje de error */}
        {submitState === "error" && (
          <p
            role="alert"
            className="mt-6 rounded-2xl border border-red-300 bg-red-50 px-5 py-4 text-sm text-red-700"
          >
            {submitMessage}
          </p>
        )}

        {/* Navegación */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-beige/50 pt-8">
          <Button
            variant="ghost"
            onClick={prev}
            disabled={step === 0 || submitting}
            className={step === 0 ? "invisible" : ""}
          >
            ← Atrás
          </Button>

          {isLast ? (
            <Button size="lg" onClick={submit} disabled={submitting}>
              {submitting ? "Enviando…" : "Solicitar cotización"}
            </Button>
          ) : (
            <Button onClick={next} disabled={!canAdvance}>
              Continuar →
            </Button>
          )}
        </div>
      </div>

      {!canAdvance && step <= 2 && (
        <p className="mt-4 text-center text-sm text-cafe/70">
          Completa los campos requeridos para continuar.
        </p>
      )}
    </div>
  );
}
