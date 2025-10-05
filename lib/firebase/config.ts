import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDe7QAOorRx7fxyaOrQZLaQ9yeDKNkpPow",
  authDomain: "job-tracker-app-a3f9d.firebaseapp.com",
  projectId: "job-tracker-app-a3f9d",
  storageBucket: "job-tracker-app-a3f9d.firebasestorage.app",
  messagingSenderId: "1005877143817",
  appId: "1:1005877143817:web:de2007537d3e4f46c98bd8",
  measurementId: "G-G6T3J37MT1"
};

// Initialize Firebase (avoid duplicate initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
