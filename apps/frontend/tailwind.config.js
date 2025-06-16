/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#0a0a23', // Existing dark theme background
        'accent-cyan': '#00ffff',
        'accent-cyan-rgb': '0, 255, 255',
        'accent-fuchsia': '#ff00ff',
        'accent-fuchsia-rgb': '255, 0, 255',
        'accent-pink': '#ff69b4',
        'accent-pink-rgb': '255, 105, 180',

        // Light theme colors
        'primary-light-bg': '#f0f2f5', // Light gray background
        'primary-light-text': '#1a202c', // Dark gray text
        'card-light-bg': '#ffffff', // White cards
        'card-light-border': '#cbd5e0', // Medium gray border for cards
        'accent-cyan-light': '#00A0A0', // Darker cyan for light backgrounds
        'accent-cyan-light-rgb': '0, 160, 160',
        'accent-fuchsia-light': '#C000C0', // Darker fuchsia
        'accent-fuchsia-light-rgb': '192, 0, 192',
        'accent-pink-light': '#D94682', // Darker pink
        'accent-pink-light-rgb': '217, 70, 130',
      },
      fontFamily: {
        sans: ['Orbitron', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function ({ addUtilities, theme }) {
      const newUtilities = {
        '.text-shadow': {
          textShadow: `0 0 5px rgba(${theme('colors.accent-cyan-rgb')}, 0.7), 0 0 10px rgba(${theme('colors.accent-cyan-rgb')}, 0.5)`,
        },
        '.text-shadow-md': {
          textShadow: `0 0 8px rgba(${theme('colors.accent-cyan-rgb')}, 0.7), 0 0 15px rgba(${theme('colors.accent-cyan-rgb')}, 0.5)`,
        },
        '.text-shadow-lg': {
          textShadow: `0 0 15px rgba(${theme('colors.accent-cyan-rgb')}, 0.7), 0 0 25px rgba(${theme('colors.accent-cyan-rgb')}, 0.5)`,
        },
        '.text-shadow-pink': {
          textShadow: `0 0 5px rgba(${theme('colors.accent-pink-rgb')}, 0.7), 0 0 10px rgba(${theme('colors.accent-pink-rgb')}, 0.5)`,
        },
        '.text-shadow-fuchsia': {
          textShadow: `0 0 5px rgba(${theme('colors.accent-fuchsia-rgb')}, 0.7), 0 0 10px rgba(${theme('colors.accent-fuchsia-rgb')}, 0.5)`,
        },
         '.text-shadow-light-cyan': {
          textShadow: `0 0 5px rgba(${theme('colors.accent-cyan-light-rgb')}, 0.7), 0 0 10px rgba(${theme('colors.accent-cyan-light-rgb')}, 0.5)`,
        },
        '.text-shadow-light-pink': {
          textShadow: `0 0 5px rgba(${theme('colors.accent-pink-light-rgb')}, 0.7), 0 0 10px rgba(${theme('colors.accent-pink-light-rgb')}, 0.5)`,
        },
        '.text-shadow-light-fuchsia': {
          textShadow: `0 0 5px rgba(${theme('colors.accent-fuchsia-light-rgb')}, 0.7), 0 0 10px rgba(${theme('colors.accent-fuchsia-light-rgb')}, 0.5)`,
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover', 'dark'])
    }
  ],
}
