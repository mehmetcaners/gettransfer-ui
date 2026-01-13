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
        glow: '0 25px 70px rgba(166, 114, 66, 0.35)',
        card: '0 20px 60px rgba(15, 23, 42, 0.08)',
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(circle at 20% 20%, rgba(166,114,66,0.12), transparent 45%), radial-gradient(circle at 80% 0%, rgba(59,130,246,0.08), transparent 35%)',
        'mesh-gradient':
          'linear-gradient(125deg, rgba(15,23,42,0.85) 0%, rgba(34,28,44,0.92) 45%, rgba(15,23,42,0.88) 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};
