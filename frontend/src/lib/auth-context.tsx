'use client';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface User { id: string; email: string; name: string; role: string; }

interface AuthState {
  user: User | null; token: string | null; loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('grainvault_token');
    if (!saved) { setLoading(false); return; }
    api.auth.me()
      .then((data) => { setUser(data as User); setToken(saved); })
      .catch(() => localStorage.removeItem('grainvault_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = (await api.auth.login(email, password)) as { accessToken: string; user: User };
    localStorage.setItem('grainvault_token', data.accessToken);
    localStorage.setItem('grainvault_user', JSON.stringify(data.user));
    setToken(data.accessToken);
    setUser(data.user);
  }, []);

  const register = useCallback(async (payload: { email: string; password: string; name: string }) => {
    const data = (await api.auth.register(payload)) as { accessToken: string; user: User };
    localStorage.setItem('grainvault_token', data.accessToken);
    localStorage.setItem('grainvault_user', JSON.stringify(data.user));
    setToken(data.accessToken);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('grainvault_token');
    localStorage.removeItem('grainvault_user');
    setToken(null);
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
