import { useState } from 'react';
import '../../styles/theme.css';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../design-system/components/Button';
import { Card } from '../../design-system/components/Card';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          className="w-8 h-8 rounded border-2 border-gray-300 dark:border-gray-600 cursor-pointer p-0"
          data-color={value}
          aria-label={`${label} color preview`}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'color';
            input.value = value;
            input.onchange = (e) => onChange((e.target as HTMLInputElement).value);
            input.click();
          }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

interface ThemeCustomizerProps {
  onClose?: () => void;
}

export function ThemeCustomizer({ onClose }: ThemeCustomizerProps) {
  const { theme, setTheme, applyPreset, resetToDefaults, exportTheme, importTheme, clearPreview, isPreviewMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing' | 'branding' | 'presets'>('colors');
  const [importData, setImportData] = useState('');

  const handleColorChange = (colorKey: string, value: string) => {
    setTheme({
      colors: {
        ...theme.colors,
        [colorKey]: value
      }
    });
  };

  const handleTypographyChange = (category: string, key: string, value: string) => {
    setTheme({
      typography: {
        ...theme.typography,
        [category]: {
          ...theme.typography[category as keyof typeof theme.typography],
          [key]: value
        }
      }
    });
  };

  const handleSpacingChange = (category: string, key: string, value: string) => {
    setTheme({
      spacing: {
        ...theme.spacing,
        [category]: {
          ...theme.spacing[category as keyof typeof theme.spacing],
          [key]: value
        }
      }
    });
  };

  const handleBrandingChange = (key: string, value: string) => {
    setTheme({
      [key]: value
    });
  };

  const handleLogoChange = (logoType: string, value: string) => {
    setTheme({
      logo: {
        light: theme.logo?.light || '',
        dark: theme.logo?.dark || '',
        favicon: theme.logo?.favicon || '',
        [logoType]: value
      }
    });
  };

  const handleImport = () => {
    try {
      importTheme(importData);
      setImportData('');
      alert('Theme imported successfully!');
    } catch {
      alert('Invalid theme data. Please check the format.');
    }
  };

  const handleExport = () => {
    const exported = exportTheme();
    navigator.clipboard.writeText(exported).then(() => {
      alert('Theme exported to clipboard!');
    }).catch(() => {
      // Fallback for browsers without clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = exported;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Theme exported to clipboard!');
    });
  };

  const tabs = [
    { id: 'colors', label: 'Colors' },
    { id: 'typography', label: 'Typography' },
    { id: 'spacing', label: 'Spacing' },
    { id: 'branding', label: 'Branding' },
    { id: 'presets', label: 'Presets' }
  ] as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="theme-customizer-title">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-5/6 flex flex-col" role="document">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 id="theme-customizer-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Theme Customizer
          </h2>
          <div className="flex items-center space-x-3">
            {isPreviewMode && (
              <Button
                variant="secondary"
                size="sm"
                onClick={clearPreview}
              >
                Clear Preview
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-label={`Open ${tab.label} settings`}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'colors' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Color Palette
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <ColorPicker
                  label="Primary"
                  value={theme.colors.primary}
                  onChange={(value) => handleColorChange('primary', value)}
                />
                <ColorPicker
                  label="Secondary"
                  value={theme.colors.secondary}
                  onChange={(value) => handleColorChange('secondary', value)}
                />
                <ColorPicker
                  label="Accent"
                  value={theme.colors.accent}
                  onChange={(value) => handleColorChange('accent', value)}
                />
                <ColorPicker
                  label="Success"
                  value={theme.colors.success}
                  onChange={(value) => handleColorChange('success', value)}
                />
                <ColorPicker
                  label="Warning"
                  value={theme.colors.warning}
                  onChange={(value) => handleColorChange('warning', value)}
                />
                <ColorPicker
                  label="Error"
                  value={theme.colors.alert}
                  onChange={(value) => handleColorChange('error', value)}
                />
                <ColorPicker
                  label="Background"
                  value={theme.colors.background}
                  onChange={(value) => handleColorChange('background', value)}
                />
                <ColorPicker
                  label="Surface"
                  value={theme.colors.surface}
                  onChange={(value) => handleColorChange('surface', value)}
                />
              </div>
            </div>
          )}

          {activeTab === 'typography' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Typography Settings
              </h3>
              
              {/* Font Sizes */}
              <Card>
                <div className="p-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Font Sizes
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(theme.typography.fontSize).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <label htmlFor={`font-size-${key}`} className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {key}
                        </label>
                        <input
                          id={`font-size-${key}`}
                          type="text"
                          value={String(value)}
                          onChange={(e) => handleTypographyChange('fontSize', key, e.target.value)}
                          className="w-20 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          aria-label={`${key} font size`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Font Weights */}
              <Card>
                <div className="p-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Font Weights
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(theme.typography.fontWeight).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <label htmlFor={`font-weight-${key}`} className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {key}
                        </label>
                        <input
                          id={`font-weight-${key}`}
                          type="number"
                          value={String(value)}
                          onChange={(e) => handleTypographyChange('fontWeight', key, e.target.value)}
                          className="w-20 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          min="100"
                          max="900"
                          step="100"
                          aria-label={`${key} font weight`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'spacing' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Spacing & Layout
              </h3>
              
              {/* Border Radius */}
              <Card>
                <div className="p-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Border Radius
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(theme.spacing.borderRadius).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <label htmlFor={`border-radius-${key}`} className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {key}
                        </label>
                        <input
                          id={`border-radius-${key}`}
                          type="text"
                          value={String(value)}
                          onChange={(e) => handleSpacingChange('borderRadius', key, e.target.value)}
                          className="w-20 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          aria-label={`${key} border radius`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Spacing */}
              <Card>
                <div className="p-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Spacing Scale
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(theme.spacing.spacing).slice(0, 8).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <label htmlFor={`spacing-${key}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {key}
                        </label>
                        <input
                          id={`spacing-${key}`}
                          type="text"
                          value={String(value)}
                          onChange={(e) => handleSpacingChange('spacing', key, e.target.value)}
                          className="w-20 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          aria-label={`${key} spacing value`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Brand Customization
              </h3>
              
              <Card>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={theme.companyName || ''}
                      onChange={(e) => handleBrandingChange('companyName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="Your Company Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Primary Logo URL
                    </label>
                    <input
                      type="url"
                      value={theme.logo?.light || ''}
                      onChange={(e) => handleLogoChange('primary', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="https://your-domain.com/logo.png"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dark Mode Logo URL
                    </label>
                    <input
                      type="url"
                      value={theme.logo?.dark || ''}
                      onChange={(e) => handleLogoChange('dark', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="https://your-domain.com/logo-dark.png"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Favicon URL
                    </label>
                    <input
                      type="url"
                      value={theme.logo?.favicon || ''}
                      onChange={(e) => handleLogoChange('favicon', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="https://your-domain.com/favicon.ico"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Custom CSS
                    </label>
                    <textarea
                      value={theme.customCss || ''}
                      onChange={(e) => handleBrandingChange('customCss', e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
                      placeholder="/* Your custom CSS here */"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Add custom CSS to further customize the appearance
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'presets' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Theme Presets & Management
              </h3>
              
              {/* Preset Selection */}
              <Card>
                <div className="p-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Quick Presets
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => applyPreset('professional')}
                      className="text-left"
                    >
                      Professional
                      <span className="block text-xs text-gray-500 dark:text-gray-400">
                        Clean and corporate
                      </span>
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => applyPreset('modern')}
                      className="text-left"
                    >
                      Modern
                      <span className="block text-xs text-gray-500 dark:text-gray-400">
                        Contemporary design
                      </span>
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => applyPreset('enterprise')}
                      className="text-left"
                    >
                      Enterprise
                      <span className="block text-xs text-gray-500 dark:text-gray-400">
                        Business focused
                      </span>
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Import/Export */}
              <Card>
                <div className="p-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Import/Export Theme
                  </h4>
                  <div className="space-y-3">
                    <div className="flex space-x-3">
                      <Button onClick={handleExport} variant="secondary">
                        Export Current Theme
                      </Button>
                      <Button onClick={resetToDefaults} variant="secondary">
                        Reset to Defaults
                      </Button>
                    </div>
                    <div>
                      <textarea
                        value={importData}
                        onChange={(e) => setImportData(e.target.value)}
                        placeholder="Paste theme JSON data here to import..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
                      />
                      <Button
                        onClick={handleImport}
                        disabled={!importData.trim()}
                        className="mt-2"
                      >
                        Import Theme
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}