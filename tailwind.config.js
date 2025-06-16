/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*.html"], // MUST match your HTML file location
  theme: {
    extend: {
      colors: {
        primary: "#2A2A2A",
        secondary: "#F5F5F5",
        accent: "#FF7A00",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}