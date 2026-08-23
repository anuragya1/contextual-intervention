import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 18px 45px rgba(16, 24, 40, 0.14)",
        lift: "0 10px 28px rgba(16, 24, 40, 0.11)"
      },
      keyframes: {
        sheetUp: {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        cardIn: {
          "0%": { transform: "translateY(8px) scale(0.98)", opacity: "0" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" }
        },
        toastIn: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "12%": { transform: "translateY(0)", opacity: "1" },
          "82%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(8px)", opacity: "0" }
        }
      },
      animation: {
        sheetUp: "sheetUp 260ms ease-out",
        cardIn: "cardIn 220ms ease-out",
        toastIn: "toastIn 2600ms ease-in-out forwards"
      }
    }
  },
  plugins: []
};

export default config;
