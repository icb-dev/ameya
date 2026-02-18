/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Gotham
        gothamThin: ["Gotham-Thin", "sans-serif"],
        gothamLight: ["Gotham-Light", "sans-serif"],

        // Franklin Gothic
        franklinMedium: ["FranklinGothic-MediumCond", "sans-serif"],
        franklinDemi: ["FranklinGothic-Demi", "sans-serif"],
        franklinBook: ["FranklinGothic-Book", "sans-serif"],


        // SangBleuSunrise
        SangBleuSunrise: ["SangBleuSunrise-Regular", "sans-serif"],

        // Quarto
        quarto: ["quarto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
