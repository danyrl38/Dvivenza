import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de marca Dvivenza — versión alegre, cálida y creativa.
        // (Se conservan los mismos nombres de token para no alterar la estructura.)
        marfil: "#FFF8F0", // crema cálida (fondo base)
        arena: "#FFE7D4", // durazno suave (secciones / inputs)
        beige: "#F6CBB0", // albaricoque claro (bordes)
        cafe: "#B45C41", // terracota (texto secundario / iconos)
        chocolate: "#3A2A2C", // cacao profundo (texto principal / botones)
        dorado: "#EC5F2E", // coral vibrante (acento / CTA / detalles)
        // Acentos extra opcionales para toques creativos.
        menta: "#3FB8A0",
        uva: "#8A5CC7",
        sol: "#F5B429",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Fraunces", "Georgia", "serif"],
        sans: ["var(--font-nunito)", "Nunito", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.25em",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(79, 62, 53, 0.18)",
        "soft-lg": "0 30px 80px -24px rgba(79, 62, 53, 0.28)",
        "soft-sm": "0 6px 24px -10px rgba(79, 62, 53, 0.16)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
      maxWidth: {
        content: "1240px",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
