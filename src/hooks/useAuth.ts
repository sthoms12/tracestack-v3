import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { AuthUser } from '@shared/types';
// This is the standard logout path for a Cloudflare Access application.
// It should be configured in the Cloudflare Zero Trust dashboard.
const CLOUDFLARE_ACCESS_LOGOUT_URL = '/cdn-cgi/access/logout';
export function useAuth() {
  const { data: user, isLoading, error } = useQuery<AuthUser>({
    queryKey: ['authUser'],
    queryFn: () => api<AuthUser>('/api/auth/me'),
    retry: false, // Don't retry on 401/403, which is expected if not logged in
    staleTime: 1000 * 60 * 5, // User session is stable, refetch every 5 mins
  });
  const logout = () => {
    // This will redirect the user to the Cloudflare Access logout page,
    // which then redirects back to the application's landing page.
    window.location.href = CLOUDFLARE_ACCESS_LOGOUT_URL;
  };
  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    error,
    logout,
  };
}