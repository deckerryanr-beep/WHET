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
        background: "#0C0C0F",
        surface: "#13131A",
        "surface-2": "#1A1A24",
        border: "#1E1E2E",
        "border-light": "#2A2A3A",
        gold: {
          DEFAULT: "#C9A864",
          light: "#DFC48A",
          dark: "#A08040",
          muted: "#8A6A30",
        },
        text: {
          primary: "#F0EDE6",
          secondary: "#9898A8",
          muted: "#5A5A6A",
        },
        wine: "#8B1A3A",
        whiskey: "#C47020",
        athletic: "#1A6B4A",
        fashion: "#6B1A6B",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #C9A864 0%, #DFC48A 50%, #A08040 100%)",
        "dark-gradient":
          "linear-gradient(180deg, #0C0C0F 0%, #13131A 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-gold": "pulseGold 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGold: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
