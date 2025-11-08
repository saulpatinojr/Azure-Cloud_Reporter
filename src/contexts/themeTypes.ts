export interface ThemeColors {
  primary: string; primaryForeground: string; secondary: string; secondaryForeground: string; accent: string; accentForeground: string; background: string; foreground: string; surface: string; surfaceForeground: string; border: string; input: string; ring: string; text: string; textSecondary: string; muted: string; mutedForeground: string; success: string; successForeground: string; warning: string; warningForeground: string; alert: string; alertForeground: string; info: string; infoForeground: string; chart1: string; chart2: string; chart3: string; chart4: string; chart5: string;
}
export interface ThemeTypography {
  fontFamily: { sans: string[]; mono: string[]; display: string[]; };
  fontSize: { xs: string; sm: string; base: string; lg: string; xl: string; '2xl': string; '3xl': string; '4xl': string; '5xl': string; };
  fontWeight: { normal: string; medium: string; semibold: string; bold: string; };
  lineHeight: { tight: string; normal: string; relaxed: string; };
}
export interface ThemeSpacing { borderRadius: { sm: string; md: string; lg: string; xl: string; full: string; }; spacing: { xs: string; sm: string; md: string; lg: string; xl: string; '2xl': string; '3xl': string; }; shadows: { sm: string; md: string; lg: string; xl: string; }; }
export interface BrandingConfig { companyName: string; logo?: { light: string; dark: string; favicon: string; }; colors: ThemeColors; typography: ThemeTypography; spacing: ThemeSpacing; customCss?: string; }
export interface ThemeConfig extends BrandingConfig { mode: 'light' | 'dark' | 'auto'; preset: 'default' | 'professional' | 'modern' | 'enterprise' | 'custom'; animations: boolean; reducedMotion: boolean; highContrast: boolean; compactMode: boolean; }
export interface ThemeContextType { theme: ThemeConfig; setTheme: (theme: Partial<ThemeConfig>) => void; toggleDarkMode: () => void; resetToDefaults: () => void; applyPreset: (preset: string) => void; exportTheme: () => string; importTheme: (themeData: string) => void; previewTheme: (previewConfig: Partial<ThemeConfig>) => void; clearPreview: () => void; isPreviewMode: boolean; toggleTheme: () => void; }
