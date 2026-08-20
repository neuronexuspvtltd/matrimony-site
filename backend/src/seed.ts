import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import User from './models/User';
import Profile from './models/Profile';
import ProfileView from './models/ProfileView';
import Interest from './models/Interest';
import Notification from './models/Notification';
import Conversation from './models/Conversation';
import Message from './models/Message';

dotenv.config({ path: path.join(__dirname, '../.env') });

const sampleUsers = [
  {
    fullName: 'Suyash Narade',
    email: 'suyash@example.com',
    mobile: '9876543210',
    password: 'Password123',
    gender: 'male',
    dob: new Date('1998-05-14'),
    role: 'user',
    isVerified: true,
    profileData: {
      profileId: 'PB-10024',
      height: "5'10\"",
      maritalStatus: 'never_married',
      religion: 'Hindu',
      caste: 'Maratha',
      subCaste: 'Deshmukh',
      motherTongue: 'Marathi',
      city: 'Kolhapur',
      state: 'Maharashtra',
      country: 'India',
      education: 'B.Tech Computer Science',
      college: 'COEP Pune',
      occupation: 'Senior Software Engineer',
      company: 'Tech Solutions India',
      income: '15-20 LPA',
      fatherOccupation: 'Government Officer (Retd)',
      motherOccupation: 'Homemaker',
      brothers: 1,
      sisters: 0,
      familyType: 'nuclear',
      familyValues: 'moderate',
      aboutMe: 'Sophisticated engineer passionate about technology, Indian classical music, and traveling. Looking for an educated, understanding life partner with strong family values.',
      primaryPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      photos: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      ],
      completionPercentage: 95,
      isVerified: true,
    },
  },
  {
    fullName: 'Priya Kulkarni',
    email: 'priya@example.com',
    mobile: '9876543211',
    password: 'Password123',
    gender: 'female',
    dob: new Date('2000-08-22'),
    role: 'user',
    isVerified: true,
    profileData: {
      profileId: 'PB-10025',
      height: "5'5\"",
      maritalStatus: 'never_married',
      religion: 'Hindu',
      caste: 'Brahmin',
      subCaste: 'Deshastha',
      motherTongue: 'Marathi',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      education: 'M.Sc Data Science',
      college: 'Fergusson College Pune',
      occupation: 'Data Scientist',
      company: 'Global Analytics Inc',
      income: '12-15 LPA',
      fatherOccupation: 'Bank Manager',
      motherOccupation: 'High School Teacher',
      brothers: 0,
      sisters: 1,
      familyType: 'joint',
      familyValues: 'traditional',
      aboutMe: 'Warm, career-oriented yet traditional Marathi girl. Enjoy reading, classical dance, and family gatherings.',
      primaryPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      photos: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      ],
      completionPercentage: 90,
      isVerified: true,
    },
  },
  {
    fullName: 'Rohit Patil',
    email: 'rohit@example.com',
    mobile: '9876543212',
    password: 'Password123',
    gender: 'male',
    dob: new Date('1996-03-10'),
    role: 'user',
    isVerified: true,
    profileData: {
      profileId: 'PB-10026',
      height: "5'11\"",
      maritalStatus: 'never_married',
      religion: 'Hindu',
      caste: 'Maratha',
      subCaste: '96 Kuli',
      motherTongue: 'Marathi',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      education: 'MBA Finance',
      college: 'JBIMS Mumbai',
      occupation: 'Investment Banker',
      company: 'HDFC Securities',
      income: '25-30 LPA',
      fatherOccupation: 'Businessman',
      motherOccupation: 'Homemaker',
      brothers: 1,
      sisters: 1,
      familyType: 'nuclear',
      familyValues: 'moderate',
      aboutMe: 'Ambitious professional who balances work and life. Fitness enthusiast and avid reader.',
      primaryPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      photos: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80'],
      completionPercentage: 85,
      isVerified: true,
    },
  },
  {
    fullName: 'Ananya Joshi',
    email: 'ananya@example.com',
    mobile: '9876543213',
    password: 'Password123',
    gender: 'female',
    dob: new Date('1999-11-05'),
    role: 'user',
    isVerified: true,
    profileData: {
      profileId: 'PB-10027',
      height: "5'4\"",
      maritalStatus: 'never_married',
      religion: 'Hindu',
      caste: 'Brahmin',
      subCaste: 'Kokanastha',
      motherTongue: 'Marathi',
      city: 'Nashik',
      state: 'Maharashtra',
      country: 'India',
      education: 'B.Arch Architecture',
      college: 'Sir JJ College of Architecture',
      occupation: 'Architect / Interior Designer',
      company: 'Studio Design Mumbai',
      income: '10-12 LPA',
      fatherOccupation: 'Doctor (MD)',
      motherOccupation: 'Doctor (Gynaecologist)',
      brothers: 0,
      sisters: 0,
      familyType: 'nuclear',
      familyValues: 'liberal',
      aboutMe: 'Creative architect passionate about art, interior spaces, and trekking in Maharashtra forts.',
      primaryPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      photos: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'],
      completionPercentage: 88,
      isVerified: true,
    },
  },
  {
    fullName: 'Aditya Deshmukh',
    email: 'aditya@example.com',
    mobile: '9876543214',
    password: 'Password123',
    gender: 'male',
    dob: new Date('1995-01-20'),
    role: 'user',
    isVerified: true,
    profileData: {
      profileId: 'PB-10028',
      height: "6'0\"",
      maritalStatus: 'never_married',
      religion: 'Hindu',
      caste: 'Maratha',
      subCaste: 'Deshmukh',
      motherTongue: 'Marathi',
      city: 'Chhatrapati Sambhajinagar',
      state: 'Maharashtra',
      country: 'India',
      education: 'MD General Medicine',
      college: 'GMC Aurangabad',
      occupation: 'Consultant Physician',
      company: 'City Multi-Specialty Hospital',
      income: '30+ LPA',
      fatherOccupation: 'Civil Judge (Retd)',
      motherOccupation: 'Professor',
      brothers: 1,
      sisters: 0,
      familyType: 'joint',
      familyValues: 'traditional',
      aboutMe: 'Dedicated medical professional with deep roots in culture. Looking for an educated partner.',
      primaryPhoto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
      photos: ['https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80'],
      completionPercentage: 92,
      isVerified: true,
    },
  },
  {
    fullName: 'Sneha Shinde',
    email: 'sneha@example.com',
    mobile: '9876543215',
    password: 'Password123',
    gender: 'female',
    dob: new Date('2001-04-18'),
    role: 'user',
    isVerified: true,
    profileData: {
      profileId: 'PB-10029',
      height: "5'6\"",
      maritalStatus: 'never_married',
      religion: 'Hindu',
      caste: 'Maratha',
      subCaste: '96 Kuli',
      motherTongue: 'Marathi',
      city: 'Satara',
      state: 'Maharashtra',
      country: 'India',
      education: 'CA (Chartered Accountant)',
      college: 'ICAI India',
      occupation: 'Financial Auditor',
      company: 'Deloitte India',
      income: '14-18 LPA',
      fatherOccupation: 'Agricultural Business Officer',
      motherOccupation: 'Teacher',
      brothers: 0,
      sisters: 1,
      familyType: 'nuclear',
      familyValues: 'moderate',
      aboutMe: 'Chartered Accountant living in Pune. Love classical music, cooking Maharashtrian cuisine, and photography.',
      primaryPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
      photos: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'],
      completionPercentage: 88,
      isVerified: true,
    },
  },
];

const seedDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/matrimony_db';
    try {
      await mongoose.connect(connStr, { serverSelectionTimeoutMS: 3000 });
      console.log('[Seed]: Connected to primary MongoDB');
    } catch (err) {
      console.log('[Seed]: Local MongoDB not available, initializing MongoMemoryServer...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create({ instance: { dbName: 'matrimony_db' } });
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log('[Seed]: Connected to MongoMemoryServer');
    }

    await User.deleteMany({});
    await Profile.deleteMany({});
    await ProfileView.deleteMany({});
    await Interest.deleteMany({});
    await Notification.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});

    // Create Admin User
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const adminUser = await User.create({
      fullName: 'Platform Admin',
      email: 'admin@matrimony.com',
      mobile: '9999999999',
      password: adminPassword,
      gender: 'male',
      dob: new Date('1990-01-01'),
      role: 'admin',
      isVerified: true,
      status: 'active',
    });

    await Profile.create({
      user: adminUser._id,
      profileId: 'PB-ADMIN',
      age: 36,
      gender: 'male',
      religion: 'Hindu',
      caste: 'General',
      motherTongue: 'Marathi',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      education: 'Post Graduate',
      occupation: 'Administrator',
      completionPercentage: 100,
      isVerified: true,
    });

    console.log('[Seed]: Created Admin Account (admin@matrimony.com / Admin@123)');

    // Create Sample Users & Profiles
    const createdUsers: any[] = [];
    for (const u of sampleUsers) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      const userDoc = await User.create({
        fullName: u.fullName,
        email: u.email,
        mobile: u.mobile,
        password: hashedPassword,
        gender: u.gender,
        dob: u.dob,
        role: u.role,
        isVerified: u.isVerified,
        status: 'active',
      });

      const birthYear = u.dob.getFullYear();
      const age = new Date().getFullYear() - birthYear;

      const profileDoc = await Profile.create({
        user: userDoc._id,
        age,
        gender: u.gender,
        ...u.profileData,
      });

      createdUsers.push({ user: userDoc, profile: profileDoc });
      console.log(`[Seed]: Created user ${u.fullName} (${u.profileData.profileId})`);
    }

    // Create Inter-user activity
    const suyash = createdUsers.find((c) => c.user.email === 'suyash@example.com');
    const priya = createdUsers.find((c) => c.user.email === 'priya@example.com');

    if (suyash && priya) {
      // Suyash views Priya
      await ProfileView.create({
        viewerId: suyash.user._id,
        profileOwnerId: priya.user._id,
        viewedAt: new Date(Date.now() - 3600 * 1000 * 2),
      });

      await Notification.create({
        userId: priya.user._id,
        type: 'PROFILE_VIEW',
        titleEn: '🔔 New Profile View',
        titleMr: '🔔 नवीन प्रोफाइल व्ह्यू',
        messageEn: 'Suyash Narade viewed your profile.',
        messageMr: 'सुयश नारडे यांनी तुमचे प्रोफाइल पाहिले.',
        senderId: suyash.user._id,
        targetProfileId: suyash.profile.profileId,
      });

      // Suyash sends Interest to Priya
      const interest = await Interest.create({
        senderId: suyash.user._id,
        receiverId: priya.user._id,
        status: 'accepted',
      });

      await Notification.create({
        userId: priya.user._id,
        type: 'INTEREST_RECEIVED',
        titleEn: '💖 New Interest Received',
        titleMr: '💖 नवीन आवड (Interest) प्राप्त झाली',
        messageEn: 'Suyash Narade expressed interest in your profile.',
        messageMr: 'सुयश नारडे यांनी तुमच्या प्रोफाईलमध्ये रस दाखवला आहे.',
        senderId: suyash.user._id,
        targetProfileId: suyash.profile.profileId,
      });

      // Conversation unlocked
      const conversation = await Conversation.create({
        participants: [suyash.user._id, priya.user._id],
        lastMessage: 'Namaste Priya! Thank you for accepting my interest.',
        lastMessageAt: new Date(),
      });

      await Message.create({
        conversationId: conversation._id,
        senderId: suyash.user._id,
        content: 'Namaste Priya! Thank you for accepting my interest.',
      });

      await Message.create({
        conversationId: conversation._id,
        senderId: priya.user._id,
        content: 'Namaste Suyash! Glad to connect with you.',
      });
    }

    console.log('[Seed]: Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDB();
