import type { Variants } from "framer-motion";

// -----------------------------------------------------------------------------
// Variantes reutilizables de Framer Motion.
// Transiciones suaves de ~300ms con easing elegante.
// -----------------------------------------------------------------------------

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE },
  },
};

export const hoverLift = {
  rest: { y: 0 },
  hover: { y: -6, transition: { duration: 0.3, ease: EASE } },
};

/**
 * Viewport por defecto: `once: false` para que los elementos animen tanto al
 * ENTRAR como al SALIR del viewport mientras se hace scroll.
 */
export const VIEWPORT = { once: false, margin: "-80px" };

/** Para elementos que solo deben animarse la primera vez. */
export const VIEWPORT_ONCE = { once: true, margin: "-80px" };

export const TRANSITION_EASE = EASE;
