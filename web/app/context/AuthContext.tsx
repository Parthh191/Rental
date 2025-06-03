'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface User {
  id: number;
  email: string;
  name: string | null;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    // Check NextAuth session first
    if (session?.user) {
      const sessionUser = {
        id: parseInt(session.user.id || '0'),
        email: session.user.email || '',
        name: session.user.name || null,
        token: session.user.token || ''
      };
      setUser(sessionUser);
      // Also update localStorage for legacy support
      localStorage.setItem('user', JSON.stringify(sessionUser));
    } else {
      // Fall back to localStorage as before
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    setIsLoading(status === 'loading');
  }, [session, status]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Use NextAuth signIn method
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });
      
      if (result?.error) {
        throw new Error(result.error || 'Login failed');
      }
      
      // No need to manually set user - it will be updated via the session
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);

      // Updated to use port 3001
      const response = await fetch('http://localhost:3001/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Signup failed');
      }

      // Return the created user data
      return data.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    signOut({ redirect: false });
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}