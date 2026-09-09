import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../services/api';
import { ProfileCard } from '../components/ProfileCard';
import cinematicHero from '../assets/cinematic_hero.jpg';
import heroBanner from '../assets/hero_banner.jpg';
import successCouple1 from '../assets/success_couple_1.jpg';
import successCouple2 from '../assets/success_couple_2.jpg';
import suyashPriyaNightCover from '../assets/suyash_priya_night_cover.jpg';
import suyashPriyaGoldenKiss from '../assets/suyash_priya_golden_kiss.jpg';
import suyashPriya1 from '../assets/suyash_priya_1.jpg';
import suyashPriya2 from '../assets/suyash_priya_2.jpg';
import suyashPriya3 from '../assets/suyash_priya_3.jpg';
import suyashPriya4 from '../assets/suyash_priya_4.jpg';
import suyashPriya5 from '../assets/suyash_priya_5.png';
import {
  Sparkles,
  ShieldCheck,
  FileCheck2,
  Users,
  Search,
  Heart,
  ChevronRight,
  ChevronLeft,
  Globe2,
  BellRing,
  Star,
  Award,
  Quote,
  Lock,
  Camera,
  X,
  Images,
  MapPin,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [featuredProfiles, setFeaturedProfiles] = useState<any[]>([]);
  const [siteContent, setSiteContent] = useState<any>({
    statMembersCount: '10,000+',
    statMembersLabelEn: 'REGISTERED MEMBERS',
    statMembersLabelMr: 'नोंदणीकृत सदस्य',
    statActiveCount: '4,500+',
    statActiveLabelEn: 'ACTIVE PROFILES',
    statActiveLabelMr: 'सक्रिय प्रोफाईल्स',
    statConnectionsCount: '1,800+',
    statConnectionsLabelEn: 'SUCCESSFUL CONNECTIONS',
    statConnectionsLabelMr: 'यशस्वी जुळलेले बंध',
    statCitiesCount: '50+',
    statCitiesLabelEn: 'CITIES COVERED',
    statCitiesLabelMr: 'शहरे समाविष्ट',
  });

  // 🖼️ Multi-photo Lightbox Gallery State
  const [selectedStory, setSelectedStory] = useState<any | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pb_site_content_data');
      if (raw) {
        setSiteContent(JSON.parse(raw));
      }
    } catch (e) {}

    fetch('/admin/site-content')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.statMembersCount) {
          setSiteContent(data);
        }
      })
      .catch(() => {});

    fetchApi('/search/featured')
      .then((data) => setFeaturedProfiles(data || []))
      .catch((err) => console.error('Error fetching featured profiles:', err));
  }, []);

  // Keyboard navigation for photo gallery (Left/Right arrow & Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedStory) return;
      const photos = selectedStory.photos || [selectedStory.image];
      if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) => (prev + 1) % photos.length);
      } else if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
      } else if (e.key === 'Escape') {
        setSelectedStory(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedStory]);

  const handleOpenGallery = (story: any, initialIndex: number = 0) => {
    setSelectedStory(story);
    setActivePhotoIndex(initialIndex);
  };

  const successStories = [
    {
      id: 1,
      namesEn: 'Suyash & Priya',
      namesMr: 'सुयश आणि प्रिया',
      locationEn: 'Married Dec 2025 • Kolhapur & Pune',
      locationMr: 'विवाह: डिसेंबर २०२५ • कोल्हापूर व पुणे',
      image: suyashPriyaNightCover,
      photos: [
        suyashPriyaNightCover,
        suyashPriyaGoldenKiss,
        suyashPriya1,
        suyashPriya2,
        suyashPriya3,
        suyashPriya4,
        suyashPriya5,
      ],
      photoTitlesEn: [
        'Grand Night Reception & Wedding Mandap Lights',
        'Golden Hour Forehead Kiss Ceremony',
        'Post-Wedding Shoot with Sunglasses',
        'Romantic Forehead Kiss Close-Up',
        'Traditional Bridal & Groom Moment',
        'Royal Red Lehenga Bride Pose',
        'Haldi Ceremony Floral Look',
      ],
      photoTitlesMr: [
        'भव्य नाईट रिसेप्शन व रोषणाई',
        'गोल्डन अवर भाळ चुंबन सोहळा',
        'विवाहानंतरचे स्टायलिश फोटोशूट',
        'प्रेमळ भाळ चुंबन क्लोज-अप',
        'पारंपारिक वधू-वर प्रेमळ क्षण',
        'शाही लाल लेहंगा फोटोशूट',
        'हळदी सोहळ्यातील सौंदर्य',
      ],
      quoteEn: 'We connected on V Brothers Marriage Bureau and exchanged PDF biodatas securely. Within 3 months, our families met and fixed our wedding! Highly recommend the profile view alerts and privacy controls.',
      quoteMr: 'आम्ही व्ही ब्रदर्स विवाह संस्थे द्वारे जोडलो गेलो आणि सुरक्षितपणे PDF बायोडाटा शेअर केला. ३ महिन्यातच आमचे कुटुंब भेटले आणि लग्न जमले!',
    },
    {
      id: 2,
      namesEn: 'Rohit & Ananya',
      namesMr: 'रोहित आणि अनन्या',
      locationEn: 'Married Feb 2026 • Mumbai & Nashik',
      locationMr: 'विवाह: फेब्रुवारी २०२६ • मुंबई व नाशिक',
      image: successCouple2,
      photos: [
        successCouple2,
        cinematicHero,
        heroBanner,
        successCouple1,
      ],
      photoTitlesEn: ['Traditional Maharashtrian Marriage', 'Pre-Wedding Shoot', 'Sangeet Night', 'Wedding Reception'],
      photoTitlesMr: ['पारंपारिक मराठी लग्न', 'प्री-वेडिंग फोटोशूट', 'संगीत संध्याकाळ', 'लग्न रिसेप्शन'],
      quoteEn: 'The bilingual Marathi interface and smart caste & profession filters made our search so smooth. Thank you V Brothers Marriage Bureau for helping us find our soulmate!',
      quoteMr: 'मराठी भाषेची सोय आणि सुयोग्य फिल्टरमुळे आमचा शोध अतिशय सोपा झाला. व्ही ब्रदर्स विवाह संस्थेचे मनापासून आभार!',
    },
    {
      id: 3,
      namesEn: 'Aditya & Sneha',
      namesMr: 'आदित्य आणि स्नेहा',
      locationEn: 'Married Jan 2026 • Sambhajinagar & Satara',
      locationMr: 'विवाह: जानेवारी २०२६ • संभाजीनगर व सातारा',
      image: cinematicHero,
      photos: [
        cinematicHero,
        heroBanner,
        successCouple1,
        successCouple2,
      ],
      photoTitlesEn: ['Palace Wedding Ceremony', 'Mandap Rituals', 'Ring Exchange', 'Reception Celebration'],
      photoTitlesMr: ['रॉयल पॅलेस वेडिंग', 'मंडप विधी', 'अंगठी सोहळा', 'रिसेप्शन उत्सव'],
      quoteEn: 'Finding an educated medical & finance professional partner was effortless. The view tracker notified me when Sneha viewed my profile!',
      quoteMr: 'शिक्षणाला साजेसा साथीदार शोधणे सोपे झाले. स्नेहाने माझे प्रोफाइल पाहिल्यावर मला लगेच व्ह्यू नोटिफिकेशन मिळाले होते!',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* Shaadi-Style Full-Bleed Hero Section (Without Search Input Box) */}
      <section className="relative min-h-[82vh] flex flex-col justify-between overflow-hidden bg-brand-950 text-white">
        
        {/* Background Image with Dark Vignette & Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={cinematicHero}
            alt="Choose Your Forever - Matrimony"
            className="w-full h-full object-cover object-center scale-105 transform filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/40 to-black/50"></div>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
        </div>

        {/* Top Spacer */}
        <div className="pt-12"></div>

        {/* Centered Hero Content Overlay */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-6 py-16">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-gold-400/50 text-gold-300 text-xs font-semibold backdrop-blur-md shadow-md">
            <Sparkles className="w-4 h-4 text-gold-400 fill-gold-400" />
            <span>{language === 'EN' ? 'Trusted Matrimonial Platform' : 'विश्वासू विवाह व्यासपीठ'}</span>
          </div>

          {/* Shaadi-style Centered Bold Headline */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-lg leading-tight">
            {language === 'EN' ? 'Choose Your Forever' : 'तुमच्या आयुष्याचा साथीदार शोधा'}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-2xl text-ivory-200 font-light max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            {language === 'EN'
              ? 'Find love on your terms with thousands of verified profiles'
              : 'तुमच्या आवडीनुसार आणि विश्वासाने शोधा सुयोग्य स्थळे'}
          </p>

          {/* 📍 Primary Focus Districts Highlight Bar */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-400/15 border border-gold-400/40 text-gold-300 text-xs font-semibold backdrop-blur-md shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-gold-400 animate-bounce" />
              <span>
                {language === 'EN'
                  ? 'Main Focus Districts: Sangli • Solapur • Satara • Kolhapur'
                  : 'प्रमुख कार्यक्षेत्र (जिल्हे): सांगली • सोलापूर • सातारा • कोल्हापूर'}
              </span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-gold-400 text-brand-950 font-bold hover:bg-gold-300 shadow-2xl hover:scale-105 transition-all text-sm flex items-center justify-center gap-2 group"
                >
                  <span>{language === 'EN' ? 'My Dashboard' : 'माझे डॅशबोर्ड'}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/search"
                  className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-black/40 border-2 border-white/80 text-white font-semibold hover:bg-white/20 backdrop-blur-md transition-all text-sm flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4 text-gold-300" />
                  <span>{t('heroCtaExplore')}</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-gold-400 text-brand-950 font-bold hover:bg-gold-300 shadow-2xl hover:scale-105 transition-all text-sm flex items-center justify-center gap-2 group"
                >
                  <span>{t('heroCtaRegister')}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/search"
                  className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-black/40 border-2 border-white/80 text-white font-semibold hover:bg-white/20 backdrop-blur-md transition-all text-sm flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4 text-gold-300" />
                  <span>{t('heroCtaExplore')}</span>
                </Link>
              </>
            )}
          </div>

        </div>

        {/* Shaadi-style Bottom Trust Stats Overlay Bar */}
        <div className="relative z-10 bg-black/70 backdrop-blur-md border-t border-white/10 py-4 text-xs font-medium text-ivory-200">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 text-center">
            
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-gold-400" />
              <span className="font-semibold text-white">#1 Matchmaking Service</span>
            </div>

            <div className="hidden md:block text-gold-500/50">|</div>

            <div className="flex items-center gap-1.5">
              <div className="flex text-gold-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-gold-400" />
                ))}
              </div>
              <span>
                {language === 'EN' ? 'Ratings by 2.4 Lakh Users' : '२.४ लाख वापरकर्त्यांची रेटिंग'}
              </span>
            </div>

            <div className="hidden md:block text-gold-500/50">|</div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                {language === 'EN' ? '10,000+ Verified Profiles & PDF Biodatas' : '१०,०००+ सत्यापित प्रोफाईल्स व PDF बायोडाटा'}
              </span>
            </div>

            <div className="hidden md:block text-gold-500/50">|</div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold-400" />
              <span className="font-semibold text-gold-200">
                {language === 'EN'
                  ? 'Key Regions: Sangli • Solapur • Satara • Kolhapur'
                  : 'प्रमुख भाग: सांगली • सोलापूर • सातारा • कोल्हापूर'}
              </span>
            </div>

          </div>
        </div>

      </section>

      {/* Success Stories Section (Placed directly below Hero Section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-900 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-brand-700 text-brand-700" />
            <span>{language === 'EN' ? '1,800+ Happy Marriages' : '१,८००+ आनंदी दांपत्ये'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
            {language === 'EN' ? 'Success Stories' : 'यशस्वी विवाह कथा'}
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm">
            {language === 'EN'
              ? 'Real Maharashtrian couples who met and built their soulmate connections on V Brothers Marriage Bureau'
              : 'व्ही ब्रदर्स विवाह संस्थे द्वारे एकत्र आलेली आणि आनंदी संसार मांडणारी जोडपी'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {successStories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-3xl border border-ivory-300 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* Couple Photo Container with Gallery Trigger */}
              <div
                onClick={() => handleOpenGallery(story, 0)}
                className="relative aspect-[4/3] bg-ivory-200 overflow-hidden cursor-pointer group"
              >
                <img
                  src={story.image}
                  alt={story.namesEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Camera Badge Overlay */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-gold-300 border border-gold-400/40 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md group-hover:bg-gold-400 group-hover:text-brand-950 transition-all">
                  <Camera className="w-3.5 h-3.5" />
                  <span>
                    {language === 'EN'
                      ? `${(story.photos || [story.image]).length} Photos`
                      : `${(story.photos || [story.image]).length} फोटो`}
                  </span>
                </div>

                {/* Couple Info Overlay */}
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="font-serif text-xl font-bold flex items-center justify-between">
                    <span>{language === 'EN' ? story.namesEn : story.namesMr}</span>
                    <span className="text-[10px] text-gold-300 font-sans font-semibold bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-xs group-hover:bg-gold-400 group-hover:text-brand-950 transition-colors">
                      {language === 'EN' ? 'View Gallery ➔' : 'गॅलरी पहा ➔'}
                    </span>
                  </h3>
                  <p className="text-[11px] text-ivory-200 font-medium mt-0.5">
                    {language === 'EN' ? story.locationEn : story.locationMr}
                  </p>
                </div>
              </div>

              {/* Story Content & Testimonial */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between bg-white">
                <div className="space-y-3">
                  <div className="flex text-gold-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-gold-400" />
                    ))}
                  </div>

                  <p className="text-xs text-gray-700 italic leading-relaxed relative">
                    <Quote className="w-5 h-5 text-gold-300 absolute -top-2 -left-1 opacity-40 -z-0" />
                    <span className="relative z-10">
                      "{language === 'EN' ? story.quoteEn : story.quoteMr}"
                    </span>
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Couple
                  </span>
                  <span className="text-brand-900 font-bold">V Brothers Marriage Bureau</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-ivory-200/60 py-16 border-y border-ivory-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950 mb-3">
              {t('whyTitle')}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              {t('whySubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-ivory-300 space-y-3">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
              <h4 className="font-serif font-bold text-gray-900 text-base">{t('why1Title')}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{t('why1Desc')}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-ivory-300 space-y-3">
              <FileCheck2 className="w-8 h-8 text-gold-600" />
              <h4 className="font-serif font-bold text-gray-900 text-base">{t('why2Title')}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{t('why2Desc')}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-ivory-300 space-y-3">
              <BellRing className="w-8 h-8 text-brand-700" />
              <h4 className="font-serif font-bold text-gray-900 text-base">{t('why3Title')}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{t('why3Desc')}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-ivory-300 space-y-3">
              <Globe2 className="w-8 h-8 text-brand-900" />
              <h4 className="font-serif font-bold text-gray-900 text-base">{t('why4Title')}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{t('why4Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Profiles */}
      {featuredProfiles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Guest Privacy Banner */}
          {!user && (
            <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-950 via-brand-900 to-brand-950 text-ivory-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md border border-gold-400/30">
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <div className="w-10 h-10 rounded-full bg-gold-400 text-brand-950 flex items-center justify-center shrink-0 shadow-sm">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-gold-300 text-sm sm:text-base">
                    {language === 'MR' ? '🔒 सदस्यांच्या गोपनीयतेसाठी सुरक्षित प्रोफाईल्स' : '🔒 Privacy Protected Member Profiles'}
                  </h4>
                  <p className="text-xs text-ivory-200 mt-0.5">
                    {language === 'MR' ? 'संपूर्ण प्रोफाईल आणि फोटो पाहण्यासाठी कृपया साइन इन करा किंवा मोफत नोंदणी करा.' : 'Full profile details, photos, and contact options are visible exclusively to signed-in members.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-center">
                <Link to="/login" className="px-5 py-2.5 bg-gold-400 text-brand-950 font-bold text-xs rounded-xl hover:bg-gold-300 transition-all shadow-sm">
                  {language === 'MR' ? 'लॉगिन करा' : 'Sign In'}
                </Link>
                <Link to="/register" className="px-5 py-2.5 bg-brand-800 text-gold-300 font-bold text-xs rounded-xl border border-gold-400/30 hover:bg-brand-700 transition-all">
                  {language === 'MR' ? 'मोफत नोंदणी' : 'Register Free'}
                </Link>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="font-serif text-3xl font-bold text-brand-950">
                {t('featuredTitle')}
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                {t('featuredSubtitle')}
              </p>
            </div>
            <Link
              to="/search"
              className="text-xs font-semibold text-brand-900 hover:text-brand-700 flex items-center gap-1"
            >
              <span>{t('heroCtaExplore')}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProfiles.slice(0, 3).map((prof) => (
              <ProfileCard key={prof._id} profile={prof} />
            ))}
          </div>
        </section>
      )}

      {/* Live Statistics Counter Section */}
      <section className="bg-brand-950 text-gold-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-brand-900">
            <div className="space-y-2">
              <div className="font-serif text-4xl sm:text-5xl font-bold text-white">
                {siteContent.statMembersCount || '10,000+'}
              </div>
              <div className="text-xs font-medium text-gold-400 uppercase tracking-wider">
                {language === 'MR'
                  ? (siteContent.statMembersLabelMr || 'नोंदणीकृत सदस्य')
                  : (siteContent.statMembersLabelEn || 'REGISTERED MEMBERS')}
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-serif text-4xl sm:text-5xl font-bold text-white">
                {siteContent.statActiveCount || '4,500+'}
              </div>
              <div className="text-xs font-medium text-gold-400 uppercase tracking-wider">
                {language === 'MR'
                  ? (siteContent.statActiveLabelMr || 'सक्रिय प्रोफाईल्स')
                  : (siteContent.statActiveLabelEn || 'ACTIVE PROFILES')}
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-serif text-4xl sm:text-5xl font-bold text-white">
                {siteContent.statConnectionsCount || '1,800+'}
              </div>
              <div className="text-xs font-medium text-gold-400 uppercase tracking-wider">
                {language === 'MR'
                  ? (siteContent.statConnectionsLabelMr || 'यशस्वी जुळलेले बंध')
                  : (siteContent.statConnectionsLabelEn || 'SUCCESSFUL CONNECTIONS')}
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-serif text-4xl sm:text-5xl font-bold text-white">
                {siteContent.statCitiesCount || '50+'}
              </div>
              <div className="text-xs font-medium text-gold-400 uppercase tracking-wider">
                {language === 'MR'
                  ? (siteContent.statCitiesLabelMr || 'शहरे समाविष्ट')
                  : (siteContent.statCitiesLabelEn || 'CITIES COVERED')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 to-brand-950 rounded-3xl p-10 sm:p-16 text-center text-white space-y-6 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto relative z-10 space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gold-300">
              {t('ctaTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-ivory-200">
              {t('ctaSubtitle')}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gold-400 text-brand-950 font-bold hover:bg-gold-300 shadow-md transition-all"
                  >
                    {language === 'EN' ? 'Go to Dashboard' : 'डॅशबोर्डवर जा'}
                  </Link>
                  <Link
                    to="/search"
                    className="w-full sm:w-auto px-8 py-4 rounded-xl border border-gold-400/50 text-gold-300 font-semibold hover:bg-white/10 transition-colors"
                  >
                    {t('heroCtaExplore')}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gold-400 text-brand-950 font-bold hover:bg-gold-300 shadow-md transition-all"
                  >
                    {t('heroCtaRegister')}
                  </Link>
                  <Link
                    to="/search"
                    className="w-full sm:w-auto px-8 py-4 rounded-xl border border-gold-400/50 text-gold-300 font-semibold hover:bg-white/10 transition-colors"
                  >
                    {t('heroCtaExplore')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 🖼️ SUCCESS STORY MULTI-PHOTO GALLERY LIGHTBOX MODAL */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          
          {/* Modal Top Header */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-4 max-w-6xl mx-auto w-full">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="bg-gold-400/20 text-gold-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-gold-400/30">
                  {language === 'EN' ? 'Success Story Gallery' : 'यशस्वी कहाणी फोटो गॅलरी'}
                </span>
                <span className="text-xs text-gray-300 font-mono">
                  {activePhotoIndex + 1} / {(selectedStory.photos || [selectedStory.image]).length}
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                {language === 'EN' ? selectedStory.namesEn : selectedStory.namesMr}
              </h2>
              <p className="text-xs text-ivory-200">
                {language === 'EN' ? selectedStory.locationEn : selectedStory.locationMr}
              </p>
            </div>

            <button
              onClick={() => setSelectedStory(null)}
              className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              title="Close Gallery (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Photo View with Nav Arrows */}
          <div className="relative flex-1 flex items-center justify-center my-4 max-w-5xl mx-auto w-full overflow-hidden">
            
            {/* Previous Arrow */}
            {(selectedStory.photos || [selectedStory.image]).length > 1 && (
              <button
                onClick={() =>
                  setActivePhotoIndex(
                    (prev) => (prev - 1 + selectedStory.photos.length) % selectedStory.photos.length
                  )
                }
                className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/60 text-white hover:bg-gold-400 hover:text-brand-950 transition-all border border-white/20 shadow-xl cursor-pointer"
                title="Previous Photo (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Main Active Image */}
            <div className="relative max-h-[65vh] w-full flex flex-col items-center justify-center">
              <img
                src={(selectedStory.photos || [selectedStory.image])[activePhotoIndex]}
                alt={`${selectedStory.namesEn} - Photo ${activePhotoIndex + 1}`}
                className="max-h-[60vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10 transition-all duration-300"
              />

              {/* Caption Title below Image */}
              {selectedStory.photoTitlesEn && selectedStory.photoTitlesEn[activePhotoIndex] && (
                <div className="mt-3 px-4 py-1.5 bg-black/70 rounded-full border border-gold-400/30 text-gold-300 text-xs font-semibold text-center backdrop-blur-md">
                  {language === 'EN'
                    ? selectedStory.photoTitlesEn[activePhotoIndex]
                    : selectedStory.photoTitlesMr[activePhotoIndex]}
                </div>
              )}
            </div>

            {/* Next Arrow */}
            {(selectedStory.photos || [selectedStory.image]).length > 1 && (
              <button
                onClick={() =>
                  setActivePhotoIndex((prev) => (prev + 1) % selectedStory.photos.length)
                }
                className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/60 text-white hover:bg-gold-400 hover:text-brand-950 transition-all border border-white/20 shadow-xl cursor-pointer"
                title="Next Photo (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Strip */}
          <div className="max-w-4xl mx-auto w-full pt-2 border-t border-white/10">
            <div className="flex items-center justify-center gap-3 overflow-x-auto py-2">
              {(selectedStory.photos || [selectedStory.image]).map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 transition-all cursor-pointer border-2 ${
                    activePhotoIndex === idx
                      ? 'border-gold-400 scale-105 ring-2 ring-gold-400/50 shadow-lg'
                      : 'border-white/20 opacity-50 hover:opacity-100 hover:scale-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  {activePhotoIndex === idx && (
                    <div className="absolute inset-0 bg-gold-400/10 border-2 border-gold-400"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
