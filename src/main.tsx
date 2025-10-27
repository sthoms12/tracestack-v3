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
import AnalyticsPage from './pages/AnalyticsPage';
import SearchPage from './pages/SearchPage';
import SettingsPage from './pages/SettingsPage';
import SupportPage from './pages/SupportPage';
import AiAssistantPage from './pages/AiAssistantPage';
import ProtectedLayout from './components/layout/ProtectedLayout';
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
    element: <ProtectedLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <HomePage />,
      },
      {
        path: "sessions",
        element: <SessionsListPage />,
      },
      {
        path: "sessions/:id",
        element: <SessionDetailPage />,
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "ai-assistant",
        element: <AiAssistantPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "support",
        element: <SupportPage />,
      },
    ]
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