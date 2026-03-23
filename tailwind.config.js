/** @type {import('tailwindcss').Config} */
export default {
  // ── THIS IS THE KEY FIX ──────────────────────────────────────────
  // 'class' strategy means dark mode activates when the 'dark' class
  // is present on the <html> element. We control that from React.
  darkMode: 'class',
  // ─────────────────────────────────────────────────────────────────
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
