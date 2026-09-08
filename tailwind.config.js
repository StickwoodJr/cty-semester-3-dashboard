/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        seneca: {
          red: '#DA291C',
          darkRed: '#B31B10',
          black: '#111827',
          gray: '#374151'
        }
      }
    },
  },
  plugins: [],
}
