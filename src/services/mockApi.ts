import { initialProfiles, ProfileData } from './mockData';

const PROFILES_KEY = 'pb_profiles';
const VIEWS_KEY = 'pb_views';
const NOTIFICATIONS_KEY = 'pb_notifications';
const INTERESTS_KEY = 'pb_interests';
const SHORTLISTS_KEY = 'pb_shortlists';
const CONVERSATIONS_KEY = 'pb_conversations';
const MESSAGES_KEY = 'pb_messages';
const REPORTS_KEY = 'pb_reports';
const BLOCKS_KEY = 'pb_blocks';
const CURRENT_USER_KEY = 'pb_current_user';

// Helper to get stored items
const getItem = (key: string, defaultValue: any) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const setItem = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage set failed:', e);
  }
};

// Init seed data in LocalStorage if empty
export const initMockStorage = () => {
  if (!localStorage.getItem(PROFILES_KEY)) {
    setItem(PROFILES_KEY, initialProfiles);
  }
  if (!localStorage.getItem(VIEWS_KEY)) {
    setItem(VIEWS_KEY, [
      {
        _id: 'view_1',
        viewerId: 'usr_suyash',
        profileOwnerId: 'usr_priya',
        viewedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      },
    ]);
  }
  if (!localStorage.getItem(NOTIFICATIONS_KEY)) {
    setItem(NOTIFICATIONS_KEY, [
      {
        _id: 'notif_1',
        userId: 'usr_priya',
        type: 'PROFILE_VIEW',
        titleEn: '🔔 New Profile View',
        titleMr: '🔔 नवीन प्रोफाइल व्ह्यू',
        messageEn: 'Suyash Narade viewed your profile.',
        messageMr: 'सुयश नारडे यांनी तुमचे प्रोफाइल पाहिले.',
        senderId: 'usr_suyash',
        targetProfileId: 'PB-10024',
        isRead: false,
        createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      },
    ]);
  }
  if (!localStorage.getItem(INTERESTS_KEY)) {
    setItem(INTERESTS_KEY, [
      {
        _id: 'interest_1',
        senderId: 'usr_suyash',
        receiverId: 'usr_priya',
        status: 'accepted',
        createdAt: new Date(Date.now() - 86400 * 1000).toISOString(),
      },
    ]);
  }
  if (!localStorage.getItem(CONVERSATIONS_KEY)) {
    setItem(CONVERSATIONS_KEY, [
      {
        _id: 'conv_1',
        participants: ['usr_suyash', 'usr_priya'],
        lastMessage: 'Namaste Priya! Thank you for accepting my interest.',
        lastMessageAt: new Date().toISOString(),
      },
    ]);
  }
  if (!localStorage.getItem(MESSAGES_KEY)) {
    setItem(MESSAGES_KEY, [
      {
        _id: 'msg_1',
        conversationId: 'conv_1',
        senderId: 'usr_suyash',
        content: 'Namaste Priya! Thank you for accepting my interest.',
        createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
      },
      {
        _id: 'msg_2',
        conversationId: 'conv_1',
        senderId: 'usr_priya',
        content: 'Namaste Suyash! Glad to connect with you.',
        createdAt: new Date(Date.now() - 1800 * 1000).toISOString(),
      },
    ]);
  }
  if (!localStorage.getItem(SHORTLISTS_KEY)) {
    setItem(SHORTLISTS_KEY, [
      {
        _id: 'short_1',
        userId: 'usr_suyash',
        targetUserId: 'usr_priya',
        createdAt: new Date().toISOString(),
      },
    ]);
  }
};

initMockStorage();

// Current User State
export const getCurrentUser = () => {
  return getItem(CURRENT_USER_KEY, null);
};

export const setCurrentUser = (user: any) => {
  setItem(CURRENT_USER_KEY, user);
};

// Calculate profile completion percentage
const calculateCompletion = (profile: any): number => {
  let score = 40;
  if (profile.aboutMe && profile.aboutMe.length > 10) score += 15;
  if (profile.primaryPhoto) score += 20;
  if (profile.biodataUrl) score += 15;
  if (profile.education && profile.occupation) score += 10;
  return Math.min(100, score);
};

// Mock API Dispatcher
export const mockApiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? (options.body instanceof FormData ? options.body : JSON.parse(options.body as string)) : {};

  const profiles: ProfileData[] = getItem(PROFILES_KEY, initialProfiles);
  const currentUser = getCurrentUser();

  // --- 1. AUTH ENDPOINTS ---
  if (endpoint === '/auth/login' && method === 'POST') {
    const { email, password } = body;
    let prof = profiles.find((p) => p.user.email.toLowerCase() === email.toLowerCase());

    // Admin account login shortcut
    if (email === 'admin@matrimony.com') {
      const adminUser = {
        id: 'usr_admin',
        fullName: 'Platform Admin',
        email: 'admin@matrimony.com',
        mobile: '9999999999',
        gender: 'male',
        role: 'admin',
        profileId: 'PB-ADMIN',
        profile: {
          profileId: 'PB-ADMIN',
          city: 'Mumbai',
          occupation: 'Administrator',
          completionPercentage: 100,
        },
      };
      setCurrentUser(adminUser);
      return { token: 'mock_jwt_admin_token', user: adminUser };
    }

    if (!prof) {
      throw new Error('Invalid email or password');
    }

    if (prof.user.status === 'suspended') {
      throw new Error('Your account has been suspended by administration');
    }

    const userData = {
      id: prof.user._id,
      fullName: prof.user.fullName,
      email: prof.user.email,
      mobile: prof.user.mobile,
      gender: prof.user.gender,
      role: 'user',
      profileId: prof.profileId,
      profile: prof,
    };
    setCurrentUser(userData);

    return { token: `mock_jwt_token_${prof.user._id}`, user: userData };
  }

  if (endpoint === '/auth/register' && method === 'POST') {
    const { fullName, email, mobile, gender, dob, city, caste, religion, education, occupation } = body;
    const profileId = `PB-${Math.floor(10000 + Math.random() * 90000)}`;
    const newId = `usr_${Date.now()}`;

    const birthYear = dob ? new Date(dob).getFullYear() : 1998;
    const age = new Date().getFullYear() - birthYear;

    const newProfile: ProfileData = {
      _id: newId,
      user: {
        _id: newId,
        fullName,
        email: email.toLowerCase(),
        mobile,
        gender,
        isVerified: false,
        status: 'active',
      },
      profileId,
      age,
      gender,
      height: body.height || "5'7\"",
      maritalStatus: body.maritalStatus || 'never_married',
      religion: religion || 'Hindu',
      caste: caste || 'Maratha',
      subCaste: body.subCaste || '',
      motherTongue: body.motherTongue || 'Marathi',
      city: city || 'Pune',
      state: body.state || 'Maharashtra',
      country: 'India',
      education: education || 'Graduate',
      occupation: occupation || 'Employed',
      company: body.company || '',
      income: body.income || '8-12 LPA',
      fatherOccupation: body.fatherOccupation || '',
      motherOccupation: body.motherOccupation || '',
      brothers: Number(body.brothers) || 0,
      sisters: Number(body.sisters) || 0,
      familyType: body.familyType || 'nuclear',
      familyValues: body.familyValues || 'moderate',
      aboutMe: body.aboutMe || `Hello, I am ${fullName}. Looking for a compatible life partner.`,
      partnerPreferences: body.partnerPreferences || {
        minAge: 21,
        maxAge: 35,
        education: 'Graduate',
        occupation: 'Employed',
        location: 'Maharashtra',
      },
      biodataVisibility: 'connections_only',
      photos: [],
      photoVisibility: 'public',
      completionPercentage: 75,
      isVerified: false,
      matchPercentage: 88,
      createdAt: new Date().toISOString(),
    };

    profiles.unshift(newProfile);
    setItem(PROFILES_KEY, profiles);

    const userData = {
      id: newId,
      fullName,
      email,
      mobile,
      gender,
      role: 'user',
      profileId,
      profile: newProfile,
    };
    setCurrentUser(userData);

    return { token: `mock_jwt_token_${newId}`, user: userData };
  }

  if (endpoint === '/auth/me') {
    if (!currentUser) throw new Error('Not authenticated');
    const prof = profiles.find((p) => p.user._id === currentUser.id);
    return { user: currentUser, profile: prof || currentUser.profile };
  }

  // --- 2. SEARCH & DISCOVERY ENDPOINTS ---
  if (endpoint.startsWith('/search')) {
    if (endpoint.includes('/featured')) {
      return profiles.slice(0, 6);
    }

    const urlParams = new URLSearchParams(endpoint.split('?')[1] || '');
    const nameQ = urlParams.get('name')?.toLowerCase();
    const genderQ = urlParams.get('gender');
    const minAgeQ = Number(urlParams.get('minAge') || 0);
    const maxAgeQ = Number(urlParams.get('maxAge') || 100);
    const cityQ = urlParams.get('city')?.toLowerCase();
    const religionQ = urlParams.get('religion')?.toLowerCase();
    const casteQ = urlParams.get('caste')?.toLowerCase();
    const maritalStatusQ = urlParams.get('maritalStatus');

    let filtered = profiles.filter((p) => {
      if (currentUser && p.user._id === currentUser.id) return false;
      if (nameQ && !p.user.fullName.toLowerCase().includes(nameQ)) return false;
      if (genderQ && p.gender !== genderQ) return false;
      if (p.age < minAgeQ || p.age > maxAgeQ) return false;
      if (cityQ && !p.city.toLowerCase().includes(cityQ)) return false;
      if (religionQ && !p.religion.toLowerCase().includes(religionQ)) return false;
      if (casteQ && !p.caste.toLowerCase().includes(casteQ)) return false;
      if (maritalStatusQ && p.maritalStatus !== maritalStatusQ) return false;
      return true;
    });

    const shortlists = getItem(SHORTLISTS_KEY, []);
    const interests = getItem(INTERESTS_KEY, []);
    const myShortlistIds = currentUser ? shortlists.filter((s: any) => s.userId === currentUser.id).map((s: any) => s.targetUserId) : [];
    const mySentInterestIds = currentUser ? interests.filter((i: any) => i.senderId === currentUser.id).map((i: any) => i.receiverId) : [];

    const formattedResults = filtered.map((p) => ({
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
      const p = profiles.find((prof) => prof.user._id === currentUser?.id);
      return p || {};
    }

    if (targetId === 'me' && method === 'PUT') {
      const pIndex = profiles.findIndex((prof) => prof.user._id === currentUser?.id);
      if (pIndex !== -1) {
        profiles[pIndex] = { ...profiles[pIndex], ...body };
        profiles[pIndex].completionPercentage = calculateCompletion(profiles[pIndex]);
        setItem(PROFILES_KEY, profiles);
        return { message: 'Profile updated', profile: profiles[pIndex] };
      }
    }

    // PDF Upload handling in browser (Data URL)
    if (targetId === 'upload-biodata' && method === 'POST') {
      const pIndex = profiles.findIndex((prof) => prof.user._id === currentUser?.id);
      if (pIndex !== -1 && body instanceof FormData) {
        const file = body.get('biodata') as File;
        if (file) {
          const fakeUrl = URL.createObjectURL(file);
          profiles[pIndex].biodataUrl = fakeUrl;
          profiles[pIndex].biodataFileName = file.name;
          profiles[pIndex].completionPercentage = calculateCompletion(profiles[pIndex]);
          setItem(PROFILES_KEY, profiles);
          return { message: 'Biodata uploaded', biodataUrl: fakeUrl, profile: profiles[pIndex] };
        }
      }
    }

    if (targetId === 'delete-biodata' && method === 'POST') {
      const pIndex = profiles.findIndex((prof) => prof.user._id === currentUser?.id);
      if (pIndex !== -1) {
        profiles[pIndex].biodataUrl = '';
        profiles[pIndex].biodataFileName = '';
        setItem(PROFILES_KEY, profiles);
        return { message: 'Biodata deleted', profile: profiles[pIndex] };
      }
    }

    // Fetch Profile By ID & TRIGGER PROFILE VIEW TRACKING LOGIC (Requirement 10 & 36)!
    let targetProf = profiles.find((p) => p.profileId === targetId || p._id === targetId || p.user._id === targetId);
    if (!targetProf) throw new Error('Profile not found');

    if (currentUser && currentUser.id !== targetProf.user._id) {
      const views = getItem(VIEWS_KEY, []);
      const cooldownHours = 24;
      const cooldownTime = new Date(Date.now() - cooldownHours * 60 * 60 * 1000);

      // Check if view logged within last 24 hours
      const recent = views.find(
        (v: any) =>
          v.viewerId === currentUser.id &&
          v.profileOwnerId === targetProf.user._id &&
          new Date(v.viewedAt) >= cooldownTime
      );

      if (!recent) {
        // Record new profile view
        views.unshift({
          _id: `view_${Date.now()}`,
          viewerId: currentUser.id,
          profileOwnerId: targetProf.user._id,
          viewedAt: new Date().toISOString(),
        });
        setItem(VIEWS_KEY, views);

        // Generate bilingual notification for owner
        const notifications = getItem(NOTIFICATIONS_KEY, []);
        notifications.unshift({
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
        });
        setItem(NOTIFICATIONS_KEY, notifications);
      }
    }

    return targetProf;
  }

  // --- 4. PROFILE VIEWS LOG ENDPOINT ---
  if (endpoint === '/profile-views/recent') {
    const views = getItem(VIEWS_KEY, []);
    const myViews = views.filter((v: any) => v.profileOwnerId === currentUser?.id);

    const formattedViews = myViews.map((v: any) => {
      const viewerProf = profiles.find((p) => p.user._id === v.viewerId);
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

  // --- 5. INTERESTS ENDPOINTS ---
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

    // Notify Receiver
    const notifications = getItem(NOTIFICATIONS_KEY, []);
    notifications.unshift({
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
    });
    setItem(NOTIFICATIONS_KEY, notifications);

    return { message: 'Interest sent successfully', interest: newInterest };
  }

  if (endpoint === '/interests/respond' && method === 'POST') {
    const { interestId, action } = body;
    const interests = getItem(INTERESTS_KEY, []);
    const idx = interests.findIndex((i: any) => i._id === interestId);

    if (idx !== -1) {
      interests[idx].status = action === 'accept' ? 'accepted' : 'rejected';
      setItem(INTERESTS_KEY, interests);

      if (action === 'accept') {
        const conversations = getItem(CONVERSATIONS_KEY, []);
        let conv = conversations.find((c: any) =>
          c.participants.includes(interests[idx].senderId) && c.participants.includes(currentUser.id)
        );
        if (!conv) {
          conv = {
            _id: `conv_${Date.now()}`,
            participants: [interests[idx].senderId, currentUser.id],
            lastMessage: 'Mutual connection established. Say Hi!',
            lastMessageAt: new Date().toISOString(),
          };
          conversations.unshift(conv);
          setItem(CONVERSATIONS_KEY, conversations);
        }

        // Notify sender
        const notifications = getItem(NOTIFICATIONS_KEY, []);
        notifications.unshift({
          _id: `notif_${Date.now()}`,
          userId: interests[idx].senderId,
          type: 'INTEREST_ACCEPTED',
          titleEn: '🎉 Interest Accepted!',
          titleMr: '🎉 आवड (Interest) स्विकारली!',
          messageEn: `${currentUser.fullName} accepted your interest request!`,
          messageMr: `${currentUser.fullName} यांनी तुमची आवड स्वीकारली!`,
          senderId: currentUser.id,
          targetProfileId: currentUser.profileId,
          isRead: false,
          createdAt: new Date().toISOString(),
        });
        setItem(NOTIFICATIONS_KEY, notifications);
      }
      return { message: `Interest ${action}ed`, interest: interests[idx] };
    }
  }

  if (endpoint === '/interests/my-interests') {
    const interests = getItem(INTERESTS_KEY, []);
    const received = interests.filter((i: any) => i.receiverId === currentUser?.id);
    const sent = interests.filter((i: any) => i.senderId === currentUser?.id);

    const formatList = (list: any[], userKey: string) =>
      list.map((item) => {
        const p = profiles.find((prof) => prof.user._id === item[userKey]);
        return {
          _id: item._id,
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
      const p = profiles.find((prof) => prof.user._id === item.targetUserId);
      return { _id: item._id, profile: p };
    });
  }

  // --- 7. NOTIFICATIONS ENDPOINTS ---
  if (endpoint === '/notifications') {
    const notifications = getItem(NOTIFICATIONS_KEY, []);
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

  // --- 8. MESSAGING ENDPOINTS ---
  if (endpoint === '/messages/conversations') {
    const conversations = getItem(CONVERSATIONS_KEY, []);
    const myConvs = conversations.filter((c: any) => c.participants.includes(currentUser?.id));

    return myConvs.map((conv: any) => {
      const partnerId = conv.participants.find((p: string) => p !== currentUser?.id);
      const partnerProf = profiles.find((p) => p.user._id === partnerId);
      return {
        _id: conv._id,
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
    const messages = getItem(MESSAGES_KEY, []);
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
    const cIdx = conversations.findIndex((c: any) => c._id === conversationId);
    if (cIdx !== -1) {
      conversations[cIdx].lastMessage = content;
      conversations[cIdx].lastMessageAt = new Date().toISOString();
      setItem(CONVERSATIONS_KEY, conversations);
    }
    return newMsg;
  }

  // --- 9. ADMIN ENDPOINTS ---
  if (endpoint === '/admin/stats') {
    const views = getItem(VIEWS_KEY, []);
    const interests = getItem(INTERESTS_KEY, []);
    const reports = getItem(REPORTS_KEY, []);

    return {
      totalUsers: profiles.length,
      activeUsers: profiles.filter((p) => p.user.status === 'active').length,
      verifiedUsers: profiles.filter((p) => p.isVerified).length,
      totalViews: views.length,
      totalInterests: interests.length,
      totalConnections: interests.filter((i: any) => i.status === 'accepted').length,
      pendingReports: reports.filter((r: any) => r.status === 'pending').length,
    };
  }

  if (endpoint.startsWith('/admin/users')) {
    const searchQ = new URLSearchParams(endpoint.split('?')[1] || '').get('search')?.toLowerCase();
    let filtered = profiles;
    if (searchQ) {
      filtered = profiles.filter((p) => p.user.fullName.toLowerCase().includes(searchQ) || p.user.email.toLowerCase().includes(searchQ));
    }
    return {
      users: filtered.map((p) => ({
        _id: p.user._id,
        fullName: p.user.fullName,
        email: p.user.email,
        mobile: p.user.mobile,
        profileId: p.profileId,
        city: p.city,
        isVerified: p.isVerified,
        status: p.user.status,
      })),
    };
  }

  if (endpoint.includes('/admin/users/') && endpoint.endsWith('/verify')) {
    const userId = endpoint.split('/')[3];
    const pIdx = profiles.findIndex((p) => p.user._id === userId);
    if (pIdx !== -1) {
      profiles[pIdx].isVerified = !profiles[pIdx].isVerified;
      profiles[pIdx].user.isVerified = profiles[pIdx].isVerified;
      setItem(PROFILES_KEY, profiles);
      return { message: 'Verification toggled', isVerified: profiles[pIdx].isVerified };
    }
  }

  if (endpoint.includes('/admin/users/') && endpoint.endsWith('/status')) {
    const userId = endpoint.split('/')[3];
    const pIdx = profiles.findIndex((p) => p.user._id === userId);
    if (pIdx !== -1) {
      profiles[pIdx].user.status = body.status;
      setItem(PROFILES_KEY, profiles);
      return { message: 'Status updated', status: body.status };
    }
  }

  if (endpoint === '/admin/reports') {
    return getItem(REPORTS_KEY, []);
  }

  if (endpoint === '/admin/announcement' && method === 'POST') {
    const notifications = getItem(NOTIFICATIONS_KEY, []);
    profiles.forEach((p) => {
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
