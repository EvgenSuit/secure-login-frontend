import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';


export interface User {
  id: string;
  email: string;
  is2FAEnabled: boolean;
}

interface LoginResponse {
  requires2FA: boolean;
  token?: string;
  user?: User;
  userId?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          const res = await api.getCurrentUser();
          setUser(res.user);
        } catch {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };
    init();
  }, [token]);

  const login = async (email: string, password: string) => {
    const resp = await api.login(email, password);
    if (!resp.requires2FA && resp.token) {
      localStorage.setItem('token', resp.token);
      setToken(resp.token);
      setUser(resp.user!);
    }
    return resp;
  };

  const register = async (email: string, password: string) => {
    await api.register(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
