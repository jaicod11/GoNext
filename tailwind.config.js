/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#ede9fe',
          100: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        surface: {
          900: '#05050f',
          800: '#09091a',
          700: '#0e0e20',
          600: '#141428',
          500: '#1a1a2e',
          400: '#252542',
          300: '#333355',
        }
      },
      boxShadow: {
        'glow-sm': '0 0 12px rgba(139, 92, 246, 0.25)',
        'glow':    '0 0 24px rgba(139, 92, 246, 0.4)',
        'glow-lg': '0 0 50px rgba(139, 92, 246, 0.5)',
        'card':    '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}