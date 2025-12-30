import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthSession } from '@/types';
import { getAuthService } from '@/services/ServiceFactory';

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  const authService = getAuthService();

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const existingSession = await authService.getCurrentSession();
        if (existingSession) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          setSession(existingSession);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { user: newUser, session: newSession } = await authService.signUp(email, password, displayName);
    setUser(newUser);
    setSession(newSession);
  };

  const signIn = async (email: string, password: string) => {
    const { user: existingUser, session: newSession } = await authService.signIn(email, password);
    setUser(existingUser);
    setSession(newSession);
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setSession(null);
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user && !!session,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};