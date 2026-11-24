/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apex: {
          primary: '#246BFD',
          dark: '#102A56',
          white: '#FFFFFF',
          bg: '#F5F8FD',
          lightBlue: '#EAF2FF',
          accent: '#0D47A1',
          surface: '#FFFFFF',
          border: '#E2E8F0',
          success: '#16A36A',
          error: '#DC3545',
          warning: '#F59E0B',
          muted: '#64748B',
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(16, 42, 86, 0.05)',
        'premium': '0 10px 30px -4px rgba(36, 107, 253, 0.08)',
        'glow': '0 0 25px rgba(36, 107, 253, 0.25)',
        'card': '0 2px 12px rgba(16, 42, 86, 0.04), 0 1px 3px rgba(16, 42, 86, 0.02)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
