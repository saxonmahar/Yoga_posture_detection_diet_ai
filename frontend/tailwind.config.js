/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a0a1a',
        secondary: '#111827',
        card: '#1f2937',
        surface: '#0f172a',
        text: '#f8fafc',
        'text-muted': '#94a3b8',
        accent: '#8b5cf6',
        'accent-light': '#a78bfa',
        'accent-dark': '#7c3aed',
        premium: '#f59e0b',
        success: '#10b981',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' },
          'to': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.8)' },
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
        'gradient-premium': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      }
    },
  },
  plugins: [],
}