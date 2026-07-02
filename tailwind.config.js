/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          50: "#f8fafc",
          100: "#e2e8f0",
          200: "#1a1b2e",
          300: "#2a2b3d",
          400: "#3a3b4d",
          500: "#0f0f1a",
          600: "#0a0a14",
          700: "#06060e",
          800: "#030308",
          900: "#000004",
        },
        accent: {
          DEFAULT: "#6c5ce7",
          light: "#a29bfe",
          dark: "#4834d4",
        },
        sport: {
          green: "#00b894",
          red: "#e17055",
          yellow: "#fdcb6e",
        },
        surface: {
          DEFAULT: "var(--surface)",
          50: "var(--surface-50)",
          100: "var(--surface-100)",
          200: "var(--surface-200)",
          300: "var(--surface-300)",
          400: "var(--surface-400)",
          500: "var(--surface-500)",
          600: "var(--surface-600)",
        },
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "border-color": "var(--border-color)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
