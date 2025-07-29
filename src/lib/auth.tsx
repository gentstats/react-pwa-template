import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/types/convex';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // In a real app, you would validate the token with Convex
          // For now, we'll simulate this
          console.log('Checking authentication token:', token);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, _password: string) => {
    setLoading(true);
    try {
      // Mock login for demo purposes
      // In a real app, you would call your Convex auth functions
      const mockUser: User = {
        _id: 'user123' as any,
        name: 'Demo User',
        email: email,
        role: 'user',
        organizationId: 'org123' as any,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setUser(mockUser);
      localStorage.setItem('auth_token', 'mock_token_123');
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}