/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Mukta', 'Inter', 'Noto Sans Devanagari', 'sans-serif'],
        devanagari: ['Mukta', 'Noto Sans Devanagari', 'sans-serif'],
        mono: ['Courier New', 'monospace']
      },
      colors: {
        sahakari: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        voucher: {
          bg: '#fdf6b2', // Realistic yellow paper tone from the physical voucher
          border: '#374151',
          text: '#111827'
        }
      }
    },
  },
  plugins: [],
}
