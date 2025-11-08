import React from 'react';
// Mock firebase-native to avoid import.meta env usage during tests
jest.mock('../lib/firebase-native', () => ({ logAnalyticsEvent: jest.fn() }));
// Mock Auth context & hook to avoid Firebase dependencies
jest.mock('../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    signInWithGoogle: jest.fn(),
    signInWithEmail: jest.fn(),
    resetPassword: jest.fn(),
  }),
}));
// Mock Theme context & hook to avoid complex preset logic
jest.mock('../contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock('../hooks/useTheme', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        primary: '#000000',
        secondary: '#111111',
        accent: '#222222',
        success: '#00ff00',
        warning: '#ffaa00',
        alert: '#ff0000',
        background: '#ffffff',
        surface: '#f5f5f5',
      },
      typography: { fontSize: {}, fontWeight: {} },
      spacing: { borderRadius: {}, spacing: {} },
      logo: {},
    },
    setTheme: jest.fn(),
    applyPreset: jest.fn(),
    resetToDefaults: jest.fn(),
    exportTheme: jest.fn(() => '{}'),
    importTheme: jest.fn(),
    clearPreview: jest.fn(),
    isPreviewMode: false,
  }),
}));
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import HeroCard from '../components/HeroCard';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { ThemeCustomizer } from '../components/theme/ThemeCustomizer';
import { BrowserRouter } from 'react-router-dom';

// Expanded accessibility smoke tests for key UI regions:
// - HeroCard (login dialog)
// - Sidebar navigation (requires Router context)
// - Topbar (search + user info)
// - ThemeCustomizer modal (dialog semantics)

describe('Accessibility', () => {
  function withProviders(ui: React.ReactElement) {
    return (
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>{ui}</AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  }

  it('HeroCard has no detectable a11y violations', async () => {
    const { container } = render(withProviders(<HeroCard />));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Sidebar navigation has no detectable a11y violations', async () => {
    const { container } = render(withProviders(<Sidebar />));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Topbar has no detectable a11y violations', async () => {
    const { container } = render(withProviders(<Topbar title="Workspace Hub" subtitle="Test subtitle" />));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('ThemeCustomizer dialog has no detectable a11y violations', async () => {
    const { container } = render(withProviders(<ThemeCustomizer />));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
