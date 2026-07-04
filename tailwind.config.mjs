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
        canvas: '#FFFFFF',
        canvas_accent: '#F8FAFC',
        brand_cta: '#0d9488', // teal-600
        brand_cta_hover: '#0f766e', // teal-700
        text_primary: '#0F172A', // slate-900
        text_secondary: '#475569', // slate-600
        borders_subtle: '#E2E8F0', // slate-200
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', ...defaultTheme.fontFamily.sans],
        heading: ['Plus Jakarta Sans', ...defaultTheme.fontFamily.sans],
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
    require('flowbite/plugin'),
  ],
};
