import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface UseRelocateOnAuthOptions {
  whenAuthenticatedPath?: string;
  whenUnauthenticatedPath?: string;
}

export default function useRelocateOnAuth({ whenAuthenticatedPath, whenUnauthenticatedPath }: UseRelocateOnAuthOptions) {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading)
      return;
    if (isAuthenticated && whenAuthenticatedPath)
      window.location.href = whenAuthenticatedPath;
    if (!isAuthenticated && whenUnauthenticatedPath)
      window.location.href = whenUnauthenticatedPath;
  }, [isAuthenticated, isLoading, whenAuthenticatedPath, whenUnauthenticatedPath]);
}
