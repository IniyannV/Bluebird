/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "#03080f",
          surface: "#070f1c",
          surfaceAlt: "#050d18",
          border: "#0d2040",
          accent: "#2d7ef7",
          accentHover: "#5b9ffa",
          text: "#ddeeff",
          muted: "#4a6a8a",
          success: "#22d3a5",
          danger: "#f43f5e"
        }
      },
      fontFamily: {
        sans: ["DM Sans", "ui-sans-serif", "system-ui"],
        mono: ["DM Mono", "ui-monospace", "SFMono-Regular"]
      },
      boxShadow: {
        focus: "0 0 0 1px rgba(99,102,241,0.2)"
      },
      keyframes: {
        "row-in": {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "gpa-pulse": {
          "0%, 100%": { color: "#2d7ef7" },
          "50%": { color: "#22d3a5" }
        },
        "toast-in": {
          "0%": { opacity: "0", transform: "translate(12px, 12px)" },
          "100%": { opacity: "1", transform: "translate(0, 0)" }
        },
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      },
      animation: {
        "row-in": "row-in 180ms ease-out",
        "gpa-pulse": "gpa-pulse 550ms ease-out",
        "toast-in": "toast-in 180ms ease-out",
        fade: "fade 180ms ease-out"
      }
    }
  },
  plugins: []
};
