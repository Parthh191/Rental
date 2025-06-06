'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

// Export the User interface
export interface User {
  id: number;
  email: string;
  name: string | null;
  token: string;
  createdAt?: Date;
  updatedAt?: Date;
  rentals?: Array<{
    id: number;
    startDate: Date;
    endDate: Date;
    status: string;
    item: {
      id: number;
      name: string; // Using name instead of title as per schema
      imageUrl: string | null; // Using imageUrl instead of image as per schema
    }
  }>;
  items?: Array<{
    id: number;
    name: string; // Using name instead of title as per schema
    pricePerDay: number; // Using pricePerDay instead of price as per schema
    imageUrl: string | null; // Using imageUrl instead of image as per schema
    available: boolean;
    category: {
      name: string;
    };
    location: string | null;
  }>;
  reviews?: Array<{
    id: number;
    rating: number;
    comment: string | null;
    item: {
      name: string; // Using name instead of title as per schema
    }
  }>;
  stats?: {
    itemsListed: number;
    totalRentals: number;
    totalReviews: number;
    averageRating: string;
  }
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<User>;
  logout: () => void;
  isLoading: boolean;
  fetchUserProfile: () => Promise<User | null>;
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

  const fetchUserProfile = async (): Promise<User | null> => {
    try {
      if (!user?.token) return null;
      
      const response = await fetch('http://localhost:3001/api/users/get', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      
      // Update the user state with the fresh data
      const updatedUser = {
        ...user,
        ...data.data,
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

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

  const signup = async (email: string, password: string, name: string): Promise<User> => {
    try {
      setIsLoading(true);

      const response = await fetch('http://localhost:3001/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to create account');
      }

      if (!data.data || !data.data.token) {
        throw new Error('No token received from server');
      }

      // After successful signup, sign in automatically using NextAuth
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return data.data;
    } catch (error: any) {
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
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, fetchUserProfile }}>
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