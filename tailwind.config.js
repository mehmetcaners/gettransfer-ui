/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#a18072',
          600: '#8d6e63', // Main brown
          700: '#795548',
          800: '#5d4037',
          900: '#4e342e',
          950: '#3e2723',
        },
        gold: {
          50: '#fdf8f3',
          100: '#f5eadc',
          200: '#e9d0bb',
          300: '#dbb694',
          400: '#c49369',
          500: '#a67242',
          600: '#89592b',
          700: '#6f4420',
          800: '#553319',
          900: '#3b2210',
        },
        charcoal: '#0e1118',
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(141, 110, 99, 0.5)',
        'glow-gold': '0 0 40px -10px rgba(166, 114, 66, 0.4)',
        card: '0 0 1px 1px rgba(255, 255, 255, 0.5), 0 10px 40px -10px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 0 1px 1px rgba(255, 255, 255, 0.6), 0 20px 60px -12px rgba(0, 0, 0, 0.15)',
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(circle at 15% 15%, rgba(141,110,99,0.15), transparent 45%), radial-gradient(circle at 85% 15%, rgba(166,114,66,0.1), transparent 40%)',
        'glass-gradient':
          'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        'fade-in-up': 'fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};
