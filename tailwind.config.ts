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
        // Paleta de marca Dvivenza
        marfil: "#F8F5F1",
        arena: "#E6DDD3",
        beige: "#D6C8BB",
        cafe: "#8D7566",
        chocolate: "#4F3E35",
        dorado: "#B99763",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-manrope)", "Manrope", "system-ui", "sans-serif"],
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
