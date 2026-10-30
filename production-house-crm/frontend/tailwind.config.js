/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        studio: {
          deep: '#050505',
          bg: '#0A0A0A',
          card: '#151515',
          charcoal: '#202020',
          gold: '#D4AF37',
          goldBright: '#F5D76E',
          silver: '#C0C0C0',
          muted: '#A1A1AA',
          border: '#333333',
        },
        canvas: '#070b18',
        panel: '#0f1424',
        line: '#252a36',
        accent: '#a78bfa',
        mint: '#8ee3c1',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Manrope', '"DM Sans"', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 60px rgba(139, 92, 246, 0.18)',
      },
    },
  },
  plugins: [],
};
