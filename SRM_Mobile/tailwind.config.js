/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#FFFFFF",
        },
        background: {
          DEFAULT: "#F8FAFC",
        },
        foreground: {
          DEFAULT: "#0F172A",
        },
        muted: {
          DEFAULT: "#F1F5F9",
          foreground: "#64748B",
        },
        border: "#E2E8F0",
      },
    },
  },
  plugins: [],
};
