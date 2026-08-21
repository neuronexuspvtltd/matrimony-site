import { initializeApp } from 'firebase/app';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDeTLFptLL9WXJ-4Fd0mgMGP1wBNpZdPJI",
  authDomain: "pavithra-bandhan.firebaseapp.com",
  projectId: "pavithra-bandhan",
  storageBucket: "pavithra-bandhan.firebasestorage.app",
  messagingSenderId: "274283657746",
  appId: "1:274283657746:web:8617922cba32352fe5f6cb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const dummyProfileIds = [
  'usr_suyash',
  'usr_priya',
  'usr_rohit',
  'usr_ananya',
  'usr_aditya',
  'usr_sneha'
];

async function removeDummyProfiles() {
  console.log("Removing dummy profiles from Cloud Firestore...");
  for (const id of dummyProfileIds) {
    try {
      await deleteDoc(doc(db, 'profiles', id));
      console.log(`Successfully deleted profile document: ${id}`);
    } catch (err) {
      console.error(`Failed to delete profile ${id}:`, err);
    }
  }
  console.log("Dummy profiles removal complete!");
  process.exit(0);
}

removeDummyProfiles();
