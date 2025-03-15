/** @type {import('tailwindcss').Config} */

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        whiteApp: 'var(--vt-c-white)',
        blackApp: 'var(--vt-c-black)',
        primary: 'var(--vt-c-text-primary)',
        heading: 'var(--color-heading)',
        textColor: 'var(--color-text)',
        textColorSoft: 'var(--color-text-soft)',
        border: 'var(--color-border)',
        borderHover: 'var(--color-border-hover)',
        background: 'var(--color-background)',
        backgroundSecondary: 'var(--color-background-secondary)',
        backgroundSoft: 'var(--color-background-soft)',
      },
      spacing: {
        section: 'var(--section-gap)',
      },
      padding: {}
    },
  },
  plugins: [],
}

