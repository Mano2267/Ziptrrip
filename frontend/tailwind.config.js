/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './todo.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdfdfdff',
          100: '#f5f5f5ff',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#735c94ff'
        }
      },
      keyframes: {
        'pop': {
          '0%':   { transform: 'scale(1)' },
          '50%':  { transform: 'scale(0.93)' },
          '100%': { transform: 'scale(1)' }
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' }
        }
      },
      animation: {
        'pop': 'pop 0.18s ease-in-out',
      }
    }
  },
  plugins: []
};
