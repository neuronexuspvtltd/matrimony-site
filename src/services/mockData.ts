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
    quoteEn: 'We connected on V Brothers Marriage Bureau and exchanged PDF biodatas securely. Within 3 months, our families met and fixed our wedding! Highly recommend the profile view alerts and privacy controls.',
    quoteMr: 'आम्ही व्ही ब्रदर्स विवाह संस्थे द्वारे जोडलो गेलो आणि सुरक्षितपणे PDF बायोडाटा शेअर केला. ३ महिन्यातच आमचे कुटुंब भेटले आणि लग्न जमले!',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'story_2',
    namesEn: 'Rohit & Ananya',
    namesMr: 'रोहित आणि अनन्या',
    locationEn: 'Married Feb 2026 • Mumbai & Nashik',
    locationMr: 'विवाह: फेब्रुवारी २०२६ • मुंबई व नाशिक',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    quoteEn: 'The bilingual Marathi interface and smart caste & profession filters made our search so smooth. Thank you V Brothers Marriage Bureau for helping us find our soulmate!',
    quoteMr: 'मराठी भाषेची सोय आणि सुयोग्य फिल्टरमुळे आमचा शोध अतिशय सोपा झाला. व्ही ब्रदर्स विवाह संस्थेचे मनापासून आभार!',
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

export const initialProfiles: ProfileData[] = [];

