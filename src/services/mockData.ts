export interface ProfileData {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    mobile: string;
    password?: string;
    gender?: 'male' | 'female';
    isVerified: boolean;
    status: 'active' | 'suspended';
    role?: 'user' | 'admin';
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
    maritalStatus?: string;
  };
  biodataUrl?: string;
  biodataFileName?: string;
  biodataVisibility?: 'public' | 'connections_only' | 'private' | string;
  primaryPhoto?: string;
  photos: string[];
  photoVisibility?: 'public' | 'connections_only' | 'private' | string;
  completionPercentage: number;
  isVerified: boolean;
  isFeatured?: boolean;
  matchPercentage?: number;
  createdAt: string;
}

export const initialSuccessStories = [
  {
    id: 'story_1',
    namesEn: 'Suyash & Priya',
    namesMr: 'सुयश आणि प्रिया',
    locationEn: 'Married Dec 2025 • Kolhapur & Pune',
    locationMr: 'विवाह: डिसेंबर २०२५ • कोल्हापूर व पुणे',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
    quoteEn: 'We connected on Pavithra Bandhan and exchanged PDF biodatas securely. Within 3 months, our families met and fixed our wedding! Highly recommend the profile view alerts and privacy controls.',
    quoteMr: 'आम्ही पावित्र्य बंधन द्वारे जोडलो गेलो आणि सुरक्षितपणे PDF बायोडाटा शेअर केला. ३ महिन्यातच आमचे कुटुंब भेटले आणि लग्न जमले!',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'story_2',
    namesEn: 'Rohit & Ananya',
    namesMr: 'रोहित आणि अनन्या',
    locationEn: 'Married Feb 2026 • Mumbai & Nashik',
    locationMr: 'विवाह: फेब्रुवारी २०२६ • मुंबई व नाशिक',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    quoteEn: 'The bilingual Marathi interface and smart caste & profession filters made our search so smooth. Thank you Pavithra Bandhan for helping us find our soulmate!',
    quoteMr: 'मराठी भाषेची सोय आणि सुयोग्य फिल्टरमुळे आमचा शोध अतिशय सोपा झाला. पावित्र्य बंधन चे मनापासून आभार!',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'story_3',
    namesEn: 'Aditya & Sneha',
    namesMr: 'आदित्य आणि स्नेहा',
    locationEn: 'Married Jan 2026 • Sambhajinagar & Satara',
    locationMr: 'विवाह: जानेवारी २०२६ • संभाजीनगर व सातारा',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
    quoteEn: 'Finding an educated medical & finance professional partner was effortless. The view tracker notified me when Sneha viewed my profile!',
    quoteMr: 'शिक्षणाला साजेसा साथीदार शोधणे सोपे झाले. स्नेहाने माझे प्रोफाइल पाहिल्यावर मला लगेच व्ह्यू नोटिफिकेशन मिळाले होते!',
    createdAt: new Date().toISOString(),
  },
];

export const initialProfiles: ProfileData[] = [
  {
    _id: 'usr_suyash',
    user: {
      _id: 'usr_suyash',
      fullName: 'Suyash Narade',
      email: 'suyash@example.com',
      mobile: '9876543210',
      password: 'Password@123',
      gender: 'male',
      isVerified: true,
      status: 'active',
      role: 'user',
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
    college: 'KIT College of Engineering, Kolhapur',
    occupation: 'Software Engineer',
    company: 'Tech Solutions Pvt Ltd',
    income: '₹14 - ₹18 Lakhs p.a.',
    fatherOccupation: 'Business (Retired)',
    motherOccupation: 'Homemaker',
    brothers: 1,
    sisters: 0,
    familyType: 'joint',
    familyValues: 'moderate',
    aboutMe: 'Namaste! I am Suyash, a passionate software engineer based in Kolhapur/Pune. Value family culture and traditional Marathi roots.',
    partnerPreferences: {
      minAge: 21,
      maxAge: 26,
      education: 'Graduate / Post Graduate',
      occupation: 'IT / Banking / Professional',
      location: 'Pune / Kolhapur / Sangli',
      religion: 'Hindu',
      caste: 'Maratha',
      maritalStatus: 'never_married',
    },
    biodataUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    biodataFileName: 'Suyash_Narade_Matrimonial_Biodata.pdf',
    biodataVisibility: 'public',
    primaryPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    ],
    photoVisibility: 'public',
    completionPercentage: 95,
    isVerified: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'usr_priya',
    user: {
      _id: 'usr_priya',
      fullName: 'Priya Kulkarni',
      email: 'priya@example.com',
      mobile: '9876543211',
      password: 'Password@123',
      gender: 'female',
      isVerified: true,
      status: 'active',
      role: 'user',
    },
    profileId: 'PB-10025',
    age: 24,
    gender: 'female',
    height: "5'4\"",
    maritalStatus: 'never_married',
    religion: 'Hindu',
    caste: 'Brahmin',
    subCaste: 'Deshastha',
    motherTongue: 'Marathi',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    education: 'M.Sc Biotechnology',
    college: 'Fergusson College, Pune',
    occupation: 'Research Scientist',
    company: 'Serum Institute of India',
    income: '₹10 - ₹12 Lakhs p.a.',
    fatherOccupation: 'Professor',
    motherOccupation: 'School Principal',
    brothers: 0,
    sisters: 1,
    familyType: 'nuclear',
    familyValues: 'traditional',
    aboutMe: 'Simple, cultured, and family-oriented girl working as a research scientist in Pune.',
    partnerPreferences: {
      minAge: 25,
      maxAge: 30,
      education: 'Post Graduate / Engineer / Doctor',
      occupation: 'Employed / Business',
      location: 'Pune / Mumbai',
      religion: 'Hindu',
      caste: 'Brahmin',
      maritalStatus: 'never_married',
    },
    biodataUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    biodataFileName: 'Priya_Kulkarni_Biodata.pdf',
    biodataVisibility: 'public',
    primaryPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    ],
    photoVisibility: 'public',
    completionPercentage: 90,
    isVerified: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'usr_rohit',
    user: {
      _id: 'usr_rohit',
      fullName: 'Rohit Patil',
      email: 'rohit@example.com',
      mobile: '9876543212',
      password: 'Password@123',
      gender: 'male',
      isVerified: true,
      status: 'active',
      role: 'user',
    },
    profileId: 'PB-10026',
    age: 28,
    gender: 'male',
    height: "5'11\"",
    maritalStatus: 'never_married',
    religion: 'Hindu',
    caste: 'Maratha',
    subCaste: 'Patil',
    motherTongue: 'Marathi',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    education: 'MBA Finance',
    college: 'IIM Indore',
    occupation: 'Investment Banker',
    company: 'HDFC Bank Investment Banking',
    income: '₹22 - ₹28 Lakhs p.a.',
    fatherOccupation: 'Industrialist',
    motherOccupation: 'Homemaker',
    brothers: 1,
    sisters: 1,
    familyType: 'joint',
    familyValues: 'moderate',
    aboutMe: 'Ambitious yet rooted in Maharashtrian culture. Love traveling, cricket, and classical music.',
    partnerPreferences: {
      minAge: 23,
      maxAge: 27,
      education: 'MBA / Engineer / CA',
      location: 'Mumbai / Pune',
      religion: 'Hindu',
      caste: 'Maratha',
    },
    biodataUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    biodataFileName: 'Rohit_Patil_Biodata.pdf',
    biodataVisibility: 'public',
    primaryPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    photos: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80'],
    photoVisibility: 'public',
    completionPercentage: 88,
    isVerified: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'usr_ananya',
    user: {
      _id: 'usr_ananya',
      fullName: 'Ananya Joshi',
      email: 'ananya@example.com',
      mobile: '9876543213',
      password: 'Password@123',
      gender: 'female',
      isVerified: true,
      status: 'active',
      role: 'user',
    },
    profileId: 'PB-10027',
    age: 25,
    gender: 'female',
    height: "5'5\"",
    maritalStatus: 'never_married',
    religion: 'Hindu',
    caste: 'Brahmin',
    subCaste: 'Kokanastha',
    motherTongue: 'Marathi',
    city: 'Nashik',
    state: 'Maharashtra',
    country: 'India',
    education: 'CA (Chartered Accountant)',
    college: 'ICAI Institute',
    occupation: 'Senior Auditor',
    company: 'Big 4 Accounting Firm',
    income: '₹12 - ₹16 Lakhs p.a.',
    fatherOccupation: 'Advocate',
    motherOccupation: 'Bank Manager',
    brothers: 0,
    sisters: 0,
    familyType: 'nuclear',
    familyValues: 'modern',
    aboutMe: 'Chartered Accountant based in Nashik/Mumbai. Passionate about classical Indian dance and reading.',
    partnerPreferences: {
      minAge: 25,
      maxAge: 29,
      education: 'CA / MBA / Engineer / Doctor',
      location: 'Nashik / Mumbai / Pune',
      religion: 'Hindu',
    },
    biodataUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    biodataFileName: 'Ananya_Joshi_Biodata.pdf',
    biodataVisibility: 'public',
    primaryPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    photos: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'],
    photoVisibility: 'public',
    completionPercentage: 92,
    isVerified: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'usr_aditya',
    user: {
      _id: 'usr_aditya',
      fullName: 'Aditya Almane',
      email: 'aditya@example.com',
      mobile: '9876543214',
      password: 'Password@123',
      gender: 'male',
      isVerified: true,
      status: 'active',
      role: 'user',
    },
    profileId: 'PB-53698',
    age: 26,
    gender: 'male',
    height: "5'9\"",
    maritalStatus: 'never_married',
    religion: 'Hindu',
    caste: 'Lingayat',
    subCaste: 'Wani',
    motherTongue: 'Marathi',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    education: 'B.Tech IT',
    occupation: 'Software Professional',
    company: 'Infosys Ltd',
    income: '₹12 - ₹15 Lakhs p.a.',
    fatherOccupation: 'Businessman',
    motherOccupation: 'Teacher',
    brothers: 1,
    sisters: 0,
    familyType: 'joint',
    familyValues: 'moderate',
    aboutMe: 'Software developer working in Hinjewadi Pune. Looking for a well-educated and friendly life partner.',
    partnerPreferences: {
      minAge: 21,
      maxAge: 26,
      education: 'Graduate / Post Graduate',
      location: 'Pune / Satara / Solapur',
    },
    biodataUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    biodataFileName: 'Aditya_Almane_Biodata.pdf',
    biodataVisibility: 'public',
    primaryPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'],
    photoVisibility: 'public',
    completionPercentage: 85,
    isVerified: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'usr_sneha',
    user: {
      _id: 'usr_sneha',
      fullName: 'Sneha More',
      email: 'sneha@example.com',
      mobile: '9876543215',
      password: 'Password@123',
      gender: 'female',
      isVerified: true,
      status: 'active',
      role: 'user',
    },
    profileId: 'PB-10029',
    age: 23,
    gender: 'female',
    height: "5'3\"",
    maritalStatus: 'never_married',
    religion: 'Hindu',
    caste: '96 Kuli Maratha',
    subCaste: 'More',
    motherTongue: 'Marathi',
    city: 'Satara',
    state: 'Maharashtra',
    country: 'India',
    education: 'MBBS Doctor',
    college: 'BJ Government Medical College, Pune',
    occupation: 'Resident Doctor',
    company: 'Sahyadri Super Speciality Hospital',
    income: '₹15 - ₹18 Lakhs p.a.',
    fatherOccupation: 'Class 1 Officer (MPSC)',
    motherOccupation: 'Doctor',
    brothers: 0,
    sisters: 1,
    familyType: 'nuclear',
    familyValues: 'moderate',
    aboutMe: 'Doctor by profession with a warm heart. Looking for a doctor or professional partner who respects family values.',
    partnerPreferences: {
      minAge: 25,
      maxAge: 30,
      education: 'Doctor (MD/MS/MBBS) / IAS / Engineer',
      location: 'Satara / Pune / Mumbai',
    },
    biodataUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    biodataFileName: 'Dr_Sneha_More_Biodata.pdf',
    biodataVisibility: 'public',
    primaryPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    photos: ['https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'],
    photoVisibility: 'public',
    completionPercentage: 94,
    isVerified: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
];
