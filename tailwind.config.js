/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'soft-white': '#F9F4DA',
        content: {
          skull: '"💀"',
        },
      },
    },
  },
  plugins: [],
}
