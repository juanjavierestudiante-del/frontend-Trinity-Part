/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#863bff',
          dark: '#5b1fb8',
          light: '#ede6ff',
        },
        secondary: '#ff5fa3',
        background: '#faf8ff',
        surface: '#ffffff',
        ink: '#1a0b2e',
        muted: '#6b5fa0',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        card: '1rem',
      },
      boxShadow: {
        'brand': '0 4px 24px -4px rgba(134, 59, 255, 0.12)',
        'brand-lg': '0 8px 32px -4px rgba(134, 59, 255, 0.18)',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
