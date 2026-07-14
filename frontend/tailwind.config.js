/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff9f4",
          100: "#d7f0e2",
          200: "#b0e0c7",
          300: "#7ec9a7",
          400: "#4bab83",
          500: "#2e9067",
          600: "#217352",
          700: "#1c5c43",
          800: "#194a37",
          900: "#153d2e",
        },
        accent: {
          500: "#e07a34",
          600: "#c8611e",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 12px 0 rgba(20, 40, 30, 0.06)",
        card: "0 4px 20px 0 rgba(20, 40, 30, 0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
