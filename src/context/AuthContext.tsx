import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi, setAuthToken, removeAuthToken, getAuthToken } from '../services/api';

interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  gender: string;
  role: 'user' | 'admin';
  profileId?: string;
  profile?: any;
}

interface AuthContextType {
  user: User | null;
  profile: any | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: any) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [token, setTokenState] = useState<string | null>(getAuthToken());
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const storedToken = getAuthToken();
    if (!storedToken) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetchApi('/auth/me');
      setUser(res.user);
      const myProf = await fetchApi('/profiles/me').catch(() => null);
      setProfile(res.profile || res.user?.profile || myProf || {
        profileId: res.user?.profileId || 'PB-10030',
        city: 'Pune',
        state: 'Maharashtra',
        completionPercentage: 75,
      });
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setAuthToken(res.token);
    setTokenState(res.token);
    setUser(res.user);
    
    const myProf = await fetchApi('/profiles/me').catch(() => null);
    setProfile(res.profile || res.user?.profile || myProf || {
      profileId: res.user?.profileId || 'PB-10030',
      city: 'Pune',
      state: 'Maharashtra',
      completionPercentage: 75,
    });

    return res.user;
  };

  const register = async (data: any): Promise<User> => {
    const res = await fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    setAuthToken(res.token);
    setTokenState(res.token);
    setUser(res.user);
    setProfile(res.profile || res.user?.profile || {
      profileId: res.user?.profileId || 'PB-10030',
      city: data.city || 'Pune',
      state: 'Maharashtra',
      completionPercentage: 70,
    });
    return res.user;
  };

  const logout = () => {
    removeAuthToken();
    setTokenState(null);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
