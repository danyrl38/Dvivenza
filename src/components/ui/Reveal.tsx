"use client";

import { motion } from "framer-motion";

import { fadeUp, VIEWPORT } from "@/lib/motion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Envuelve contenido para animarlo suavemente al entrar en el viewport.
 * Respeta prefers-reduced-motion vía la configuración global de Framer Motion.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
