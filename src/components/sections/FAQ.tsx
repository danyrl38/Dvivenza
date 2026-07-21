"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { FAQS } from "@/lib/data";
import { cn } from "@/lib/utils";

function FaqRow({
  question,
  answer,
  open,
  onToggle,
  id,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
  id: string;
}) {
  return (
    <div className="border-b border-beige/60">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors duration-300 hover:text-dorado"
        >
          <span className="text-lg font-medium text-chocolate md:text-xl">
            {question}
          </span>
          <span
            className={cn(
              "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-beige text-cafe transition-transform duration-300",
              open && "rotate-45 border-dorado text-dorado",
            )}
            aria-hidden="true"
          >
            +
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-button`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-6 pr-12 text-pretty leading-relaxed text-cafe">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq" className="bg-marfil">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Preguntas frecuentes"
            title="Resolvemos tus dudas"
            align="left"
            description="¿No encuentras lo que buscas? Escríbenos por WhatsApp y con gusto te ayudamos."
          />
          <div className="mt-8">
            <Button href="/pedido" variant="secondary">
              Comenzar mi pedido
            </Button>
          </div>
        </div>

        <div>
          {FAQS.map((faq, i) => (
            <FaqRow
              key={faq.question}
              id={`faq-${i}`}
              question={faq.question}
              answer={faq.answer}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
