/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5d9e2',
          300: '#b0b7c6',
          400: '#828ca6',
          500: '#636d88',
          600: '#4e5670',
          700: '#40465b',
          800: '#373c4d',
          900: '#1f2230',
          950: '#12141d',
        },
        brand: {
          50: '#edf7f2',
          100: '#d4ebe0',
          200: '#a9d7c0',
          300: '#75bd9b',
          400: '#4ba87d',
          500: '#2d8b63',
          600: '#1f7050',
          700: '#195a41',
          800: '#154533',
          900: '#103428',
          950: '#0a1f18',
        },
        mint: {
          50: '#f0faf8',
          100: '#d9f2ee',
          200: '#b3e5dc',
          300: '#80d3c6',
          400: '#4cbcab',
          500: '#2aa399',
          600: '#1f8780',
          700: '#1c6d68',
          800: '#1a5754',
          900: '#174845',
          950: '#0c2a28',
        },
        accent: {
          50: '#fff8ed',
          100: '#ffefd4',
          200: '#ffdba8',
          300: '#ffc070',
          400: '#ff9a37',
          500: '#fe7d11',
          600: '#ef6306',
          700: '#c64a07',
          800: '#9d3a0d',
          900: '#7e3210',
          950: '#451706',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(16,18,29,0.04), 0 4px 16px rgba(16,18,29,0.06)',
        lift: '0 8px 30px rgba(16,18,29,0.10)',
        glow: '0 0 0 1px rgba(45,139,99,0.25), 0 12px 40px rgba(45,139,99,0.18)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease forwards',
        'fade-in': 'fade-in 0.4s ease forwards',
        'scale-in': 'scale-in 0.25s ease forwards',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
