/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        canvas: '#FFFFFF',
        canvas_accent: '#F8FAFC',
        brand_cta: '#059669',
        brand_cta_hover: '#047857',
        text_primary: '#0F172A',
        text_secondary: '#475569',
        borders_subtle: '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.05)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [require('@astrouxds/tailwind'), require('tailwindcss-plugin-custom-elements')],
};
