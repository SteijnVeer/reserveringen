import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import useApi, { type RequestState } from '../hooks/useApi';
import type { Account } from '../types/api';

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: Account | null;
  loginState: RequestState;
  logoutState: RequestState;
  login: (username: string, password: string, branch: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);
export default AuthContext;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<Account | null>(null);

  const loginRequest = useApi('post /auth/login');
  const logoutRequest = useApi('post /auth/logout');
  const refreshRequest = useApi('post /auth/refresh');
  const meRequest = useApi('get /accounts/me');

  const refreshToken = async (): Promise<boolean> => {
    const refreshResult = await refreshRequest.makeRequest();
    
    if (refreshResult.success) {
      // Fetch user info after successful refresh
      const meResult = await meRequest.makeRequest();
      if (meResult.success && meResult.data?.account) {
        setUser(meResult.data.account);
        setIsAuthenticated(true);
        return true;
      }
    }
    
    setUser(null);
    setIsAuthenticated(false);
    return false;
  };

  const login = async (username: string, password: string, branch: string): Promise<boolean> => {
    const result = await loginRequest.makeRequest({ username, password, branch });
    
    if (result.success && result.data?.user) {
      setUser(result.data.user);
      setIsAuthenticated(true);
      return true;
    }
    
    setUser(null);
    setIsAuthenticated(false);
    return false;
  };

  const logout = async (): Promise<boolean> => {
    const result = await logoutRequest.makeRequest();
    
    if (result.success) {
      setUser(null);
      setIsAuthenticated(false);
    }
    
    return result.success;
  };

  useEffect(() => {
    refreshToken().finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        loginState: loginRequest.requestState,
        logoutState: logoutRequest.requestState,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('useAuth must be used within AuthProvider');
  return context;
}
