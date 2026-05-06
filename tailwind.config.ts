import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        iveco: {
          blue: '#1654FF',
          'blue-dark': '#0D3FCC',
          'blue-light': '#3A6FFF',
          'blue-dim': '#1654FF26',
        },
        surface: {
          DEFAULT: '#0F0F11',
          raised: '#17171B',
          high: '#1F1F25',
        },
        ink: {
          DEFAULT: '#080808',
        },
        border: {
          DEFAULT: '#232329',
          subtle: '#17171B',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.6), 0 8px 32px rgba(0,0,0,0.4)',
        blue: '0 0 0 3px rgba(22,84,255,0.25)',
        'blue-sm': '0 0 0 2px rgba(22,84,255,0.20)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
