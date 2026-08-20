import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// User's Live Firebase Production Credentials
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDeTLFptLL9WXJ-4Fd0mgMGP1wBNpZdPJI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pavithra-bandhan.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pavithra-bandhan",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pavithra-bandhan.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "274283657746",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:274283657746:web:8617922cba32352fe5f6cb"
};

// Initialize Firebase App instance
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export Cloud Firestore and Firebase Storage instances
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
