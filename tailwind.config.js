/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Poppins", "sans-serif"],
    },
    extend: {
      colors: {
        "button-color-bought": "#ABD64D",
        "button-color-not-bought": "#F2C52E",
      },
    },
  },
  plugins: [],
};
