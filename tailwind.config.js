/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          50: "#f8fafc",
          100: "#a0a0b8",
          200: "#13131f",
          300: "#0e0e1c",
          400: "#1a1a2e",
          500: "#07070f",
          600: "#050509",
          700: "#030307",
          800: "#020204",
          900: "#010102",
        },
        accent: {
          DEFAULT: "#6c5ce7",
          light: "#a29bfe",
          dark: "#4834d4",
        },
        sport: {
          green: "#00cba4",
          red: "#ff6b6b",
          yellow: "#ffd93d",
          orange: "#ff9f43",
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
        display: ["DM Sans", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "glow-accent": "radial-gradient(ellipse at 50% 0%, rgba(108,92,231,0.15) 0%, transparent 70%)",
        "glow-green": "radial-gradient(ellipse at 50% 0%, rgba(0,203,164,0.12) 0%, transparent 70%)",
      },
      boxShadow: {
        "glow-accent": "0 0 40px rgba(108,92,231,0.15)",
        "glow-sm": "0 0 20px rgba(108,92,231,0.1)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
}
