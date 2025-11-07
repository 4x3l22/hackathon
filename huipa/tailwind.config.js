/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta personalizada - Regla 60-30-10
        primary: {
          light: '#f3f1ed',    // 60% - Fondo principal
          DEFAULT: '#a07034',  // 30% - Acentos principales
          dark: '#8b5e2a',     // Variación más oscura
        },
        accent: {
          DEFAULT: '#d6a84e',  // 10% - Acentos secundarios
          light: '#e4c07a',    // Variación más clara
        }
      },
    },
  },
  plugins: [],
}
