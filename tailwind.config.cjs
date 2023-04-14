const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  prefix: 'tw-',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#C6CAB9',
        'primary-dark': '#1C2635',
        secondary: '#CCCBCD',
        tertiary: '#FBFBF2',
        'tertiary-dark': '#334661',
        accent: '#1C2635',
        'accent-dark': '#C6CAB9',
        pop: colors.red[800],
        'pop-dark': colors.red[400],
      },
      fontFamily: {
        display: ['Special Elite', 'serif'],
        body: ['Crimson Pro', 'serif'],
        mono: ['Mononoki', 'ui-monospace'],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            'blockquote p:first-of-type::before': {
              content: 'none',
            },
            'blockquote p:last-of-type::after': {
              content: 'none',
            },
          }
        }
      }),
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, scale: '150%' },
          '100%': { opacity: 1, scale: '100%' },
        },
        'blur-in': {
          '0%': { filter: 'grayscale(100%)' },
          '100%': { filter: 'grayscale(0%) blur(4px)' },
        },
        'bump': {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
          '100%': { transform: 'translateY(0)' },
        },
        'bump-small': {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-1px)' },
          '100%': { transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 2s ease-in-out',
        'blur-in': 'blur-in 6s ease-in-out',
        'bump': 'bump 0.2s ease-in-out',
        'bump-small': 'bump-small 0.1s ease-in-out',
      }
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
