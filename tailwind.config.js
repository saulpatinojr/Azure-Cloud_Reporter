/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Spectral', 'Georgia', 'serif'],
      },
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-muted': 'var(--color-surface-muted)',
        border: 'var(--color-border)',
        muted: 'var(--color-muted)',
        primary: 'var(--color-primary)',
        'primary-foreground': 'var(--color-primary-foreground)',
        accent: 'var(--color-accent)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
      },
      boxShadow: {
        card: '0px 24px 60px rgba(15, 23, 42, 0.08)',
        focus: '0 0 0 4px rgba(62, 121, 247, 0.18)',
      },
      borderRadius: {
        xl: '20px',
        '2xl': '28px',
      },
    },
  },
  plugins: [],
}
