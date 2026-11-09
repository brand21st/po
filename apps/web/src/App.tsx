import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';

const ExhibitPage = lazy(() => import('./pages/ExhibitPage'));
const TicketsPage = lazy(() => import('./pages/TicketsPage'));
const VisitPage = lazy(() => import('./pages/VisitPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function PageFallback() {
  return <div className="min-h-screen" aria-busy="true" />;
}

export function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="exhibits/:slug" element={<ExhibitPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="visit" element={<VisitPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
