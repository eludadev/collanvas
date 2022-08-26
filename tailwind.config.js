const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: colors.neutral,
        secondary: colors.blue,
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
