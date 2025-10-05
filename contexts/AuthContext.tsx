'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { getCurrentUser, setCurrentUser as saveCurrentUser, getAllUsers, initializeMockData } from '@/lib/mock/storage';
import { isValidEmail } from '@/lib/utils/validation';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize mock data on mount
    initializeMockData();

    // Check for existing user session
    const user = getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string) => {
    if (!isValidEmail(email)) {
      throw new Error('Invalid email address');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Check if user already exists
    const users = getAllUsers();
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create new user
    const username = email.split('@')[0];
    const newUser: User = {
      uid: Date.now().toString(),
      email,
      username,
      displayName: username,
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      applicationCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to users list
    users.push(newUser);
    localStorage.setItem('job_tracker_users', JSON.stringify(users));

    // Set as current user
    saveCurrentUser(newUser);
    setCurrentUser(newUser);
  };

  const signIn = async (email: string, password: string) => {
    if (!isValidEmail(email)) {
      throw new Error('Invalid email address');
    }

    // Find user
    const users = getAllUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      throw new Error('No user found with this email');
    }

    // In mock mode, we don't verify password
    saveCurrentUser(user);
    setCurrentUser(user);
  };

  const signInWithGoogle = async () => {
    // Simulate Google sign-in by using a pre-existing user
    const users = getAllUsers();
    const googleUser = users[0]; // Use first mock user

    saveCurrentUser(googleUser);
    setCurrentUser(googleUser);
  };

  const signOut = async () => {
    saveCurrentUser(null);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
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
