/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark:        '#07070d',
          bg:          '#0a0a14',
          surface:     '#0d0d1c',
          card:        '#111120',
          cardHover:   '#18182a',
          cyan:        '#00e5ff',
          cyanDark:    '#00b8d4',
          violet:      '#7c3aed',
          violetLight: '#a78bfa',
          gold:        '#d4a855',
          goldLight:   '#f0cc7a',
          goldDark:    '#b8892a',
          platinum:    '#c8c8d8',
          champagne:   '#ede0c4',
          text:        '#eeeef5',
          muted:       '#7a7a95',
          subtle:      '#3a3a55',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body:    ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'luxury':    '0 8px 40px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.05) inset',
        'gold':      '0 0 30px rgba(212,168,85,0.18)',
        'card':      '0 4px 24px rgba(0,0,0,0.45)',
        'glow-cyan': '0 0 30px rgba(0,229,255,0.22)',
      },
    },
  },
  plugins: [],
}
