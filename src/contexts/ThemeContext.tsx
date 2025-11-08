import { createContext, useContext, useEffect, useState, ReactNode, useMemo, useCallback } from 'react';
import { defaultTheme, defaultDarkColors, themePresets } from './themeDefaults';
import type { ThemeConfig, ThemeContextType } from './themeTypes';
import { mergeTheme, persistTheme, loadInitialTheme } from '../theme/themeLogic';


const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeConfig>(() => loadInitialTheme(defaultTheme));
  
  const [previewConfig, setPreviewConfig] = useState<Partial<ThemeConfig> | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Determine the effective theme (with preview overlay)
  const effectiveTheme = useMemo(() => (
    previewConfig ? { ...theme, ...previewConfig } : theme
  ), [previewConfig, theme]);

  const setTheme = useCallback((updates: Partial<ThemeConfig>) => {
    const newTheme = mergeTheme(theme, updates);
    setThemeState(newTheme);
    persistTheme(newTheme);
  }, [theme]);

  // Define simple callbacks first to avoid temporal dead zone issues
  const clearPreview = useCallback(() => {
    setPreviewConfig(null);
    setIsPreviewMode(false);
  }, []);

  const previewTheme = useCallback((previewConfig: Partial<ThemeConfig>) => {
    setPreviewConfig(previewConfig);
    setIsPreviewMode(true);
  }, []);

  const toggleDarkMode = useCallback(() => {
    const newMode = theme.mode === 'light' ? 'dark' : 'light';
    setTheme({ mode: newMode });
  }, [theme.mode, setTheme]);

  // Legacy compatibility
  const toggleTheme = useCallback(() => {
    toggleDarkMode();
  }, [toggleDarkMode]);

  const resetToDefaults = useCallback(() => {
    setTheme(defaultTheme);
    clearPreview();
  }, [setTheme, clearPreview]);

  const applyPreset = useCallback((preset: string) => {
    if (themePresets[preset]) {
      setTheme({ ...themePresets[preset], preset });
    }
  }, [setTheme]);

  const exportTheme = useCallback((): string => JSON.stringify(theme, null, 2), [theme]);

  const importTheme = useCallback((themeData: string) => {
    try {
      const importedTheme = JSON.parse(themeData);
      setTheme(mergeTheme(defaultTheme, importedTheme));
    } catch {
      throw new Error('Invalid theme data format');
    }
  }, [setTheme]);

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

  return (
    <ThemeContext.Provider value={{
      theme: effectiveTheme,
      setTheme,
      toggleDarkMode,
      toggleTheme,
      resetToDefaults,
      applyPreset,
      exportTheme,
      importTheme,
      previewTheme,
      clearPreview,
      isPreviewMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// NOTE: This file now only exports React components/hooks; helper logic lives in ../theme/themeLogic.ts