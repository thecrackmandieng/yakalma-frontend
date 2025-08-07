import type { Config } from 'tailwindcss'

const config: Config = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      keyframes: {
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'smoke-puff': {
          '0%': { transform: 'translateY(0)', opacity: '0.4' },
          '100%': { transform: 'translateY(-60px)', opacity: '0' },
        },
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.8s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'pop-in': 'pop-in 0.5s ease-out forwards',
        'smoke-puff': 'smoke-puff 2.5s ease-in infinite',
      },
    },
  },
  plugins: [],
}
export default config
