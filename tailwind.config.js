/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark:        '#07070d',
          bg:          '#0a0a12',
          card:        '#12121c',
          cardHover:   '#1a1a28',
          cyan:        '#00e5ff',
          cyanDark:    '#00b8d4',
          violet:      '#7c3aed',
          violetLight: '#a78bfa',
          gold:        '#f5c542',
          goldDark:    '#d4a030',
          text:        '#eeeef5',
          muted:       '#7a7a95',
          subtle:      '#3a3a52',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body:    ['"Outfit"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
