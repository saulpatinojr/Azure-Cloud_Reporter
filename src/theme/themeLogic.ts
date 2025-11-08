import type { ThemeConfig } from '../contexts/themeTypes';

export function loadInitialTheme(defaultTheme: ThemeConfig): ThemeConfig {
  try {
    const saved = localStorage.getItem('cloud-reporter-theme');
    if (saved) {
      return { ...defaultTheme, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.warn('Failed to load theme from localStorage:', error);
  }
  const legacyTheme = localStorage.getItem('theme');
  if (legacyTheme === 'dark') {
    return { ...defaultTheme, mode: 'dark' };
  }
  return defaultTheme;
}

export function persistTheme(theme: ThemeConfig) {
  try {
    localStorage.setItem('cloud-reporter-theme', JSON.stringify(theme));
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
}

export function mergeTheme(base: ThemeConfig, updates: Partial<ThemeConfig>): ThemeConfig {
  return { ...base, ...updates };
}
