import { useContext } from 'react';
import type { ThemeContextType } from '../contexts/themeTypes';
import { ThemeContext } from '../contexts/themeContextBase';

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}