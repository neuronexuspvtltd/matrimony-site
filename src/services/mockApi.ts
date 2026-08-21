import { initialProfiles, initialSuccessStories, ProfileData } from './mockData';
import {
  saveProfileToFirestore,
  uploadPdfBiodataToStorage,
  fetchProfilesFromFirestore,
  findProfileByEmailFirestore,
  sendInterestFirestore,
  fetchInterestsFirestore,
  respondInterestFirestore,
  sendNotificationFirestore,
  fetchNotificationsFirestore,
  fetchConversationsFirestore,
  fetchMessagesFirestore,
  sendMessageFirestore,
} from './firebaseService';

const PROFILES_KEY = 'pb_profiles_data';
const VIEWS_KEY = 'pb_views_data';
const INTERESTS_KEY = 'pb_interests_data';
const SHORTLISTS_KEY = 'pb_shortlists_data';
const NOTIFICATIONS_KEY = 'pb_notifications_data';
const CONVERSATIONS_KEY = 'pb_conversations_data';
const MESSAGES_KEY = 'pb_messages_data';
const REPORTS_KEY = 'pb_reports_data';
const SUCCESS_STORIES_KEY = 'pb_success_stories_data';
const SITE_CONTENT_KEY = 'pb_site_content_data';

const defaultSiteContent = {
  heroHeadlineEn: 'Choose Your Forever',
  heroHeadlineMr: 'तुमच्या आयुष्याचा साथीदार शोधा',
  heroSubtitleEn: 'Find love on your terms with thousands of verified profiles',
  heroSubtitleMr: 'तुमच्या आवडीनुसार आणि विश्वासाने शोधा सुयोग्य स्थळे',
  supportPhone: '+91 98765 43210',
  supportPhoneAlt: '+91 98765 43211',
  supportEmail: 'support@vbrothersmarry.com',
  helpEmail: 'help@vbrothersmarry.com',
  puneOffice: 'FC Road, Shivajinagar, Pune',
  mumbaiOffice: 'Nariman Point, Mumbai',
};

// Helper to load or initialize LocalStorage
const getItem = (key: string, defaultVal: any) => {
  const val = localStorage.getItem(key);
  if (!val) {
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  }
  try {
    return JSON.parse(val);
  } catch (e) {
    return defaultVal;
  }
};

const setItem = (key: string, val: any) => {
  localStorage.setItem(key, JSON.stringify(val));
};

// Calculate profile completion percentage
const calculateCompletion = (p: any): number => {
  let score = 30;
  if (p.primaryPhoto) score += 20;
  if (p.biodataUrl) score += 20;
  if (p.aboutMe && p.aboutMe.length > 20) score += 10;
  if (p.partnerPreferences && p.partnerPreferences.minAge) score += 20;
  return Math.min(100, score);
};

export const mockApiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : null;

  // Initialize initial mock data from local storage
  let rawProfiles: ProfileData[] = getItem(PROFILES_KEY, initialProfiles);

  // Sync fresh accounts from Cloud Firestore so logins & search work across all laptops, phones & devices!
  try {
    const firestoreProfiles = await fetchProfilesFromFirestore();
    if (firestoreProfiles && firestoreProfiles.length > 0) {
      firestoreProfiles.forEach((fProf: any) => {
        if (!fProf.user?.email) return;
        const idx = rawProfiles.findIndex(
          (p: any) => p.user?.email?.toLowerCase() === fProf.user.email.toLowerCase() || p.user?._id === fProf.user?._id
        );
        if (idx !== -1) {
          rawProfiles[idx] = { ...rawProfiles[idx], ...fProf };
        } else {
          rawProfiles.unshift(fProf);
        }
      });
      setItem(PROFILES_KEY, rawProfiles);
    }
  } catch (e) {
    // Fallback gracefully to local storage
  }

  // Ensure every profile in storage has valid isVerified, isFeatured, and status
  const profiles: ProfileData[] = rawProfiles.map((p: any) => ({
    ...p,
    isVerified: p.isVerified ?? p.user?.isVerified ?? true,
    isFeatured: p.isFeatured ?? true,
    user: {
      ...p.user,
      isVerified: p.user?.isVerified ?? p.isVerified ?? true,
      status: p.user?.status || 'active',
    },
  }));

  const successStories: any[] = getItem(SUCCESS_STORIES_KEY, initialSuccessStories || []);

  const storedUser = localStorage.getItem('pb_current_user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // --- 1. AUTH ENDPOINTS ---
  if (endpoint === '/auth/login' && method === 'POST') {
    const { email, password } = body;

    if (!email || !email.trim()) {
      throw new Error('Please enter your email address.');
    }
    if (!password || !password.trim()) {
      throw new Error('Please enter your password.');
    }

    const cleanEmail = email.trim().toLowerCase();

    // Admin Account Authentication
    if (cleanEmail === 'admin@matrimony.com') {
      if (password !== 'Admin@123') {
        throw new Error('Invalid email or password');
      }
      const adminUser = {
        id: 'usr_admin',
        fullName: 'System Administrator',
        email: 'admin@matrimony.com',
        role: 'admin',
        status: 'active',
        profileId: 'ADMIN-001',
      };
      const tokenStr = `mock_jwt_token_admin_${Date.now()}`;
      localStorage.setItem('matrimony_token', tokenStr);
      localStorage.setItem('pb_current_user', JSON.stringify(adminUser));
      return { token: tokenStr, user: adminUser };
    }

    // Member Profile Search (Local Storage & Cloud Firestore)
    let prof = profiles.find((p: ProfileData) => p.user.email.toLowerCase() === cleanEmail);

    if (!prof) {
      const firestoreProf = await findProfileByEmailFirestore(cleanEmail).catch(() => null);
      if (firestoreProf) {
        prof = firestoreProf;
        profiles.unshift(firestoreProf);
        setItem(PROFILES_KEY, profiles);
      }
    }

    if (!prof) {
      throw new Error('Invalid email or password');
    }

    if (prof.user.status === 'suspended') {
      throw new Error('Account suspended. Please contact support.');
    }

    // Strict Password Validation
    const expectedPassword = prof.user.password || 'Password@123';
    if (password !== expectedPassword) {
      throw new Error('Invalid email or password');
    }

    const userData = {
      id: prof.user._id,
      fullName: prof.user.fullName,
      email: prof.user.email,
      role: prof.user.role || 'user',
      status: prof.user.status,
      profileId: prof.profileId,
    };

    const tokenStr = `mock_jwt_token_${prof.user._id}_${Date.now()}`;
    localStorage.setItem('matrimony_token', tokenStr);
    localStorage.setItem('pb_current_user', JSON.stringify(userData));

    return { token: tokenStr, user: userData };
  }

  if (endpoint === '/auth/register' && method === 'POST') {
    const { fullName, email, password, mobile, gender, dateOfBirth, city, religion, caste, education, occupation, maritalStatus } = body;

    const cleanEmail = (email || '').trim().toLowerCase();

    // Check both local profiles & Cloud Firestore for existing account
    let existing = profiles.find((p: ProfileData) => p.user.email.toLowerCase() === cleanEmail);
    if (!existing) {
      existing = await findProfileByEmailFirestore(cleanEmail).catch(() => null);
    }

    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUserId = `usr_${Date.now()}`;
    const newProfId = `PB-${Math.floor(10000 + Math.random() * 90000)}`;

    const age = dateOfBirth ? Math.floor((Date.now() - new Date(dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 26;

    const newProfile: ProfileData = {
      _id: `prof_${Date.now()}`,
      profileId: newProfId,
      user: {
        _id: newUserId,
        fullName,
        email: cleanEmail,
        password: password || 'Password@123',
        mobile: mobile || '9876543210',
        role: 'user',
        status: 'active',
        isVerified: true,
      },
      gender: gender || 'male',
      age,
      height: "5'8\"",
      maritalStatus: maritalStatus || 'Never Married',
      religion: religion || 'Hindu',
      caste: caste || 'Maratha',
      motherTongue: 'Marathi',
      city: city || 'Pune',
      state: 'Maharashtra',
      country: 'India',
      education: education || 'B.Tech',
      occupation: occupation || 'Software Engineer',
      income: '₹12 - ₹15 Lakhs p.a.',
      aboutMe: `Namaste! I am ${fullName}, working in ${city}. Looking for a cultured and understanding life partner.`,
      primaryPhoto: gender === 'female' 
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      photos: [],
      biodataUrl: '',
      biodataFileName: '',
      biodataVisibility: 'Connections Only',
      isVerified: true,
      isFeatured: true,
      completionPercentage: 70,
      partnerPreferences: {
        minAge: Math.max(18, age - 5),
        maxAge: age + 5,
        maritalStatus: 'Never Married',
        religion: religion || 'Hindu',
        caste: caste || 'Any',
        education: 'Graduate / Post Graduate',
        location: 'Any',
      },
      createdAt: new Date().toISOString(),
    };

    profiles.unshift(newProfile);
    setItem(PROFILES_KEY, profiles);

    // Save to Cloud Firestore
    saveProfileToFirestore(newUserId, newProfile).catch((err) =>
      console.warn('Firestore profile sync error:', err)
    );

    const userData = {
      id: newUserId,
      fullName,
      email: cleanEmail,
      role: 'user',
      status: 'active',
      profileId: newProfId,
    };

    const tokenStr = `mock_jwt_token_${newUserId}_${Date.now()}`;
    localStorage.setItem('matrimony_token', tokenStr);
    localStorage.setItem('pb_current_user', JSON.stringify(userData));

    return { token: tokenStr, user: userData, profile: newProfile };
  }

  if (endpoint === '/auth/me' && method === 'GET') {
    if (!currentUser) throw new Error('Not authenticated');
    return { user: currentUser };
  }

  // --- SITE CONTENT ENDPOINTS FOR ADMIN CMS ---
  if (endpoint === '/admin/site-content' && method === 'GET') {
    return getItem(SITE_CONTENT_KEY, defaultSiteContent);
  }

  if (endpoint === '/admin/site-content' && method === 'PUT') {
    const current = getItem(SITE_CONTENT_KEY, defaultSiteContent);
    const updated = { ...current, ...body };
    setItem(SITE_CONTENT_KEY, updated);
    return { message: 'Site content saved and published successfully', content: updated };
  }

  // --- 2. SEARCH & PROFILES ENDPOINTS ---
  if (endpoint === '/search/featured') {
    return profiles.filter((p: ProfileData) => p.isFeatured).slice(0, 6);
  }

  if (endpoint.startsWith('/search') || endpoint === '/profiles') {
    const params = new URLSearchParams(endpoint.split('?')[1] || '');
    const gender = params.get('gender');
    const minAge = parseInt(params.get('minAge') || '18', 10);
    const maxAge = parseInt(params.get('maxAge') || '70', 10);
    const city = params.get('city');
    const caste = params.get('caste');
    const religion = params.get('religion');
    const maritalStatus = params.get('maritalStatus');
    const search = params.get('search');

    const filtered = profiles.filter((p: ProfileData) => {
      if (gender && p.gender !== gender) return false;
      if (p.age < minAge || p.age > maxAge) return false;
      if (city && city !== 'All' && !p.city.toLowerCase().includes(city.toLowerCase())) return false;
      if (caste && caste !== 'All' && p.caste.toLowerCase() !== caste.toLowerCase()) return false;
      if (religion && religion !== 'All' && p.religion.toLowerCase() !== religion.toLowerCase()) return false;
      if (maritalStatus && maritalStatus !== 'All' && p.maritalStatus.toLowerCase() !== maritalStatus.toLowerCase()) return false;
      if (search && !p.user.fullName.toLowerCase().includes(search.toLowerCase()) && !p.profileId.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

    const shortlists = getItem(SHORTLISTS_KEY, []);
    const interests = getItem(INTERESTS_KEY, []);
    const myShortlistIds = currentUser ? shortlists.filter((s: any) => s.userId === currentUser.id).map((s: any) => s.targetUserId) : [];
    const mySentInterestIds = currentUser ? interests.filter((i: any) => i.senderId === currentUser.id).map((i: any) => i.receiverId) : [];

    const formattedResults = filtered.map((p: ProfileData) => ({
      ...p,
      isShortlisted: myShortlistIds.includes(p.user._id),
      interestSent: mySentInterestIds.includes(p.user._id),
      hasBiodata: !!p.biodataUrl,
    }));

    return { total: formattedResults.length, profiles: formattedResults };
  }

  // --- 3. PROFILE VIEW & TRACKING ENDPOINTS ---
  if (endpoint.startsWith('/profiles/')) {
    const targetId = endpoint.replace('/profiles/', '');

    if (targetId === 'me' && method === 'GET') {
      const p = profiles.find((prof: ProfileData) => prof.user._id === currentUser?.id);
      return p || {};
    }

    if (targetId === 'me' && method === 'PUT') {
      const pIndex = profiles.findIndex((prof: ProfileData) => prof.user._id === currentUser?.id);
      if (pIndex !== -1) {
        profiles[pIndex] = { ...profiles[pIndex], ...body };
        profiles[pIndex].completionPercentage = calculateCompletion(profiles[pIndex]);
        setItem(PROFILES_KEY, profiles);

        saveProfileToFirestore(profiles[pIndex].user._id, profiles[pIndex]).catch((err) =>
          console.warn('Firestore profile sync error:', err)
        );

        return { message: 'Profile updated', profile: profiles[pIndex] };
      }
    }

    if (targetId === 'upload-biodata' && method === 'POST') {
      const pIndex = profiles.findIndex((prof: ProfileData) => prof.user._id === currentUser?.id);
      if (pIndex !== -1 && body instanceof FormData) {
        const file = body.get('biodata') as File;
        if (file) {
          let downloadUrl = '';
          try {
            downloadUrl = await uploadPdfBiodataToStorage(file, currentUser?.id || profiles[pIndex].user._id);
          } catch (storageErr) {
            console.warn('Firebase storage upload fallback:', storageErr);
            downloadUrl = URL.createObjectURL(file);
          }

          profiles[pIndex].biodataUrl = downloadUrl;
          profiles[pIndex].biodataFileName = file.name;
          profiles[pIndex].completionPercentage = calculateCompletion(profiles[pIndex]);
          setItem(PROFILES_KEY, profiles);

          saveProfileToFirestore(profiles[pIndex].user._id, profiles[pIndex]).catch((err) =>
            console.warn('Firestore profile sync error:', err)
          );

          return { message: 'Biodata uploaded to Firebase Storage', biodataUrl: downloadUrl, profile: profiles[pIndex] };
        }
      }
    }

    if (targetId === 'delete-biodata' && method === 'POST') {
      const pIndex = profiles.findIndex((prof: ProfileData) => prof.user._id === currentUser?.id);
      if (pIndex !== -1) {
        profiles[pIndex].biodataUrl = '';
        profiles[pIndex].biodataFileName = '';
        setItem(PROFILES_KEY, profiles);

        saveProfileToFirestore(profiles[pIndex].user._id, profiles[pIndex]).catch((err) =>
          console.warn('Firestore profile sync error:', err)
        );

        return { message: 'Biodata deleted', profile: profiles[pIndex] };
      }
    }

    let targetProf = profiles.find((p: ProfileData) => p.profileId === targetId || p._id === targetId || p.user._id === targetId);
    if (!targetProf) throw new Error('Profile not found');

    // Admin Access Bypass: Admin gets full access to photos & biodatas
    if (currentUser?.role === 'admin') {
      return {
        ...targetProf,
        isAdminAccess: true,
      };
    }

    if (currentUser && currentUser.id !== targetProf.user._id) {
      const views = getItem(VIEWS_KEY, []);
      const cooldownHours = 24;
      const cooldownTime = new Date(Date.now() - cooldownHours * 60 * 60 * 1000);

      const recent = views.find(
        (v: any) =>
          v.viewerId === currentUser.id &&
          v.profileOwnerId === targetProf.user._id &&
          new Date(v.viewedAt) >= cooldownTime
      );

      if (!recent) {
        views.unshift({
          _id: `view_${Date.now()}`,
          viewerId: currentUser.id,
          profileOwnerId: targetProf.user._id,
          viewedAt: new Date().toISOString(),
        });
        setItem(VIEWS_KEY, views);

        const notifications = getItem(NOTIFICATIONS_KEY, []);
        const notifObj = {
          _id: `notif_${Date.now()}`,
          userId: targetProf.user._id,
          type: 'PROFILE_VIEW',
          titleEn: '🔔 New Profile View',
          titleMr: '🔔 नवीन प्रोफाइल व्ह्यू',
          messageEn: `${currentUser.fullName} viewed your profile.`,
          messageMr: `${currentUser.fullName} यांनी तुमचे प्रोफाइल पाहिले.`,
          senderId: currentUser.id,
          targetProfileId: currentUser.profileId || 'PB-10024',
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        notifications.unshift(notifObj);
        setItem(NOTIFICATIONS_KEY, notifications);

        // Sync real-time notification to Cloud Firestore
        sendNotificationFirestore(notifObj).catch(() => {});
      }
    }

    return targetProf;
  }

  // --- 4. PROFILE VIEWS LOG ENDPOINT ---
  if (endpoint === '/profile-views/recent') {
    const views = getItem(VIEWS_KEY, []);
    const myViews = views.filter((v: any) => v.profileOwnerId === currentUser?.id);

    const formattedViews = myViews.map((v: any) => {
      const viewerProf = profiles.find((p: ProfileData) => p.user._id === v.viewerId);
      return {
        _id: v._id,
        viewedAt: v.viewedAt,
        viewer: viewerProf ? {
          fullName: viewerProf.user.fullName,
          profileId: viewerProf.profileId,
          city: viewerProf.city,
          occupation: viewerProf.occupation,
          primaryPhoto: viewerProf.primaryPhoto,
        } : { fullName: 'Member' },
      };
    });

    return { count: formattedViews.length, views: formattedViews };
  }

  // --- 5. REAL-TIME INTERESTS / CONNECTION REQUESTS ENDPOINTS ---
  if (endpoint === '/interests/send' && method === 'POST') {
    const { receiverId } = body;
    const interests = getItem(INTERESTS_KEY, []);

    if (interests.some((i: any) => i.senderId === currentUser.id && i.receiverId === receiverId)) {
      throw new Error('Interest already sent to this profile');
    }

    const newInterest = {
      _id: `int_${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    interests.unshift(newInterest);
    setItem(INTERESTS_KEY, interests);

    // Push connection request to Cloud Firestore real-time collection!
    sendInterestFirestore(currentUser.id, receiverId).catch((err) =>
      console.warn('Firestore interest send error:', err)
    );

    const notifications = getItem(NOTIFICATIONS_KEY, []);
    const notifObj = {
      _id: `notif_${Date.now()}`,
      userId: receiverId,
      type: 'INTEREST_RECEIVED',
      titleEn: '💖 New Interest Received',
      titleMr: '💖 नवीन आवड (Interest) प्राप्त झाली',
      messageEn: `${currentUser.fullName} expressed interest in your profile.`,
      messageMr: `${currentUser.fullName} यांनी तुमच्या प्रोफाईलमध्ये रस दाखवला आहे.`,
      senderId: currentUser.id,
      targetProfileId: currentUser.profileId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    notifications.unshift(notifObj);
    setItem(NOTIFICATIONS_KEY, notifications);

    // Sync notification to Cloud Firestore
    sendNotificationFirestore(notifObj).catch(() => {});

    return { message: 'Interest sent successfully', interest: newInterest };
  }

  if (endpoint === '/interests/respond' && method === 'POST') {
    const { interestId, action } = body;
    let interests = getItem(INTERESTS_KEY, []);

    let targetItem = interests.find((i: any) => i._id === interestId || i.id === interestId);

    // Query Cloud Firestore interests if not found in local storage
    if (!targetItem && currentUser?.id) {
      try {
        const fsInterests = await fetchInterestsFirestore(currentUser.id);
        targetItem = fsInterests.find((i: any) => i._id === interestId || i.id === interestId);
      } catch (e) {}
    }

    const newStatus = action === 'accept' ? 'accepted' : 'rejected';
    const senderId = targetItem?.senderId || '';
    const receiverId = targetItem?.receiverId || currentUser?.id || '';

    // Update local storage
    const idx = interests.findIndex((i: any) => i._id === interestId || i.id === interestId);
    if (idx !== -1) {
      interests[idx].status = newStatus;
    } else if (targetItem) {
      targetItem.status = newStatus;
      interests.unshift(targetItem);
    }
    setItem(INTERESTS_KEY, interests);

    // Update Cloud Firestore in real time!
    respondInterestFirestore(interestId, action, senderId, receiverId).catch((err) =>
      console.warn('Firestore respond interest error:', err)
    );

    if (action === 'accept' && senderId && currentUser?.id) {
      const convId = `conv_${[senderId, currentUser.id].sort().join('_')}`;
      const conversations = getItem(CONVERSATIONS_KEY, []);
      let conv = conversations.find((c: any) =>
        c.participants && c.participants.includes(senderId) && c.participants.includes(currentUser.id)
      );
      if (!conv) {
        conv = {
          _id: convId,
          participants: [senderId, currentUser.id],
          lastMessage: 'Mutual connection established. Say Hi!',
          lastMessageAt: new Date().toISOString(),
        };
        conversations.unshift(conv);
        setItem(CONVERSATIONS_KEY, conversations);
      }

      const notifications = getItem(NOTIFICATIONS_KEY, []);
      const notifObj = {
        _id: `notif_${Date.now()}`,
        userId: senderId,
        type: 'INTEREST_ACCEPTED',
        titleEn: '🎉 Interest Accepted!',
        titleMr: '🎉 आवड (Interest) स्विकारली!',
        messageEn: `${currentUser.fullName} accepted your interest request!`,
        messageMr: `${currentUser.fullName} यांनी तुमची आवड स्वीकारली!`,
        senderId: currentUser.id,
        targetProfileId: currentUser.profileId,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      notifications.unshift(notifObj);
      setItem(NOTIFICATIONS_KEY, notifications);
      sendNotificationFirestore(notifObj).catch(() => {});
    }

    return { message: `Interest ${action}ed`, interest: targetItem };
  }

  if (endpoint === '/interests/my-interests') {
    let interests = getItem(INTERESTS_KEY, []);

    // Merge Cloud Firestore interests so requests sent from ANY device show up!
    if (currentUser?.id) {
      try {
        const firestoreInterests = await fetchInterestsFirestore(currentUser.id);
        if (firestoreInterests && firestoreInterests.length > 0) {
          const map = new Map();
          [...interests, ...firestoreInterests].forEach((item: any) => {
            const key = item._id || item.id || `${item.senderId}_${item.receiverId}`;
            map.set(key, item);
          });
          interests = Array.from(map.values());
          setItem(INTERESTS_KEY, interests);
        }
      } catch (e) {}
    }

    const received = interests.filter((i: any) => i.receiverId === currentUser?.id);
    const sent = interests.filter((i: any) => i.senderId === currentUser?.id);

    const formatList = (list: any[], userKey: string) =>
      list.map((item) => {
        const p = profiles.find((prof: ProfileData) => prof.user._id === item[userKey] || prof._id === item[userKey]);
        return {
          _id: item._id || item.id,
          status: item.status,
          createdAt: item.createdAt,
          user: p ? {
            _id: p.user._id,
            fullName: p.user.fullName,
            gender: p.gender,
            profileId: p.profileId,
            age: p.age,
            city: p.city,
            occupation: p.occupation,
            primaryPhoto: p.primaryPhoto,
          } : { fullName: 'Member' },
        };
      });

    return {
      received: formatList(received, 'senderId'),
      sent: formatList(sent, 'receiverId'),
    };
  }

  // --- 6. SHORTLIST ENDPOINTS ---
  if (endpoint === '/shortlists/toggle' && method === 'POST') {
    const { targetUserId } = body;
    const shortlists = getItem(SHORTLISTS_KEY, []);
    const idx = shortlists.findIndex((s: any) => s.userId === currentUser.id && s.targetUserId === targetUserId);

    if (idx !== -1) {
      shortlists.splice(idx, 1);
      setItem(SHORTLISTS_KEY, shortlists);
      return { message: 'Removed from shortlist', shortlisted: false };
    } else {
      shortlists.unshift({ _id: `short_${Date.now()}`, userId: currentUser.id, targetUserId, createdAt: new Date().toISOString() });
      setItem(SHORTLISTS_KEY, shortlists);
      return { message: 'Added to shortlist', shortlisted: true };
    }
  }

  if (endpoint === '/shortlists/my-shortlist') {
    const shortlists = getItem(SHORTLISTS_KEY, []);
    const myShort = shortlists.filter((s: any) => s.userId === currentUser?.id);

    return myShort.map((item: any) => {
      const p = profiles.find((prof: ProfileData) => prof.user._id === item.targetUserId);
      return { _id: item._id, profile: p };
    });
  }

  // --- 7. NOTIFICATIONS ENDPOINTS (Cloud Firestore Synced) ---
  if (endpoint === '/notifications') {
    let notifications = getItem(NOTIFICATIONS_KEY, []);

    if (currentUser?.id) {
      try {
        const firestoreNotifs = await fetchNotificationsFirestore(currentUser.id);
        if (firestoreNotifs && firestoreNotifs.length > 0) {
          const nMap = new Map();
          [...notifications, ...firestoreNotifs].forEach((n: any) => nMap.set(n._id || n.id, n));
          notifications = Array.from(nMap.values());
          setItem(NOTIFICATIONS_KEY, notifications);
        }
      } catch (e) {}
    }

    const myNotifs = notifications.filter((n: any) => n.userId === currentUser?.id);
    const unread = myNotifs.filter((n: any) => !n.isRead).length;
    return { notifications: myNotifs, unreadCount: unread };
  }

  if (endpoint.startsWith('/notifications/') && endpoint.endsWith('/read')) {
    const id = endpoint.split('/')[2];
    const notifications = getItem(NOTIFICATIONS_KEY, []);
    const idx = notifications.findIndex((n: any) => n._id === id);
    if (idx !== -1) {
      notifications[idx].isRead = true;
      setItem(NOTIFICATIONS_KEY, notifications);
    }
    return { message: 'Marked read' };
  }

  if (endpoint === '/notifications/read-all') {
    const notifications = getItem(NOTIFICATIONS_KEY, []);
    notifications.forEach((n: any) => {
      if (n.userId === currentUser?.id) n.isRead = true;
    });
    setItem(NOTIFICATIONS_KEY, notifications);
    return { message: 'All read' };
  }

  if (endpoint === '/notifications/clear-all') {
    const notifications = getItem(NOTIFICATIONS_KEY, []);
    const remainingNotifs = notifications.filter((n: any) => n.userId !== currentUser?.id);
    setItem(NOTIFICATIONS_KEY, remainingNotifs);
    return { message: 'All notifications cleared' };
  }

  // --- 8. MESSAGING ENDPOINTS (Cloud Firestore Synced) ---
  if (endpoint === '/messages/conversations') {
    let conversations = getItem(CONVERSATIONS_KEY, []);

    if (currentUser?.id) {
      try {
        const fsConvs = await fetchConversationsFirestore(currentUser.id);
        if (fsConvs && fsConvs.length > 0) {
          const cMap = new Map();
          [...conversations, ...fsConvs].forEach((c: any) => cMap.set(c._id || c.id, c));
          conversations = Array.from(cMap.values());
          setItem(CONVERSATIONS_KEY, conversations);
        }
      } catch (e) {}
    }

    const myConvs = conversations.filter((c: any) => c.participants && c.participants.includes(currentUser?.id));

    return myConvs.map((conv: any) => {
      const partnerId = conv.participants.find((p: string) => p !== currentUser?.id);
      const partnerProf = profiles.find((p: ProfileData) => p.user._id === partnerId || p._id === partnerId);
      return {
        _id: conv._id || conv.id,
        lastMessage: conv.lastMessage,
        lastMessageAt: conv.lastMessageAt,
        partner: partnerProf ? {
          id: partnerProf.user._id,
          fullName: partnerProf.user.fullName,
          profileId: partnerProf.profileId,
          primaryPhoto: partnerProf.primaryPhoto,
        } : null,
      };
    });
  }

  if (endpoint.startsWith('/messages/conversations/')) {
    const convId = endpoint.replace('/messages/conversations/', '');
    let messages = getItem(MESSAGES_KEY, []);

    try {
      const fsMsgs = await fetchMessagesFirestore(convId);
      if (fsMsgs && fsMsgs.length > 0) {
        const mMap = new Map();
        [...messages, ...fsMsgs].forEach((m: any) => mMap.set(m._id || m.id, m));
        messages = Array.from(mMap.values());
        setItem(MESSAGES_KEY, messages);
      }
    } catch (e) {}

    return messages.filter((m: any) => m.conversationId === convId);
  }

  if (endpoint === '/messages/send' && method === 'POST') {
    const { conversationId, content } = body;
    const messages = getItem(MESSAGES_KEY, []);
    const newMsg = {
      _id: `msg_${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      content,
      createdAt: new Date().toISOString(),
    };
    messages.push(newMsg);
    setItem(MESSAGES_KEY, messages);

    const conversations = getItem(CONVERSATIONS_KEY, []);
    const cIdx = conversations.findIndex((c: any) => c._id === conversationId || c.id === conversationId);
    if (cIdx !== -1) {
      conversations[cIdx].lastMessage = content;
      conversations[cIdx].lastMessageAt = new Date().toISOString();
      setItem(CONVERSATIONS_KEY, conversations);
    }

    // Push real-time message to Cloud Firestore database!
    sendMessageFirestore(conversationId, currentUser.id, content).catch((err) =>
      console.warn('Firestore message send error:', err)
    );

    return newMsg;
  }

  // --- 9. FULL ADMIN CMS & CONTENT MANAGEMENT ENDPOINTS ---
  if (endpoint === '/admin/stats') {
    const views = getItem(VIEWS_KEY, []);
    const interests = getItem(INTERESTS_KEY, []);
    const reports = getItem(REPORTS_KEY, []);

    return {
      totalUsers: profiles.length,
      activeUsers: profiles.filter((p: ProfileData) => p.user.status === 'active').length,
      verifiedUsers: profiles.filter((p: ProfileData) => p.isVerified).length,
      totalViews: views.length,
      totalInterests: interests.length,
      totalConnections: interests.filter((i: any) => i.status === 'accepted').length,
      pendingReports: reports.filter((r: any) => r.status === 'pending').length,
      totalStories: successStories.length,
    };
  }

  // Helpers for Admin User route matching
  const findUserIndex = (id: string) =>
    profiles.findIndex((p: ProfileData) => p.user._id === id || p._id === id || p.profileId === id);

  const getAdminUserIdFromUrl = (url: string) => {
    const parts = url.split('?')[0].split('/');
    const uIdx = parts.indexOf('users');
    if (uIdx !== -1 && uIdx + 1 < parts.length) {
      return parts[uIdx + 1];
    }
    return '';
  };

  if (endpoint.startsWith('/admin/users') && !endpoint.includes('/verify') && !endpoint.includes('/featured') && !endpoint.includes('/edit') && !endpoint.includes('/status') && method === 'GET') {
    const searchQ = new URLSearchParams(endpoint.split('?')[1] || '').get('search')?.toLowerCase();
    let filtered = profiles;
    if (searchQ) {
      filtered = profiles.filter((p: ProfileData) => p.user.fullName.toLowerCase().includes(searchQ) || p.user.email.toLowerCase().includes(searchQ));
    }
    return {
      users: filtered.map((p: ProfileData) => ({
        _id: p.user._id,
        fullName: p.user.fullName,
        email: p.user.email,
        mobile: p.user.mobile,
        profileId: p.profileId,
        city: p.city,
        caste: p.caste,
        occupation: p.occupation,
        education: p.education,
        isVerified: p.isVerified,
        isFeatured: p.isFeatured,
        biodataUrl: p.biodataUrl,
        biodataPrivacy: p.biodataVisibility || 'Connections Only',
        status: p.user.status,
      })),
    };
  }

  if (endpoint.includes('/admin/users/') && endpoint.endsWith('/verify') && (method === 'PUT' || method === 'POST')) {
    const targetUserId = getAdminUserIdFromUrl(endpoint);
    const pIdx = findUserIndex(targetUserId);
    if (pIdx !== -1) {
      const newStatus = !profiles[pIdx].isVerified;
      profiles[pIdx].isVerified = newStatus;
      profiles[pIdx].user.isVerified = newStatus;
      setItem(PROFILES_KEY, profiles);

      saveProfileToFirestore(profiles[pIdx].user._id, profiles[pIdx]).catch((err) =>
        console.warn('Firestore profile sync error:', err)
      );

      return { message: 'Verification toggled successfully', isVerified: newStatus };
    }
    throw new Error(`Member not found for ID: ${targetUserId}`);
  }

  if (endpoint.includes('/admin/users/') && endpoint.endsWith('/featured') && (method === 'PUT' || method === 'POST')) {
    const targetUserId = getAdminUserIdFromUrl(endpoint);
    const pIdx = findUserIndex(targetUserId);
    if (pIdx !== -1) {
      const newStatus = !profiles[pIdx].isFeatured;
      profiles[pIdx].isFeatured = newStatus;
      setItem(PROFILES_KEY, profiles);

      saveProfileToFirestore(profiles[pIdx].user._id, profiles[pIdx]).catch((err) =>
        console.warn('Firestore profile sync error:', err)
      );

      return { message: 'Featured status toggled successfully', isFeatured: newStatus };
    }
    throw new Error(`Member not found for ID: ${targetUserId}`);
  }

  if (endpoint.includes('/admin/users/') && endpoint.endsWith('/edit') && (method === 'PUT' || method === 'POST')) {
    const targetUserId = getAdminUserIdFromUrl(endpoint);
    const pIdx = findUserIndex(targetUserId);
    if (pIdx !== -1) {
      profiles[pIdx] = {
        ...profiles[pIdx],
        user: { ...profiles[pIdx].user, fullName: body.fullName || profiles[pIdx].user.fullName, email: body.email || profiles[pIdx].user.email },
        city: body.city || profiles[pIdx].city,
        caste: body.caste || profiles[pIdx].caste,
        occupation: body.occupation || profiles[pIdx].occupation,
        education: body.education || profiles[pIdx].education,
        biodataVisibility: body.biodataPrivacy || profiles[pIdx].biodataVisibility,
      };
      setItem(PROFILES_KEY, profiles);

      saveProfileToFirestore(profiles[pIdx].user._id, profiles[pIdx]).catch((err) =>
        console.warn('Firestore profile sync error:', err)
      );

      return { message: 'User updated successfully', profile: profiles[pIdx] };
    }
    throw new Error(`Member not found for ID: ${targetUserId}`);
  }

  if (endpoint.includes('/admin/users/') && endpoint.endsWith('/status') && (method === 'PUT' || method === 'POST')) {
    const targetUserId = getAdminUserIdFromUrl(endpoint);
    const pIdx = findUserIndex(targetUserId);
    if (pIdx !== -1) {
      profiles[pIdx].user.status = body.status;
      setItem(PROFILES_KEY, profiles);

      saveProfileToFirestore(profiles[pIdx].user._id, profiles[pIdx]).catch((err) =>
        console.warn('Firestore profile sync error:', err)
      );

      return { message: 'Status updated successfully', status: body.status };
    }
    throw new Error(`Member not found for ID: ${targetUserId}`);
  }

  if (endpoint.includes('/admin/users/') && method === 'DELETE') {
    const targetUserId = getAdminUserIdFromUrl(endpoint);
    const pIdx = findUserIndex(targetUserId);
    if (pIdx !== -1) {
      profiles.splice(pIdx, 1);
      setItem(PROFILES_KEY, profiles);
      return { message: 'User deleted permanently' };
    }
    throw new Error(`Member not found for ID: ${targetUserId}`);
  }

  // --- Admin Success Stories Endpoints ---
  if (endpoint === '/admin/stories' && method === 'GET') {
    return getItem(SUCCESS_STORIES_KEY, initialSuccessStories || []);
  }

  if (endpoint === '/admin/stories' && method === 'POST') {
    const stories = getItem(SUCCESS_STORIES_KEY, initialSuccessStories || []);
    const newStory = {
      id: `story_${Date.now()}`,
      namesEn: body.namesEn,
      namesMr: body.namesMr,
      locationEn: body.locationEn,
      locationMr: body.locationMr,
      image: body.image || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
      quoteEn: body.quoteEn,
      quoteMr: body.quoteMr,
      createdAt: new Date().toISOString(),
    };
    stories.unshift(newStory);
    setItem(SUCCESS_STORIES_KEY, stories);
    return { message: 'Success story added', story: newStory };
  }

  if (endpoint.startsWith('/admin/stories/') && method === 'PUT') {
    const storyId = endpoint.replace('/admin/stories/', '');
    const stories = getItem(SUCCESS_STORIES_KEY, initialSuccessStories || []);
    const sIdx = stories.findIndex((s: any) => String(s.id) === String(storyId));
    if (sIdx !== -1) {
      stories[sIdx] = {
        ...stories[sIdx],
        namesEn: body.namesEn || stories[sIdx].namesEn,
        namesMr: body.namesMr || stories[sIdx].namesMr,
        locationEn: body.locationEn || stories[sIdx].locationEn,
        locationMr: body.locationMr || stories[sIdx].locationMr,
        quoteEn: body.quoteEn || stories[sIdx].quoteEn,
        quoteMr: body.quoteMr || stories[sIdx].quoteMr,
        image: body.image || stories[sIdx].image,
      };
      setItem(SUCCESS_STORIES_KEY, stories);
      return { message: 'Success story updated successfully', story: stories[sIdx] };
    }
  }

  if (endpoint.startsWith('/admin/stories/') && method === 'DELETE') {
    const storyId = endpoint.replace('/admin/stories/', '');
    const stories = getItem(SUCCESS_STORIES_KEY, initialSuccessStories || []);
    const filtered = stories.filter((s: any) => String(s.id) !== String(storyId));
    setItem(SUCCESS_STORIES_KEY, filtered);
    return { message: 'Story deleted successfully' };
  }

  if (endpoint === '/admin/reports') {
    return getItem(REPORTS_KEY, []);
  }

  if (endpoint === '/admin/announcement' && method === 'POST') {
    const notifications = getItem(NOTIFICATIONS_KEY, []);
    profiles.forEach((p: ProfileData) => {
      notifications.unshift({
        _id: `notif_sys_${Date.now()}_${p.user._id}`,
        userId: p.user._id,
        type: 'SYSTEM',
        titleEn: body.titleEn,
        titleMr: body.titleMr,
        messageEn: body.messageEn,
        messageMr: body.messageMr,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    });
    setItem(NOTIFICATIONS_KEY, notifications);
    return { message: `Announcement sent to ${profiles.length} members` };
  }

  if (endpoint === '/reports/report' && method === 'POST') {
    const reports = getItem(REPORTS_KEY, []);
    reports.unshift({
      _id: `rep_${Date.now()}`,
      reporterId: currentUser.id,
      reportedUserId: body.reportedUserId,
      reason: body.reason,
      details: body.details,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    setItem(REPORTS_KEY, reports);
    return { message: 'Report submitted' };
  }

  return {};
};
