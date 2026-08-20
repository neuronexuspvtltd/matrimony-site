import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

// --------------------------------------------------
// 🗄️ CLOUD FIRESTORE SERVICES
// --------------------------------------------------

// 1. Save or Update Member Profile in Firestore
export const saveProfileToFirestore = async (userId: string, profileData: any) => {
  try {
    const profRef = doc(db, 'profiles', userId);
    await setDoc(profRef, {
      ...profileData,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return { success: true };
  } catch (error: any) {
    console.warn('Firestore profile save warning (fallback active):', error.message);
    return { success: false, error: error.message };
  }
};

// 2. Fetch Profile from Firestore
export const getProfileFromFirestore = async (userId: string) => {
  try {
    const profRef = doc(db, 'profiles', userId);
    const snap = await getDoc(profRef);
    return snap.exists() ? snap.data() : null;
  } catch (error: any) {
    console.warn('Firestore get profile warning:', error.message);
    return null;
  }
};

// 3. Connection Request / Interest Sending in Firestore
export const sendInterestFirestore = async (senderId: string, receiverId: string) => {
  try {
    const interestRef = collection(db, 'connection_requests');
    const docRef = await addDoc(interestRef, {
      senderId,
      receiverId,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.warn('Firestore connection request warning:', error.message);
    return { success: false, error: error.message };
  }
};

// 4. Real-time Live Messages Listener with Firestore onSnapshot
export const subscribeToMessages = (
  conversationId: string,
  callback: (messages: any[]) => void
) => {
  try {
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const msgs = snapshot.docs.map((docSnap: QueryDocumentSnapshot<DocumentData>) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      callback(msgs);
    });
  } catch (error: any) {
    console.warn('Firestore onSnapshot subscription warning:', error.message);
    return () => {};
  }
};

// 5. Send Real-time Chat Message via Firestore
export const sendMessageFirestore = async (conversationId: string, senderId: string, content: string) => {
  try {
    await addDoc(collection(db, 'messages'), {
      conversationId,
      senderId,
      content,
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error: any) {
    console.warn('Firestore message send warning:', error.message);
    return { success: false, error: error.message };
  }
};

// --------------------------------------------------
// 📁 FIREBASE STORAGE SERVICES
// --------------------------------------------------

// 1. Upload User Photo to Firebase Storage
export const uploadUserPhotoToStorage = async (file: File, userId: string): Promise<string> => {
  try {
    const fileRef = ref(storage, `users/${userId}/photos/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(fileRef);
    return downloadUrl;
  } catch (error: any) {
    console.warn('Firebase storage photo upload warning:', error.message);
    return URL.createObjectURL(file);
  }
};

// 2. Upload PDF Biodata Document to Firebase Storage
export const uploadPdfBiodataToStorage = async (file: File, userId: string): Promise<string> => {
  try {
    const fileRef = ref(storage, `users/${userId}/biodata/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(fileRef);
    return downloadUrl;
  } catch (error: any) {
    console.warn('Firebase storage biodata upload warning:', error.message);
    return URL.createObjectURL(file);
  }
};
