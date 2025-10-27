import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import LandingPage from '@/pages/LandingPage';
import SessionsListPage from './pages/SessionsListPage';
import SessionDetailPage from './pages/SessionDetailPage';
import { Toaster } from '@/components/ui/sonner';
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/app",
    element: <Navigate to="/app/dashboard" replace />,
  },
  {
    path: "/app/dashboard",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/app/sessions",
    element: <SessionsListPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/app/sessions/:id",
    element: <SessionDetailPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster richColors />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)