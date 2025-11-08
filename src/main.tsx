import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from './ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

function bootstrap() {
  const rootEl = document.getElementById('root');
  if (!rootEl) {
    console.error('Root element #root not found – aborting render');
    return;
  }
  try {
    console.info('[bootstrap] Mounting application');
    const root = createRoot(rootEl);
    root.render(
      <StrictMode>
        <ErrorBoundary>
          <ThemeProvider>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </StrictMode>
    );
  } catch (err) {
    console.error('[bootstrap] Uncaught error during initial render', err);
    const fallback = document.createElement('div');
    fallback.style.padding = '1rem';
    fallback.style.fontFamily = 'sans-serif';
    fallback.innerText = 'A fatal error prevented the app from loading. Check the console for details.';
    rootEl.appendChild(fallback);
  }
}

bootstrap();
