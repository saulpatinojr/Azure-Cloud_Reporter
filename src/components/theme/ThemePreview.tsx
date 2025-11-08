import { useTheme } from '../../hooks/useTheme';
import '../../styles/theme.css';

interface ThemePreviewProps {
  className?: string;
}

export function ThemePreview({ className = '' }: ThemePreviewProps) {
  const { theme } = useTheme();

  // Build CSS variable block (no inline styles on elements)
  const cssVars = `
    .theme-preview-scope {
      --tp-primary: ${theme.colors.primary};
      --tp-secondary: ${theme.colors.secondary};
      --tp-accent: ${theme.colors.accent};
      --tp-success: ${theme.colors.success};
      --tp-warning: ${theme.colors.warning};
      --tp-error: ${theme.colors.alert};
      --tp-surface: ${theme.colors.surface};
      --tp-bg: ${theme.colors.background};
      --tp-radius-md: ${theme.spacing.borderRadius.md};
      --tp-font-xl: ${theme.typography.fontSize.xl};
      --tp-font-lg: ${theme.typography.fontSize.lg};
      --tp-font-base: ${theme.typography.fontSize.base};
      --tp-weight-bold: ${theme.typography.fontWeight.bold};
      --tp-weight-semibold: ${theme.typography.fontWeight.semibold};
      --tp-weight-normal: ${theme.typography.fontWeight.normal};
      --tp-line-tight: ${theme.typography.lineHeight.tight};
      --tp-line-normal: ${theme.typography.lineHeight.normal};
      --tp-line-relaxed: ${theme.typography.lineHeight.relaxed};
    }
  `;

  return (
    <div className={`theme-preview-scope bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 ${className}`}>
      <style>{cssVars}</style>
      <div className="space-y-6">
        {/* Header Preview */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            {theme.logo?.light && (
              <img
                src={theme.mode === 'dark' ? (theme.logo.dark || theme.logo.light) : theme.logo.light}
                alt="Logo" 
                className="h-8 w-auto"
              />
            )}
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {theme.companyName || 'Cloud Reporter'}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">User Menu</span>
          </div>
        </div>

        {/* Navigation Preview */}
        <div className="flex space-x-6">
          {['Dashboard', 'Assessments', 'Reports', 'Settings'].map((item, index) => (
            <button
              key={item}
              aria-label={`Navigate to ${item}`}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${index === 0 ? 'text-white bg-[var(--tp-primary)]' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'}`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Content Cards Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Primary Card */}
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-4 h-4 rounded bg-[var(--tp-primary)]" aria-hidden="true" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Primary Card
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              This is a preview of how cards will look with your current theme settings.
            </p>
            <button 
              className="px-4 py-2 rounded text-sm font-medium text-white transition-colors bg-[var(--tp-primary)]"
              aria-label="Primary button preview"
            >
              Primary Button
            </button>
          </div>

          {/* Secondary Card */}
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-4 h-4 rounded bg-[var(--tp-secondary)]" aria-hidden="true" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Secondary Card
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Secondary elements use the secondary color from your palette.
            </p>
            <button 
              className="px-4 py-2 rounded text-sm font-medium border transition-colors border-[var(--tp-secondary)] text-[var(--tp-secondary)]" 
              aria-label="Secondary button preview"
            >
              Secondary Button
            </button>
          </div>
        </div>

        {/* Status Indicators Preview */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Status Colors</h4>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <div className="theme-status-dot bg-[var(--tp-success)]" aria-hidden="true" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Success</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="theme-status-dot bg-[var(--tp-warning)]" aria-hidden="true" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Warning</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="theme-status-dot bg-[var(--tp-error)]" aria-hidden="true" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Error</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="theme-status-dot bg-[var(--tp-accent)]" aria-hidden="true" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Accent</span>
            </div>
          </div>
        </div>

        {/* Typography Preview (classes replace inline font-weight/font-size/line-height) */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Typography</h4>
          <div className="space-y-2">
            <h1 className="tp-heading-xl text-gray-900 dark:text-gray-100">Large Heading</h1>
            <h2 className="tp-heading-lg text-gray-900 dark:text-gray-100">Medium Heading</h2>
            <p className="tp-text-base text-gray-600 dark:text-gray-400">
              This is regular body text that shows how paragraphs will appear with your current typography settings.
            </p>
          </div>
        </div>

        {/* Form Elements Preview */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Form Elements</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Text input"
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 tp-radius-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              aria-label="Preview text input"
            />
            <select 
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 tp-radius-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              aria-label="Preview select input"
            >
              <option>Select option</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}