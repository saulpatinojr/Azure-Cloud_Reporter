import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Button } from '../design-system';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleDarkMode } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleDarkMode}
      aria-label={`Switch to ${theme.mode === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme.mode === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
};