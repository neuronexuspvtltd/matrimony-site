export interface ProfileData {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    mobile: string;
    gender: 'male' | 'female';
    isVerified: boolean;
    status: 'active' | 'suspended';
  };
  profileId: string;
  age: number;
  gender: 'male' | 'female';
  height: string;
  maritalStatus: string;
  religion: string;
  caste: string;
  subCaste?: string;
  motherTongue: string;
  city: string;
  state: string;
  country: string;
  education: string;
  college?: string;
  occupation: string;
  company?: string;
  income?: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  brothers?: number;
  sisters?: number;
  familyType?: string;
  familyValues?: string;
  aboutMe?: string;
  partnerPreferences?: {
    minAge?: number;
    maxAge?: number;
    education?: string;
    occupation?: string;
    location?: string;
    religion?: string;
    caste?: string;
  };
  biodataUrl?: string;
  biodataFileName?: string;
  biodataVisibility: 'public' | 'connections_only' | 'private';
  primaryPhoto?: string;
  photos: string[];
  photoVisibility: 'public' | 'connections_only' | 'private';
  completionPercentage: number;
  isVerified: boolean;
  matchPercentage?: number;
  createdAt: string;
}

export const initialProfiles: ProfileData[] = [
  {
    _id: 'usr_suyash',
    user: {
      _id: 'usr_suyash',
      fullName: 'Suyash Narade',
      email: 'suyash@example.com',
      mobile: '9876543210',
      gender: 'male',
      isVerified: true,
      status: 'active',
    },
    profileId: 'PB-10024',
    age: 26,
    gender: 'male',
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
    biodataUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    biodataFileName: 'Suyash_Narade_Biodata.pdf',
    biodataVisibility: 'connections_only',
    primaryPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    ],
    photoVisibility: 'public',
    completionPercentage: 95,
    isVerified: true,
    matchPercentage: 92,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'usr_priya',
    user: {
      _id: 'usr_priya',
      fullName: 'Priya Kulkarni',
      email: 'priya@example.com',
      mobile: '9876543211',
      gender: 'female',
      isVerified: true,
      status: 'active',
    },
    profileId: 'PB-10025',
    age: 24,
    gender: 'female',
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
    biodataUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    biodataFileName: 'Priya_Kulkarni_Biodata.pdf',
    biodataVisibility: 'connections_only',
    primaryPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    ],
    photoVisibility: 'public',
    completionPercentage: 90,
    isVerified: true,
    matchPercentage: 88,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'usr_rohit',
    user: {
      _id: 'usr_rohit',
      fullName: 'Rohit Patil',
      email: 'rohit@example.com',
      mobile: '9876543212',
      gender: 'male',
      isVerified: true,
      status: 'active',
    },
    profileId: 'PB-10026',
    age: 28,
    gender: 'male',
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
    photoVisibility: 'public',
    biodataVisibility: 'public',
    completionPercentage: 85,
    isVerified: true,
    matchPercentage: 85,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'usr_ananya',
    user: {
      _id: 'usr_ananya',
      fullName: 'Ananya Joshi',
      email: 'ananya@example.com',
      mobile: '9876543213',
      gender: 'female',
      isVerified: true,
      status: 'active',
    },
    profileId: 'PB-10027',
    age: 25,
    gender: 'female',
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
    photoVisibility: 'public',
    biodataVisibility: 'public',
    completionPercentage: 88,
    isVerified: true,
    matchPercentage: 86,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'usr_aditya',
    user: {
      _id: 'usr_aditya',
      fullName: 'Aditya Deshmukh',
      email: 'aditya@example.com',
      mobile: '9876543214',
      gender: 'male',
      isVerified: true,
      status: 'active',
    },
    profileId: 'PB-10028',
    age: 29,
    gender: 'male',
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
    photoVisibility: 'public',
    biodataVisibility: 'public',
    completionPercentage: 92,
    isVerified: true,
    matchPercentage: 90,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'usr_sneha',
    user: {
      _id: 'usr_sneha',
      fullName: 'Sneha Shinde',
      email: 'sneha@example.com',
      mobile: '9876543215',
      gender: 'female',
      isVerified: true,
      status: 'active',
    },
    profileId: 'PB-10029',
    age: 23,
    gender: 'female',
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
    photoVisibility: 'public',
    biodataVisibility: 'public',
    completionPercentage: 88,
    isVerified: true,
    matchPercentage: 84,
    createdAt: new Date().toISOString(),
  },
];
