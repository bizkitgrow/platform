/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/flowbite/**/*.js',
  ],
  darkMode: 'class', // Enforce dark mode
  theme: {
    extend: {
      colors: {
        canvas: '#000000',
        canvas_accent: '#111111',
        brand_cta: '#0f766e', // teal-700
        brand_cta_hover: '#115e59', // teal-800
        text_primary: '#F8FAFC', // slate-50
        text_secondary: '#94A3B8', // slate-400
        borders_subtle: '#334155', // slate-700
      },
      fontFamily: {
        sans: ['Outfit', ...defaultTheme.fontFamily.sans],
        heading: ['Outfit', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.05)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.text_primary'),
            a: {
              color: theme('colors.brand_cta'),
              '&:hover': {
                color: theme('colors.brand_cta_hover'),
              },
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('flowbite/plugin')
  ],
};
