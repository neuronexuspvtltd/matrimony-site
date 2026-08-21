import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { fetchApi } from '../services/api';
import { ProfileCard } from '../components/ProfileCard';
import cinematicHero from '../assets/cinematic_hero.jpg';
import successCouple1 from '../assets/success_couple_1.jpg';
import successCouple2 from '../assets/success_couple_2.jpg';
import {
  Sparkles,
  ShieldCheck,
  FileCheck2,
  Users,
  Search,
  Heart,
  ChevronRight,
  Globe2,
  BellRing,
  Star,
  Award,
  Quote,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [featuredProfiles, setFeaturedProfiles] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/search/featured')
      .then((data) => setFeaturedProfiles(data || []))
      .catch((err) => console.error('Error fetching featured profiles:', err));
  }, []);

  const successStories = [
    {
      id: 1,
      namesEn: 'Suyash & Priya',
      namesMr: 'सुयश आणि प्रिया',
      locationEn: 'Married Dec 2025 • Kolhapur & Pune',
      locationMr: 'विवाह: डिसेंबर २०२५ • कोल्हापूर व पुणे',
      image: successCouple1,
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

          {/* Primary Action Buttons */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
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
              {/* Couple Photo */}
              <div className="relative aspect-[4/3] bg-ivory-200 overflow-hidden">
                <img
                  src={story.image}
                  alt={story.namesEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="font-serif text-xl font-bold">
                    {language === 'EN' ? story.namesEn : story.namesMr}
                  </h3>
                  <p className="text-[11px] text-ivory-200 font-medium">
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
              <div className="font-serif text-4xl sm:text-5xl font-bold text-white">10,000+</div>
              <div className="text-xs font-medium text-gold-400 uppercase tracking-wider">{t('statMembers')}</div>
            </div>

            <div className="space-y-2">
              <div className="font-serif text-4xl sm:text-5xl font-bold text-white">4,500+</div>
              <div className="text-xs font-medium text-gold-400 uppercase tracking-wider">{t('statActive')}</div>
            </div>

            <div className="space-y-2">
              <div className="font-serif text-4xl sm:text-5xl font-bold text-white">1,800+</div>
              <div className="text-xs font-medium text-gold-400 uppercase tracking-wider">{t('statConnections')}</div>
            </div>

            <div className="space-y-2">
              <div className="font-serif text-4xl sm:text-5xl font-bold text-white">50+</div>
              <div className="text-xs font-medium text-gold-400 uppercase tracking-wider">{t('statCities')}</div>
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
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
