import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Enterprise theme system types
export interface ThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  surface: string;
  surfaceForeground: string;
  border: string;
  input: string;
  ring: string;
  text: string;
  textSecondary: string;
  muted: string;
  mutedForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  alert: string;
  alertForeground: string;
  info: string;
  infoForeground: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
}

export interface ThemeTypography {
  fontFamily: {
    sans: string[];
    mono: string[];
    display: string[];
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  fontWeight: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };
}

export interface ThemeSpacing {
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface BrandingConfig {
  companyName: string;
  logo?: {
    light: string;
    dark: string;
    favicon: string;
  };
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  customCss?: string;
}

export interface ThemeConfig extends BrandingConfig {
  mode: 'light' | 'dark' | 'auto';
  preset: 'default' | 'professional' | 'modern' | 'enterprise' | 'custom';
  animations: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  compactMode: boolean;
}

export interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: Partial<ThemeConfig>) => void;
  toggleDarkMode: () => void;
  resetToDefaults: () => void;
  applyPreset: (preset: string) => void;
  exportTheme: () => string;
  importTheme: (themeData: string) => void;
  previewTheme: (previewConfig: Partial<ThemeConfig>) => void;
  clearPreview: () => void;
  isPreviewMode: boolean;
  // Legacy compatibility
  toggleTheme: () => void;
}

// Default theme configurations
const defaultColors: ThemeColors = {
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

const defaultDarkColors: ThemeColors = {
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

const defaultTypography: ThemeTypography = {
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

const defaultSpacing: ThemeSpacing = {
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

const defaultTheme: ThemeConfig = {
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

// Theme presets
const themePresets: Record<string, Partial<ThemeConfig>> = {
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

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeConfig>(() => {
    // Load theme from localStorage or use default
    try {
      const saved = localStorage.getItem('cloud-reporter-theme');
      if (saved) {
        return { ...defaultTheme, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }
    
    // Check for legacy dark mode setting
    const legacyTheme = localStorage.getItem('theme');
    if (legacyTheme === 'dark') {
      return { ...defaultTheme, mode: 'dark' };
    }
    
    return defaultTheme;
  });
  
  const [previewConfig, setPreviewConfig] = useState<Partial<ThemeConfig> | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Determine the effective theme (with preview overlay)
  const effectiveTheme = previewConfig 
    ? { ...theme, ...previewConfig }
    : theme;

  const setTheme = (updates: Partial<ThemeConfig>) => {
    const newTheme = { ...theme, ...updates };
    setThemeState(newTheme);
    
    // Save to localStorage
    try {
      localStorage.setItem('cloud-reporter-theme', JSON.stringify(newTheme));
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  };

  const toggleDarkMode = () => {
    const newMode = theme.mode === 'light' ? 'dark' : 'light';
    setTheme({ mode: newMode });
  };

  // Legacy compatibility
  const toggleTheme = () => {
    toggleDarkMode();
  };

  const resetToDefaults = () => {
    setTheme(defaultTheme);
    clearPreview();
  };

  const applyPreset = (preset: string) => {
    if (themePresets[preset]) {
      setTheme({ ...themePresets[preset], preset });
    }
  };

  const exportTheme = (): string => {
    return JSON.stringify(theme, null, 2);
  };

  const importTheme = (themeData: string) => {
    try {
      const importedTheme = JSON.parse(themeData);
      setTheme({ ...defaultTheme, ...importedTheme });
    } catch (error) {
      throw new Error('Invalid theme data format');
    }
  };

  const previewTheme = (previewConfig: Partial<ThemeConfig>) => {
    setPreviewConfig(previewConfig);
    setIsPreviewMode(true);
  };

  const clearPreview = () => {
    setPreviewConfig(null);
    setIsPreviewMode(false);
  };

  // Apply theme CSS variables to document
  useEffect(() => {
    const root = document.documentElement;
    const colors = effectiveTheme.mode === 'dark' 
      ? { ...defaultDarkColors, ...effectiveTheme.colors }
      : effectiveTheme.colors;

    // Apply color variables
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
    });

    // Apply typography variables
    Object.entries(effectiveTheme.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value);
    });

    Object.entries(effectiveTheme.typography.fontWeight).forEach(([key, value]) => {
      root.style.setProperty(`--font-weight-${key}`, value);
    });

    Object.entries(effectiveTheme.typography.lineHeight).forEach(([key, value]) => {
      root.style.setProperty(`--line-height-${key}`, value);
    });

    // Apply spacing variables
    Object.entries(effectiveTheme.spacing.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--border-radius-${key}`, value);
    });

    Object.entries(effectiveTheme.spacing.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    Object.entries(effectiveTheme.spacing.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    // Apply font family
    root.style.setProperty('--font-family-sans', effectiveTheme.typography.fontFamily.sans.join(', '));
    root.style.setProperty('--font-family-mono', effectiveTheme.typography.fontFamily.mono.join(', '));
    root.style.setProperty('--font-family-display', effectiveTheme.typography.fontFamily.display.join(', '));

    // Apply theme mode class
    root.classList.toggle('dark', effectiveTheme.mode === 'dark');
    root.classList.toggle('light', effectiveTheme.mode === 'light');
    root.classList.toggle('compact-mode', effectiveTheme.compactMode);
    root.classList.toggle('high-contrast', effectiveTheme.highContrast);
    root.classList.toggle('reduced-motion', effectiveTheme.reducedMotion || !effectiveTheme.animations);

    // Apply custom CSS if provided
    if (effectiveTheme.customCss) {
      let customStyleEl = document.getElementById('custom-theme-styles');
      if (!customStyleEl) {
        customStyleEl = document.createElement('style');
        customStyleEl.id = 'custom-theme-styles';
        document.head.appendChild(customStyleEl);
      }
      customStyleEl.textContent = effectiveTheme.customCss;
    }

    // Update document title if company name changed
    if (effectiveTheme.companyName && effectiveTheme.companyName !== 'Cloud Assessment Solutions') {
      document.title = `Cloud Reporter - ${effectiveTheme.companyName}`;
    }

    // Update favicon if provided
    if (effectiveTheme.logo?.favicon) {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (favicon) {
        favicon.href = effectiveTheme.logo.favicon;
      }
    }
  }, [effectiveTheme]);

  const value: ThemeContextType = {
    theme: effectiveTheme,
    setTheme,
    toggleDarkMode,
    toggleTheme, // Legacy compatibility
    resetToDefaults,
    applyPreset,
    exportTheme,
    importTheme,
    previewTheme,
    clearPreview,
    isPreviewMode
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Custom hook to use the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}