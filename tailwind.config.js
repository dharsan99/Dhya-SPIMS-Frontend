/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ✅ Enable dark mode via class
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundSize: {
        '200%': '200% 200%', // ✅ gradient bg movement
      },
      backgroundImage: {
        'noise': "url('/noise.png')", // 📁 Add a small transparent noise texture image
      },
      animation: {
        'gradient-x': 'gradient-x 10s ease infinite',
        'particle': 'particle 12s linear infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'particle': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: 1 },
          '100%': { transform: 'translateY(-100vh) scale(1.2)', opacity: 0.5 },
        },
        'twinkle': {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 0.8 },
        },
      },
    },
  },
  plugins: [],
};