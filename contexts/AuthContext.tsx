'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { createUser, getUser, subscribeToUser } from '@/lib/firebase/firestore';
import { User } from '@/types';

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
    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, fetch full user data from Firestore
        const userData = await getUser(firebaseUser.uid);
        setCurrentUser(userData);
      } else {
        // User is signed out
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string) => {
    // Create Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Create user document in Firestore
    const username = email.split('@')[0];
    await createUser(firebaseUser.uid, {
      uid: firebaseUser.uid,
      email: firebaseUser.email || email,
      username,
      displayName: firebaseUser.displayName || username,
      photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      applicationCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Fetch and set the newly created user
    const userData = await getUser(firebaseUser.uid);
    setCurrentUser(userData);
  };

  const signIn = async (email: string, password: string) => {
    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Fetch user data from Firestore
    const userData = await getUser(userCredential.user.uid);
    setCurrentUser(userData);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const firebaseUser = userCredential.user;

    // Check if user document exists
    let userData = await getUser(firebaseUser.uid);

    if (!userData) {
      // Create user document if it doesn't exist
      const username = firebaseUser.email?.split('@')[0] || 'user';
      await createUser(firebaseUser.uid, {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        username,
        displayName: firebaseUser.displayName || username,
        photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        applicationCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      userData = await getUser(firebaseUser.uid);
    }

    setCurrentUser(userData);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
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
