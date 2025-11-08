import { applyThemePreset } from '../theme/applyPreset';
import { defaultTheme } from '../contexts/themeDefaults';
import type { ThemePresetName } from '../contexts/themeTypes';

describe('applyThemePreset (pure function)', () => {
  const presets: ThemePresetName[] = ['professional','modern','enterprise'];

  it('returns defaultTheme when preset is default', () => {
    const result = applyThemePreset({ ...defaultTheme, colors: { ...defaultTheme.colors, primary: 'CHANGED' } }, 'default');
    expect(result.preset).toBe('default');
    expect(result.colors.primary).toBe(defaultTheme.colors.primary); // reset to default
  });

  it('marks custom preset without altering colors', () => {
    const start = { ...defaultTheme };
    const result = applyThemePreset(start, 'custom');
    expect(result.preset).toBe('custom');
    expect(result.colors.primary).toBe(start.colors.primary);
  });

  presets.forEach(preset => {
    it(`applies ${preset} preset`, () => {
      const result = applyThemePreset(defaultTheme, preset);
      expect(result.preset).toBe(preset);
      // primary should differ from default for these presets
      expect(result.colors.primary).not.toBe(defaultTheme.colors.primary);
    });
  });
});
