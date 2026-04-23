import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sand: {
          50:  "oklch(0.995 0.008 95.277)",
          100: "oklch(0.987 0.022 95.277)",
          200: "oklch(0.962 0.059 95.617)",
          300: "oklch(0.920 0.090 88.000)",
          400: "oklch(0.820 0.100 80.000)",
        },
        espresso: {
          DEFAULT: "#2a2318",
          light:   "#4a3c2a",
        },
        gold: "#8a7355",
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body:    ["'DM Sans'", "sans-serif"],
      },
      keyframes: {
        marquee:   { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        fadeUp:    { "0%": { opacity: "0", transform: "translateY(24px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideIn:   { "0%": { transform: "translateX(100%)" }, "100%": { transform: "translateX(0)" } },
        scaleIn:   { "0%": { opacity: "0", transform: "scale(0.96)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        spin:      { to: { transform: "rotate(360deg)" } },
      },
      animation: {
        marquee:  "marquee 22s linear infinite",
        fadeUp:   "fadeUp 0.7s ease forwards",
        slideIn:  "slideIn 0.35s cubic-bezier(0.32,0,0.67,0) forwards",
        scaleIn:  "scaleIn 0.25s ease forwards",
        spin:     "spin 0.8s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
