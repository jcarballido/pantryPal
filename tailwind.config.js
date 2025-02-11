/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'primary':{
          'base':'#E0F7FA',
          'light':'#EDF7F2'
        },
        'text':'#263238',
        'primary-action':{
          'base':'#00B8D4',
          'active':'#757D85'
        },
        'secondary-action':{
          'base':'#0277BD',
          'active':'#667380'
        },
        'accent':'#84FFFF',
        'tertiary-action':{
          'base':'#86C1B9',
          'active':'#5A9D93'
        },
        'dark-charcoal-gray':'#333333',
        'light-cool-gray':'#E5E5E5',
        'charcoal-gray':'#505050'
      }
    },
  },
  plugins: [],
}

