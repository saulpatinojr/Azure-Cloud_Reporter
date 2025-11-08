import { defaultTheme, themePresets } from '../contexts/themeDefaults';
import type { ThemeConfig, ThemePresetName } from '../contexts/themeTypes';
import { mergeTheme } from './themeLogic';

// Pure helper to apply a preset without touching React/JSDOM
export function applyThemePreset(current: ThemeConfig, preset: ThemePresetName): ThemeConfig {
  if (preset === 'default') return defaultTheme;
  if (preset === 'custom') return { ...current, preset: 'custom' };
  const presetConfig = themePresets[preset];
  return mergeTheme(current, { ...presetConfig, preset });
}
