import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { SmoothScroll } from './providers/SmoothScroll';
import { ApiRequestError } from './lib/api';
import './lib/gsap';
import './styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      // Don't retry client errors such as 404s.
      retry: (count, err) => !(err instanceof ApiRequestError && err.status < 500) && count < 2,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <SmoothScroll>
          <App />
        </SmoothScroll>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
