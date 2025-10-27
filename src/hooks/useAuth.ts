import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { User } from '@shared/types';
interface AuthResponse {
  user: User;
  token: string;
}
export function useAuth() {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const { data: user, isLoading, isError } = useQuery<User>({
    queryKey: ['authUser'],
    queryFn: () => api<User>('/api/auth/me'),
    enabled: !!token,
    retry: 1,
  });
  const setAuthToken = useCallback((newToken: string | null) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('authToken', newToken);
    } else {
      localStorage.removeItem('authToken');
    }
  }, []);
  useEffect(() => {
    if (isError) {
      setAuthToken(null);
      queryClient.setQueryData(['authUser'], null);
    }
  }, [isError, setAuthToken, queryClient]);
  // Listen for storage changes to sync across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('authToken');
      if (newToken !== token) {
        setToken(newToken);
        queryClient.invalidateQueries({ queryKey: ['authUser'] });
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [token, queryClient]);
  const login = async (email: string, password: string): Promise<void> => {
    const { user, token: newToken } = await api<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(newToken);
    queryClient.setQueryData(['authUser'], user);
  };
  const register = async (email: string, password: string): Promise<void> => {
    await api<User>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  };
  const logout = useCallback(() => {
    setAuthToken(null);
    queryClient.setQueryData(['authUser'], null);
    queryClient.clear(); // Clear all caches on logout
  }, [setAuthToken, queryClient]);
  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
  };
}