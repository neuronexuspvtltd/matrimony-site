import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
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

// 2. Fetch Profile from Firestore by User ID
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

// Delete Member Profile from Cloud Firestore
export const deleteProfileFromFirestore = async (userIdOrEmail: string | string[]) => {
  const targets = Array.isArray(userIdOrEmail) ? userIdOrEmail : [userIdOrEmail];
  try {
    const profsRef = collection(db, 'profiles');
    const snapshot = await getDocs(profsRef);
    const deletePromises: Promise<any>[] = [];

    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      const docId = docSnap.id;
      const uId = data.user?._id || data._id;
      const pId = data.profileId;
      const email = data.user?.email?.toLowerCase();

      const isMatch = targets.some((t) => {
        if (!t) return false;
        const targetLower = t.toLowerCase();
        return (
          docId === t ||
          uId === t ||
          pId === t ||
          (email && email === targetLower)
        );
      });

      if (isMatch) {
        deletePromises.push(deleteDoc(doc(db, 'profiles', docSnap.id)));
      }
    });

    await Promise.all(deletePromises);
    return { success: true };
  } catch (error: any) {
    console.warn('Firestore profile delete warning:', error.message);
    return { success: false, error: error.message };
  }
};

// 3. Fetch All Profiles from Cloud Firestore
export const fetchProfilesFromFirestore = async (): Promise<any[]> => {
  try {
    const profsRef = collection(db, 'profiles');
    const snapshot = await getDocs(profsRef);
    return snapshot.docs.map((docSnap) => ({
      _id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error: any) {
    console.warn('Firestore fetch profiles warning:', error.message);
    return [];
  }
};

// 4. Query Profile from Cloud Firestore by Email
export const findProfileByEmailFirestore = async (email: string): Promise<any | null> => {
  try {
    const profsRef = collection(db, 'profiles');
    const q = query(profsRef, where('user.email', '==', email.toLowerCase()));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      return { _id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error: any) {
    console.warn('Firestore profile query by email warning:', error.message);
    return null;
  }
};

// 5. Connection Request / Interest Sending in Firestore
export const sendInterestFirestore = async (senderId: string, receiverId: string) => {
  try {
    const interestRef = collection(db, 'connection_requests');
    const docRef = await addDoc(interestRef, {
      _id: `int_${Date.now()}`,
      senderId,
      receiverId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.warn('Firestore connection request warning:', error.message);
    return { success: false, error: error.message };
  }
};

// 6. Fetch Interests / Connection Requests from Cloud Firestore
export const fetchInterestsFirestore = async (userId: string): Promise<any[]> => {
  try {
    const interestRef = collection(db, 'connection_requests');
    const q1 = query(interestRef, where('senderId', '==', userId));
    const q2 = query(interestRef, where('receiverId', '==', userId));

    const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
    const list1 = snap1.docs.map((d) => ({ _id: d.id, ...d.data() }));
    const list2 = snap2.docs.map((d) => ({ _id: d.id, ...d.data() }));

    const mergedMap = new Map();
    [...list1, ...list2].forEach((item: any) => mergedMap.set(item._id || item.id, item));
    return Array.from(mergedMap.values());
  } catch (error: any) {
    console.warn('Firestore fetch interests warning:', error.message);
    return [];
  }
};

// 7. Respond to Interest / Connection Request in Cloud Firestore
export const respondInterestFirestore = async (docId: string, action: 'accept' | 'reject', senderId: string, receiverId: string) => {
  try {
    const newStatus = action === 'accept' ? 'accepted' : 'rejected';

    // 1. Try updating by direct docId reference
    if (docId) {
      try {
        const reqRef = doc(db, 'connection_requests', docId);
        await setDoc(reqRef, { status: newStatus }, { merge: true });
      } catch (e) {}
    }

    // 2. Query all matching connection requests between sender and receiver in both directions
    if (senderId && receiverId) {
      const colRef = collection(db, 'connection_requests');
      const q1 = query(colRef, where('senderId', '==', senderId), where('receiverId', '==', receiverId));
      const q2 = query(colRef, where('senderId', '==', receiverId), where('receiverId', '==', senderId));
      const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

      const updatePromises: Promise<any>[] = [];
      [...snap1.docs, ...snap2.docs].forEach((docSnap) => {
        updatePromises.push(setDoc(doc(db, 'connection_requests', docSnap.id), { status: newStatus }, { merge: true }));
      });
      await Promise.all(updatePromises);
    }

    // 3. If accepted, create conversation in Cloud Firestore
    if (action === 'accept' && senderId && receiverId) {
      const convId = `conv_${[senderId, receiverId].sort().join('_')}`;
      const convRef = doc(db, 'conversations', convId);
      await setDoc(convRef, {
        _id: convId,
        participants: [senderId, receiverId],
        lastMessage: 'Mutual connection established. Say Hi!',
        lastMessageAt: new Date().toISOString(),
      }, { merge: true });
    }

    return { success: true };
  } catch (error: any) {
    console.warn('Firestore respond interest warning:', error.message);
    return { success: false, error: error.message };
  }
};

// 8. Notifications Firestore Sync
export const sendNotificationFirestore = async (notifData: any) => {
  try {
    await addDoc(collection(db, 'notifications'), {
      ...notifData,
      createdAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error: any) {
    console.warn('Firestore notification send warning:', error.message);
    return { success: false };
  }
};

export const fetchNotificationsFirestore = async (userId: string): Promise<any[]> => {
  try {
    const q = query(collection(db, 'notifications'), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ _id: d.id, ...d.data() }));
  } catch (error: any) {
    console.warn('Firestore fetch notifications warning:', error.message);
    return [];
  }
};

export const markNotificationReadFirestore = async (notifId: string) => {
  try {
    const docRef = doc(db, 'notifications', notifId);
    await setDoc(docRef, { isRead: true }, { merge: true });
  } catch (e) {
    console.warn('Firestore mark notification read warning:', e);
  }
};

export const markAllNotificationsReadFirestore = async (userId: string) => {
  try {
    const q = query(collection(db, 'notifications'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const batchPromises = snap.docs.map((docSnap) =>
      setDoc(doc(db, 'notifications', docSnap.id), { isRead: true }, { merge: true })
    );
    await Promise.all(batchPromises);
  } catch (e) {
    console.warn('Firestore mark all notifications read warning:', e);
  }
};

export const clearAllNotificationsFirestore = async (userId: string) => {
  try {
    const q = query(collection(db, 'notifications'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const deletePromises = snap.docs.map((docSnap) => deleteDoc(doc(db, 'notifications', docSnap.id)));
    await Promise.all(deletePromises);
  } catch (e) {
    console.warn('Firestore clear all notifications warning:', e);
  }
};

// 9. Real-time Live Messages Listener with Firestore onSnapshot
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

// 10. Fetch Conversations from Cloud Firestore
export const fetchConversationsFirestore = async (userId: string): Promise<any[]> => {
  try {
    const q = query(collection(db, 'conversations'), where('participants', 'array-contains', userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ _id: d.id, ...d.data() }));
  } catch (error: any) {
    console.warn('Firestore fetch conversations warning:', error.message);
    return [];
  }
};

// 11. Fetch Messages from Cloud Firestore
export const fetchMessagesFirestore = async (conversationId: string): Promise<any[]> => {
  try {
    const q = query(collection(db, 'messages'), where('conversationId', '==', conversationId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return { _id: data._id || d.id, ...data };
    });
  } catch (error: any) {
    console.warn('Firestore fetch messages warning:', error.message);
    return [];
  }
};

// 12. Send Real-time Chat Message via Firestore
export const sendMessageFirestore = async (conversationId: string, senderId: string, content: string, msgId?: string) => {
  try {
    const docId = msgId || `msg_${Date.now()}`;
    const msgRef = doc(db, 'messages', docId);
    await setDoc(msgRef, {
      _id: docId,
      conversationId,
      senderId,
      content,
      createdAt: new Date().toISOString(),
    }, { merge: true });

    const convRef = doc(db, 'conversations', conversationId);
    await setDoc(convRef, {
      lastMessage: content,
      lastMessageAt: new Date().toISOString(),
    }, { merge: true });
    return { success: true };
  } catch (error: any) {
    console.warn('Firestore message send warning:', error.message);
    return { success: false, error: error.message };
  }
};
export const markMessagesReadFirestore = async (conversationId: string, partnerId: string) => {
  try {
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      where('senderId', '==', partnerId)
    );
    const snap = await getDocs(q);
    const promises: Promise<any>[] = [];
    snap.docs.forEach((docSnap) => {
      if (!docSnap.data().isRead) {
        promises.push(setDoc(doc(db, 'messages', docSnap.id), { isRead: true }, { merge: true }));
      }
    });
    await Promise.all(promises);
  } catch (e) {
    console.warn('Firestore mark read warning:', e);
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
