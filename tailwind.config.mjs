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
        canvas_accent: '#0a0a0a',
        brand_cta: '#22c55e', // green-500
        brand_cta_hover: '#16a34a', // green-600
        text_primary: '#f8fafc', // slate-50
        text_secondary: '#cbd5e1', // slate-300
        borders_subtle: '#334155', // slate-700
      },
      fontFamily: {
        sans: ['Outfit', 'Plus Jakarta Sans', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.05)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    require('@astrouxds/tailwind'),
    require('tailwindcss-plugin-custom-elements'),
    require('flowbite/plugin'),
  ],
};
