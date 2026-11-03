import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#252b25",
        forest: "#244b3b",
        "forest-dark": "#19382c",
        sage: "#eaf0e8",
        cream: "#faf8f3",
        clay: "#b9684f",
        "warm-gray": "#77766e",
      },
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "serif"],
      },
      boxShadow: {
        soft: "0 16px 48px rgba(37, 43, 37, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
