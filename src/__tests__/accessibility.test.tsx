import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import HeroCard from '../components/HeroCard';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';

// Basic accessibility smoke test for the login experience

describe('Accessibility', () => {
  it('HeroCard should have no detectable a11y violations', async () => {
    const { container } = render(
      <ThemeProvider>
        <AuthProvider>
          <HeroCard />
        </AuthProvider>
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
