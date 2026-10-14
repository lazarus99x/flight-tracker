import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        ink: "#111111",
        ink2: "#3B3B3B",
        ink3: "#6B6B6B",
        light: "#9B9B9B",
        faint: "#EDEDED",
        rule: "#E6E6E6",
        accent: "#0070F3",
        accent2: "#3291FF",
        ok: "#0A8754",
        warn: "#F5A623",
        err: "#EE0000",
        band: "#FAFAFA",
      },
      fontFamily: {
        sans: ["var(--font-geist)", "Geist", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Geist Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;