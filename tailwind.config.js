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
        display: ['Poppins', 'Georgia', 'serif'],
      },
      colors: {
        // CSS Variables for theme-aware colors
        background: 'hsl(var(--background))',
        surface: 'hsl(var(--surface))',
        'surface-elevated': 'hsl(var(--surface-elevated))',
        border: 'hsl(var(--border))',
        text: 'hsl(var(--text))',
        'text-secondary': 'hsl(var(--text-secondary))',
        // Primary and accents
        primary: 'hsl(var(--primary))',
        success: 'hsl(var(--success))',
        alert: 'hsl(var(--alert))',
        warning: 'hsl(var(--warning))',
        // Chart colors
        'chart-1': 'hsl(var(--chart-1))',
        'chart-2': 'hsl(var(--chart-2))',
        'chart-3': 'hsl(var(--chart-3))',
        'chart-4': 'hsl(var(--chart-4))',
        'chart-5': 'hsl(var(--chart-5))',
        // Legacy colors (for backward compatibility)
        'base-dark-background': '#0f1419',
        'base-dark-surface': '#1a1f26',
        'base-dark-surface-elevated': '#232a35',
        'base-dark-border': '#2d3748',
        'base-dark-text': '#e2e8f0',
        'base-dark-text-secondary': '#a0aec0',
        'base-light-background': '#fafbfc',
        'base-light-surface': '#ffffff',
        'base-light-surface-elevated': '#f7fafc',
        'base-light-border': '#e2e8f0',
        'base-light-text': '#2d3748',
        'base-light-text-secondary': '#4a5568',
        // Data-viz palette
        'data-viz-primary': '#3182ce',
        'data-viz-secondary': '#2d3748',
        'data-viz-tertiary': '#e6fffa',
        'data-viz-quaternary': '#fed7d7',
        'data-viz-accent1': '#fbb6ce',
        'data-viz-accent2': '#fefcbf',
        'data-viz-accent3': '#c6f6d5',
        'data-viz-accent4': '#bee3f8',
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}
