// Extracted theme defaults & presets from ThemeContext for fast-refresh compliance.
import type { ThemeColors, ThemeTypography, ThemeSpacing, ThemeConfig, ThemePresetName } from './themeTypes';

export const defaultColors: ThemeColors = {
  primary: '220 90% 56%',
  primaryForeground: '0 0% 100%',
  secondary: '220 14% 96%',
  secondaryForeground: '220 9% 46%',
  accent: '220 14% 96%',
  accentForeground: '220 9% 46%',
  background: '0 0% 100%',
  foreground: '220 9% 46%',
  surface: '220 14% 96%',
  surfaceForeground: '220 9% 46%',
  border: '220 13% 91%',
  input: '220 13% 91%',
  ring: '220 90% 56%',
  text: '220 9% 46%',
  textSecondary: '220 9% 66%',
  muted: '220 14% 96%',
  mutedForeground: '220 9% 66%',
  success: '142 72% 29%',
  successForeground: '0 0% 100%',
  warning: '38 92% 50%',
  warningForeground: '0 0% 100%',
  alert: '0 84% 60%',
  alertForeground: '0 0% 100%',
  info: '217 92% 59%',
  infoForeground: '0 0% 100%',
  chart1: '220 90% 56%',
  chart2: '142 72% 29%',
  chart3: '38 92% 50%',
  chart4: '0 84% 60%',
  chart5: '262 83% 58%'
};

export const defaultDarkColors: ThemeColors = {
  ...defaultColors,
  background: '220 13% 9%',
  foreground: '220 9% 94%',
  surface: '220 13% 14%',
  surfaceForeground: '220 9% 94%',
  border: '220 13% 18%',
  input: '220 13% 18%',
  text: '220 9% 94%',
  textSecondary: '220 9% 74%',
  muted: '220 13% 14%',
  mutedForeground: '220 9% 74%',
  secondary: '220 13% 14%',
  secondaryForeground: '220 9% 94%',
  accent: '220 13% 14%',
  accentForeground: '220 9% 94%'
};

export const defaultTypography: ThemeTypography = {
  fontFamily: {
    sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['JetBrains Mono', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
    display: ['Inter Display', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem'
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75'
  }
};

export const defaultSpacing: ThemeSpacing = {
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px'
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
    '3xl': '6rem'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  }
};

export const defaultTheme: ThemeConfig = {
  companyName: 'Cloud Assessment Solutions',
  mode: 'light',
  preset: 'default',
  colors: defaultColors,
  typography: defaultTypography,
  spacing: defaultSpacing,
  animations: true,
  reducedMotion: false,
  highContrast: false,
  compactMode: false
};

// Presets exclude 'default' and 'custom' which are managed outside this map
type ConcretePreset = Exclude<ThemePresetName, 'default' | 'custom'>;
export const themePresets: Record<ConcretePreset, Partial<ThemeConfig>> = {
  professional: {
    colors: {
      ...defaultColors,
      primary: '210 100% 50%',
      chart1: '210 100% 50%',
      chart2: '210 100% 35%',
      chart3: '210 100% 65%',
      chart4: '210 50% 80%',
      chart5: '210 30% 90%'
    },
    typography: {
      ...defaultTypography,
      fontFamily: {
        ...defaultTypography.fontFamily,
        sans: ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
      }
    }
  },
  modern: {
    colors: {
      ...defaultColors,
      primary: '262 83% 58%',
      chart1: '262 83% 58%',
      chart2: '292 83% 58%',
      chart3: '322 83% 58%',
      chart4: '352 83% 58%',
      chart5: '22 83% 58%'
    },
    spacing: {
      ...defaultSpacing,
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px'
      }
    }
  },
  enterprise: {
    colors: {
      ...defaultColors,
      primary: '208 100% 47%',
      secondary: '210 11% 96%',
      chart1: '208 100% 47%',
      chart2: '208 100% 32%',
      chart3: '208 100% 62%',
      chart4: '208 50% 80%',
      chart5: '208 30% 90%'
    },
    compactMode: true
  }
};
