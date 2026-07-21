"use client";

import { motion } from "framer-motion";

import { Section, SectionHeading } from "@/components/ui/Section";
import { HOW_STEPS } from "@/lib/data";
import { fadeUp, staggerContainer, VIEWPORT } from "@/lib/motion";

export function HowItWorks() {
  return (
    <Section id="como-funciona" className="bg-marfil">
      <SectionHeading
        eyebrow="Cómo funciona"
        title="Tu recuerdo, en tres pasos"
        description="Un proceso simple y cuidado, pensado para que la experiencia sea tan especial como la obra final."
      />

      <motion.ol
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="mt-16 grid gap-8 md:mt-20 md:grid-cols-3 md:gap-6 lg:gap-10"
      >
        {HOW_STEPS.map((step) => (
          <motion.li
            key={step.number}
            variants={fadeUp}
            className="group relative flex flex-col rounded-3xl border border-beige/50 bg-arena/20 p-8 transition-all duration-300 hover:border-dorado/40 hover:bg-arena/40 hover:shadow-soft lg:p-10"
          >
            <span className="font-serif text-6xl font-light text-dorado/50 transition-colors duration-300 group-hover:text-dorado">
              {step.number}
            </span>
            <h3 className="mt-6 text-2xl font-medium text-chocolate">
              {step.title}
            </h3>
            <p className="mt-3 text-pretty leading-relaxed text-cafe">
              {step.description}
            </p>
          </motion.li>
        ))}
      </motion.ol>
    </Section>
  );
}
