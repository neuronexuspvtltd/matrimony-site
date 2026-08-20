import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Shield, Heart, Globe, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <footer className="bg-brand-950 text-ivory-200 py-8 md:pt-16 md:pb-8 border-t border-gold-600/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grid: 2 cols on Mobile (compact), 4 cols on Desktop (untouched) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 pb-6 md:pb-12 border-b border-brand-900">
          
          {/* Brand Col: Spans 2 cols on mobile for a neat centered/compact layout */}
          <div className="col-span-2 md:col-span-1 space-y-3 md:space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gold-400/20 border border-gold-400 flex items-center justify-center text-gold-300 shrink-0">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 fill-gold-400 stroke-brand-950" />
              </div>
              <span className="font-serif text-xl md:text-2xl font-bold text-gold-300 tracking-tight">
                {t('brandName')}
              </span>
            </div>
            <p className="text-[11px] md:text-xs text-ivory-300 leading-relaxed max-w-xs">
              {t('brandSubtitle')}
            </p>
            <div>
              <button
                onClick={toggleLanguage}
                className="inline-flex items-center gap-1.5 text-[11px] md:text-xs font-semibold px-3 py-1 rounded-full border border-gold-500/40 text-gold-300 hover:bg-brand-900 transition-colors cursor-pointer"
              >
                <Globe className="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span>Language / भाषा: <strong className="text-white">{language === 'EN' ? 'English' : 'मराठी'}</strong></span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 md:space-y-4">
            <h4 className="font-serif text-xs md:text-sm font-semibold text-gold-400 uppercase tracking-wider">
              {language === 'EN' ? 'Quick Links' : 'महत्वाच्या लिंक्स'}
            </h4>
            <ul className="space-y-1.5 md:space-y-2 text-[11px] md:text-xs text-ivory-300">
              <li>
                <Link to="/" className="hover:text-gold-300 transition-colors">{t('navHome')}</Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-gold-300 transition-colors">{t('navMatches')}</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold-300 transition-colors">{t('footerAbout')}</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-300 transition-colors">{t('footerContact')}</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-gold-300 transition-colors">{t('navRegister')}</Link>
              </li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div className="space-y-2 md:space-y-4">
            <h4 className="font-serif text-xs md:text-sm font-semibold text-gold-400 uppercase tracking-wider">
              {t('footerSafety')}
            </h4>
            <ul className="space-y-1.5 md:space-y-2 text-[11px] md:text-xs text-ivory-300">
              <li className="flex items-center gap-1.5">
                <Shield className="w-3 h-3 md:w-3.5 md:h-3.5 text-gold-400 shrink-0" />
                <span>{language === 'EN' ? '100% Verified Profiles' : '१००% पडताळणी স্থळे'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Heart className="w-3 h-3 md:w-3.5 md:h-3.5 text-brand-400 shrink-0" />
                <span>{language === 'EN' ? 'Strict PDF Privacy' : 'बायोडाटा सुरक्षा'}</span>
              </li>
              <li>
                <a href="/privacy" className="hover:text-gold-300 transition-colors underline-offset-2 hover:underline">{t('footerPrivacy')}</a>
              </li>
              <li>
                <a href="/terms" className="hover:text-gold-300 transition-colors underline-offset-2 hover:underline">{t('footerTerms')}</a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="col-span-2 md:col-span-1 space-y-2 md:space-y-4 pt-2 md:pt-0">
            <h4 className="font-serif text-xs md:text-sm font-semibold text-gold-400 uppercase tracking-wider">
              {t('footerContact')}
            </h4>
            <div className="flex flex-wrap md:flex-col items-center md:items-start gap-x-4 gap-y-1.5 text-[11px] md:text-xs text-ivory-300">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gold-400" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gold-400" />
                <span>support@pavithrabandhan.com</span>
              </div>
              <p className="text-[10px] md:text-[11px] text-ivory-400 w-full pt-0.5 md:pt-2">
                {language === 'EN' ? 'Headquarters: Pune & Mumbai, Maharashtra' : 'मुख्य कार्यालय: पुणे आणि मुंबई, महाराष्ट्र'}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-4 md:pt-8 text-center text-[10px] md:text-xs text-ivory-400">
          <p>{t('copyright')}</p>
        </div>

      </div>
    </footer>
  );
};
