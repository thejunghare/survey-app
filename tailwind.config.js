/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/screens/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'app-blue': '#5783B9',
        'app-white': '#f2f2f2',
      },
    },
  },
  plugins: [],
}

