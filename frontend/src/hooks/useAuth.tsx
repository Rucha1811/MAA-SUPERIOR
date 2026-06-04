import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../lib/api';

interface User { id: string; name: string; email: string; phone?: string; role: string; }

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      authApi.me().then(r => setUser(r.data)).catch(() => localStorage.clear()).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const saveTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login({ email, password });
    saveTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
  };

  const adminLogin = async (email: string, password: string) => {
    const { data } = await authApi.adminLogin({ email, password });
    saveTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
  };

  const register = async (formData: any) => {
    const { data } = await authApi.register(formData);
    saveTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
  };

  const logout = async () => {
    const rt = localStorage.getItem('refreshToken');
    if (rt) await authApi.logout(rt).catch(() => {});
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, isAdmin: user?.role === 'admin', isLoading, login, adminLogin, register, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
