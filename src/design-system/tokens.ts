// Design System Tokens for Cloud Reporter
// Enterprise-grade, "fleshy" aesthetic with dark/light modes

export const colors = {
  // Base Colors
  base: {
    dark: {
      background: '#0f1419', // deep charcoal
      surface: '#1a1f26', // navy blue
      surfaceElevated: '#232a35', // slightly lighter navy
      border: '#2d3748', // medium charcoal
      text: '#e2e8f0', // light grey
      textSecondary: '#a0aec0', // muted grey
    },
    light: {
      background: '#fafbfc', // off-white
      surface: '#ffffff', // pure white
      surfaceElevated: '#f7fafc', // very light grey
      border: '#e2e8f0', // light grey
      text: '#2d3748', // dark charcoal
      textSecondary: '#4a5568', // medium grey
    },
  },

  // Primary Accent
  primary: '#4c51bf', // strong credible purple/deep blue

  // Secondary Accents
  success: '#38a169', // accessible green
  alert: '#e53e3e', // red for alerts
  warning: '#dd6b20', // orange for warnings

  // Data-Viz Palette (accessible-friendly)
  dataViz: {
    primary: '#3182ce', // blue
    secondary: '#2d3748', // charcoal
    tertiary: '#e6fffa', // teal
    quaternary: '#fed7d7', // light red
    accent1: '#fbb6ce', // pink
    accent2: '#fefcbf', // yellow
    accent3: '#c6f6d5', // light green
    accent4: '#bee3f8', // light blue
  },

  // Chart Colors (HSL values for CSS variables)
  chart: {
    1: 'hsl(217, 91%, 60%)', // primary blue
    2: 'hsl(142, 71%, 45%)', // success green
    3: 'hsl(38, 92%, 50%)', // warning orange
    4: 'hsl(0, 84%, 60%)', // alert red
    5: 'hsl(262, 83%, 58%)', // purple
  },
};

export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
};

export const radii = {
  sm: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
};

export const typography = {
  fontFamily: {
    ui: 'Inter, sans-serif',
    display: 'Poppins, sans-serif',
  },
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '1.25rem', // 36px
    '5xl': '3rem', // 48px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
  },
};

export const elevation = {
  level1: shadows.sm,
  level2: shadows.md,
  level3: shadows.lg,
  level4: shadows.xl,
};
