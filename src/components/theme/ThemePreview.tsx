import { useTheme } from '../../contexts/ThemeContext';

interface ThemePreviewProps {
  className?: string;
}

export function ThemePreview({ className = '' }: ThemePreviewProps) {
  const { theme } = useTheme();

  return (
    <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 ${className}`}>
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
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                index === 0
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
              style={index === 0 ? { backgroundColor: theme.colors.primary } : {}}
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
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: theme.colors.primary }}
              ></div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Primary Card
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              This is a preview of how cards will look with your current theme settings.
            </p>
            <button 
              className="px-4 py-2 rounded text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: theme.colors.primary }}
            >
              Primary Button
            </button>
          </div>

          {/* Secondary Card */}
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-3 mb-3">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: theme.colors.secondary }}
              ></div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Secondary Card
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Secondary elements use the secondary color from your palette.
            </p>
            <button 
              className="px-4 py-2 rounded text-sm font-medium border transition-colors"
              style={{ 
                borderColor: theme.colors.secondary,
                color: theme.colors.secondary
              }}
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
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: theme.colors.success }}
              ></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Success</span>
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: theme.colors.warning }}
              ></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Warning</span>
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: theme.colors.alert }}
              ></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Error</span>
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: theme.colors.accent }}
              ></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Accent</span>
            </div>
          </div>
        </div>

        {/* Typography Preview */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Typography</h4>
          <div className="space-y-2">
            <h1 
              className="text-gray-900 dark:text-gray-100 font-bold"
              style={{ 
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.bold,
                lineHeight: theme.typography.lineHeight.tight
              }}
            >
              Large Heading
            </h1>
            <h2 
              className="text-gray-900 dark:text-gray-100 font-semibold"
              style={{ 
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.semibold,
                lineHeight: theme.typography.lineHeight.normal
              }}
            >
              Medium Heading
            </h2>
            <p 
              className="text-gray-600 dark:text-gray-400"
              style={{ 
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.normal,
                lineHeight: theme.typography.lineHeight.relaxed
              }}
            >
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
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              style={{ borderRadius: theme.spacing.borderRadius.md }}
            />
            <select 
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              style={{ borderRadius: theme.spacing.borderRadius.md }}
            >
              <option>Select option</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}