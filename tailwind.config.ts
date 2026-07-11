import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: { center: true, padding: "1.5rem", screens: { "2xl": "1360px" } },
    extend: {
      colors: {
        ink: {
          950: "#05070C",
          900: "#0B0E14",
          800: "#11151F",
          700: "#171C29",
          600: "#232838",
          500: "#333A4E",
        },
        mist: {
          50: "#F5F6F8",
          200: "#C9CDD9",
          400: "#8B92A6",
        },
        indigo: {
          400: "#7B7FF5",
          500: "#5B5FEF",
          600: "#4548C9",
        },
        gold: {
          300: "#F0CE8C",
          400: "#E8B45C",
          500: "#CE9A44",
        },
        border: "#232838",
        background: "#0B0E14",
        foreground: "#F5F6F8",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 20% 0%, rgba(91,95,239,0.18), transparent 45%), radial-gradient(circle at 100% 20%, rgba(232,180,92,0.10), transparent 40%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
