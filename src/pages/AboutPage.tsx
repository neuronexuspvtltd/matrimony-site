import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import cinematicHero from '../assets/cinematic_hero.jpg';
import {
  Sparkles,
  ShieldCheck,
  Heart,
  Users,
  FileCheck2,
  Globe2,
  Award,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-16 pb-16">
      
      {/* About Hero Banner */}
      <section className="relative py-20 bg-brand-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img src={cinematicHero} alt="About Us" className="w-full h-full object-cover filter brightness-75" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-950/80 via-brand-950 to-brand-950"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-400/20 text-gold-300 text-xs font-semibold border border-gold-400/30">
            <Sparkles className="w-3.5 h-3.5 fill-gold-400" />
            <span>{language === 'EN' ? 'About V Brothers Marriage Bureau' : 'व्ही ब्रदर्स विवाह संस्था बद्दल'}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gold-300">
            {language === 'EN' ? 'Where Traditions Meet Modern Trust' : 'पारंपारिक मूल्ये आणि आधुनिक विश्वासाचा संगम'}
          </h1>

          <p className="text-sm sm:text-base text-ivory-200 max-w-2xl mx-auto leading-relaxed">
            {language === 'EN'
              ? 'V Brothers Marriage Bureau is Maharashtra’s premier matrimonial platform dedicated to creating meaningful, authentic, and lifelong connections for families worldwide.'
              : 'व्ही ब्रदर्स विवाह संस्था हे महाराष्ट्रातील अग्रगण्य विवाह व्यासपीठ आहे जे जगभरातील कुटुंबांसाठी प्रामाणिक आणि पवित्र नाते जोडण्यासाठी समर्पित आहे.'}
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-ivory-300 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-900/10 text-brand-900 flex items-center justify-center">
              <Heart className="w-6 h-6 fill-brand-900/20 text-brand-900" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-brand-950">
              {language === 'EN' ? 'Our Mission' : 'आमचे उद्दिष्ट (Mission)'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              {language === 'EN'
                ? 'To simplify the matrimonial search process for respect-driven families while guaranteeing 100% profile authenticity, strict PDF biodata privacy, and instant profile-view notifications.'
                : 'कुटुंबांसाठी सुयोग्य जीवनसाथी शोधण्याची प्रक्रिया सोपी करणे, १००% पडताळणी केलेले प्रोफाईल्स, बायोडाटा सुरक्षितता आणि पारदर्शकता प्रदान करणे.'}
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-ivory-300 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-800 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-brand-950">
              {language === 'EN' ? 'Our Vision' : 'आमचा दृष्टिकोन (Vision)'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              {language === 'EN'
                ? 'To be the most trusted bilingual matrimonial platform in India, empowering members with simple technology, complete privacy, and authentic cultural harmony.'
                : 'भारतातील सर्वात विश्वासू द्विभाषिक (इंग्रजी व मराठी) विवाह संस्था व्यासपीठ बनणे, जे आधुनिक तंत्रज्ञान आणि कौटुंबिक संस्कृतीचा मेळ घालते.'}
            </p>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-ivory-200/60 py-16 border-y border-ivory-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-serif text-3xl font-bold text-brand-950">
              {language === 'EN' ? 'Why Families Trust Us' : 'कुटुंब आमच्यावर का विश्वास ठेवतात'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              {language === 'EN' ? 'Built on pillars of safety, privacy, and simplicity' : 'सुरक्षितता, गोपनीयता आणि सोपेपणा या तत्त्वांवर आधारित'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-ivory-300 space-y-3">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
              <h4 className="font-serif font-bold text-gray-900 text-base">
                {language === 'EN' ? 'Verified Profiles' : 'सत्यापित प्रोफाईल्स'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {language === 'EN'
                  ? 'Manual & phone verification for every registered member.'
                  : 'प्रत्येक सदस्याची फोन व ईमेलद्वारे पडताळणी.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-ivory-300 space-y-3">
              <FileCheck2 className="w-8 h-8 text-gold-600" />
              <h4 className="font-serif font-bold text-gray-900 text-base">
                {language === 'EN' ? 'PDF Biodata Control' : 'PDF बायोडाटा नियंत्रण'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {language === 'EN'
                  ? 'Share your PDF biodata only with approved connections.'
                  : 'बायोडाटा केवळ तुम्ही मंजूर केलेल्या सदस्यांनाच दिसेल.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-ivory-300 space-y-3">
              <Globe2 className="w-8 h-8 text-brand-700" />
              <h4 className="font-serif font-bold text-gray-900 text-base">
                {language === 'EN' ? 'English & Marathi' : 'द्विभाषिक सुविधा'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {language === 'EN'
                  ? 'Complete interface translation with instant language switching.'
                  : 'इंग्रजी आणि मराठी भाषेत सोयीनुसार स्विच करण्याची सोय.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-ivory-300 space-y-3">
              <Users className="w-8 h-8 text-brand-900" />
              <h4 className="font-serif font-bold text-gray-900 text-base">
                {language === 'EN' ? 'Profile View Alerts' : 'व्ह्यू नोटिफिकेशन्स'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {language === 'EN'
                  ? 'Instant notification whenever someone views your profile.'
                  : 'तुमचे प्रोफाइल कोणी पाहिले याची तत्काळ सूचना.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-900 text-white rounded-3xl p-10 sm:p-14 text-center space-y-6 shadow-xl">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gold-300">
            {t('ctaTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-ivory-200 max-w-xl mx-auto">
            {t('ctaSubtitle')}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-gold-400 text-brand-950 font-bold rounded-xl text-xs hover:bg-gold-300"
            >
              {t('heroCtaRegister')}
            </Link>
            <Link
              to="/search"
              className="px-8 py-3.5 border border-gold-400/40 text-gold-300 font-semibold rounded-xl text-xs hover:bg-white/10"
            >
              {t('heroCtaExplore')}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
