import type { Config } from 'tailwindcss';

export default {
  content: [
    "./src/**/*.{html,ts,css,scss}",
    "./src/app/**/*.{html,ts,css,scss}",
    "./src/app/pages/**/*.{html,ts,css,scss}",
    "./src/app/components/**/*.{html,ts,css,scss}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
