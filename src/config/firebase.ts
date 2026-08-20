import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration keys (Load from environment variables or fallback values)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy_PAVITHRA_BANDHAN_DEMO_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pavithra-bandhan-matrimony.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pavithra-bandhan-matrimony",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pavithra-bandhan-matrimony.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "987654321012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:987654321012:web:abcdef1234567890"
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export Cloud Firestore and Firebase Storage instances
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
