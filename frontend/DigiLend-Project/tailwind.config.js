/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        fontFamily: {
        Montserrat: ["Montserrat", "sans-serrif"],
        Inter: ["Inter", "sans-serrif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: [
        {
          mytheme: {
            "primary": "#e5a569",
            "secondary": "#8e2108",
            "accent": "#46d6ca",
            "neutral": "#1C1E26",
            "base-100": "#2A2E46",
            "info": "#7C95DF",
            "success": "#127D52",
            "warning": "#C29414",
            "error": "#E43A5E",
            "white": "#FAFAFA",
          },
        },
      ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
  },
}
