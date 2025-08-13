/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        taklaget: {
          primary: 'var(--taklaget-primary)',
          'primary-dark': 'var(--taklaget-primary-dark)',
          secondary: 'var(--taklaget-secondary)',
          accent: 'var(--taklaget-accent)',
          success: 'var(--taklaget-success)',
          warning: 'var(--taklaget-warning)',
          error: 'var(--taklaget-error)',
        },
        gray: {
          50: 'var(--taklaget-gray-50)',
          100: 'var(--taklaget-gray-100)',
          200: 'var(--taklaget-gray-200)',
          300: 'var(--taklaget-gray-300)',
          400: 'var(--taklaget-gray-400)',
          500: 'var(--taklaget-gray-500)',
          600: 'var(--taklaget-gray-600)',
          700: 'var(--taklaget-gray-700)',
          800: 'var(--taklaget-gray-800)',
          900: 'var(--taklaget-gray-900)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}