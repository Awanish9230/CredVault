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
          DEFAULT: '#0F766E',
          light: '#14B8A6',
          soft: '#CCFBF1',
        },
        secondary: {
          DEFAULT: '#2563EB',
          soft: '#DBEAFE',
        },
        accent: {
          DEFAULT: '#D97706',
          soft: '#FEF3C7',
        },
        background: '#F8FAFC',
        card: '#FFFFFF',
        soft: '#F1F5F9',
        border: '#E2E8F0',
        heading: '#0F172A',
        body: '#475569',
        muted: '#94A3B8',
        success: '#16A34A',
        error: '#DC2626',
        warning: '#D97706',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
