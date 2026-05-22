/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          900: '#7c2d12',
        },
        gold: '#FFD700',
        silver: '#C0C0C0',
        bronze: '#CD7F32',
      },
      fontFamily: {
        display: ['"Inter"', 'sans-serif'],
      },
      animation: {
        'rank-up': 'rankUp 0.5s ease-out',
        'rank-down': 'rankDown 0.5s ease-out',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'slide-in': 'slideIn 0.4s ease-out',
        'count-up': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        rankUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        rankDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,215,0,0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(255,215,0,0.8)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
