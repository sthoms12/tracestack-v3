import { useAuth } from '@/hooks/useAuth';
import { Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
export default function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  // In a real app, you might redirect to a login page if not authenticated.
  // With Cloudflare Access, the user should be redirected by Cloudflare before reaching here.
  // This check is a fallback.
  if (!isAuthenticated) {
    // This could redirect to the landing page or show an "Access Denied" message.
    // For now, we show a loader as CF Access should handle the redirect.
     return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }
  return <Outlet />;
}