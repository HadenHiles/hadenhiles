import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:       "#0B0B0E",
        surface:  "#101018",
        surface2: "#151520",
        text:     "#EDEDF2",
        muted:    "#CBCBD6",
        border:   "#262634",
        accent:   "#8A5CFF",
      },
      borderRadius: {
        card:  "18px",
        modal: "24px",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      keyframes: {
        'cursor-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'pulse-sheen': {
          '0%, 100%': {
            filter: 'brightness(1)',
            boxShadow: '0 10px 15px -3px rgb(168 85 247 / 0.3), 0 4px 6px -4px rgb(168 85 247 / 0.3)',
          },
          '50%': {
            filter: 'brightness(1.15)',
            boxShadow: '0 10px 15px -3px rgb(192 132 252 / 0.4), 0 4px 6px -4px rgb(192 132 252 / 0.4)',
          },
        },
      },
      animation: {
        'cursor-blink': 'cursor-blink 1s step-end infinite',
        'pulse-sheen': 'pulse-sheen 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
7