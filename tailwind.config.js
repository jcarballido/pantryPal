/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'primary':{
          'base':'#CEEADC',
          'light':'#EDF7F2'
        },
        'primary-action':{
          'base':'#4682B4',
          'active':'#757D85'
        },
        'secondary-action':{
          'base':'#E0E4E8',
          'active':'#667380'
        },
        'tertiary-action':{
          'base':'#86C1B9',
          'active':'#5A9D93'
        },
        'dark-charcoal-gray':'#333333'
      }
    },
  },
  plugins: [],
}

