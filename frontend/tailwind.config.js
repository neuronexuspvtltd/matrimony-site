/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d2d9',
          300: '#f4adc0',
          400: '#eb7999',
          500: '#df4775',
          600: '#c82658',
          700: '#a81c47',
          800: '#8c1a3f',
          900: '#701a2b', // Deep maroon/burgundy primary
          950: '#460b18',
        },
        gold: {
          50: '#fbf8ee',
          100: '#f5edd3',
          200: '#ebd9a8',
          300: '#dfbe75',
          400: '#d4af37', // Muted royal gold
          500: '#c5a059',
          600: '#a87f42',
          700: '#866034',
          800: '#6f4e30',
          900: '#5c402b',
        },
        ivory: {
          50: '#ffffff',
          100: '#fdfbf7', // Warm ivory background
          200: '#f7f3ea',
          300: '#eee6d6',
          400: '#e0d2b8',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
