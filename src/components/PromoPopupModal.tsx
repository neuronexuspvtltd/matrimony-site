import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { X, Sparkles, ChevronRight } from 'lucide-react';
import { defaultSiteContent } from '../services/mockApi';

interface PromoPopupModalProps {
  siteContent?: any;
}

export const PromoPopupModal: React.FC<PromoPopupModalProps> = ({ siteContent: propsContent }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSiteContent = async () => {
      let activeContent: any = propsContent;

      // 1. Try reading from localStorage
      if (!activeContent || !activeContent.popupBannerImageUrl) {
        try {
          const raw = localStorage.getItem('pb_site_content_data');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.popupBannerImageUrl) {
              activeContent = { ...defaultSiteContent, ...parsed };
            }
          }
        } catch (e) {}
      }

      // 2. Fallback fetch from API if missing or empty
      if (!activeContent || !activeContent.popupBannerImageUrl) {
        try {
          const res = await fetch('/admin/site-content');
          const data = await res.json();
          if (data && data.popupBannerImageUrl) {
            activeContent = { ...defaultSiteContent, ...data };
          }
        } catch (e) {}
      }

      // Fallback to default site content if none found
      if (!activeContent || !activeContent.popupBannerImageUrl) {
        activeContent = defaultSiteContent;
      }

      if (!isMounted) return;

      // Check if popup is enabled (defaults to true)
      const isEnabled = activeContent?.popupBannerEnabled !== false;
      if (!isEnabled || !activeContent?.popupBannerImageUrl) {
        setIsOpen(false);
        return;
      }

      // Check if user already dismissed THIS specific poster image URL in this browser tab session
      const dismissedUrl = sessionStorage.getItem('pb_promo_popup_closed_url');
      if (dismissedUrl === activeContent.popupBannerImageUrl) {
        return;
      }

      setContent(activeContent);
      setIsOpen(true);
    };

    loadSiteContent();

    return () => {
      isMounted = false;
    };
  }, [propsContent]);

  // Handle body scroll locking when promo modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (content?.popupBannerImageUrl) {
      sessionStorage.setItem('pb_promo_popup_closed_url', content.popupBannerImageUrl);
    }
  };

  const handlePosterClick = () => {
    handleClose();
    if (content?.popupBannerLinkUrl) {
      if (content.popupBannerLinkUrl.startsWith('http')) {
        window.open(content.popupBannerLinkUrl, '_blank');
      } else {
        navigate(content.popupBannerLinkUrl);
      }
    } else {
      navigate('/register');
    }
  };

  if (!isOpen || !content || !content.popupBannerImageUrl) {
    return null;
  }

  const title = language === 'MR'
    ? (content.popupBannerTitleMr || content.popupBannerTitleEn || 'खास ऑफर! आजच नोंदणी करा')
    : (content.popupBannerTitleEn || 'Special Offer! Register Today');

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300">
      
      {/* Backdrop click to dismiss */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Main Promo Card Modal */}
      <div className="relative max-w-lg w-full bg-gradient-to-b from-brand-950 via-brand-900 to-purple-950 text-white rounded-3xl border border-gold-400/50 shadow-2xl overflow-hidden z-10 flex flex-col transform transition-all duration-300 scale-100">
        
        {/* ❌ PROMINENT CROSS CLOSE BUTTON */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 z-30 w-10 h-10 rounded-full bg-black/75 text-white hover:bg-gold-400 hover:text-brand-950 border border-white/20 shadow-xl flex items-center justify-center transition-all duration-200 cursor-pointer transform hover:scale-110 active:scale-95"
          title="Close Popup (बंद करा)"
          aria-label="Close Promo Modal"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Top Header Badge */}
        <div className="px-5 pt-4 pb-2 flex items-center gap-1.5 text-xs font-bold text-gold-300">
          <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
          <span>V Brothers Matrimony Special Announcement</span>
        </div>

        {/* Poster Image Container (Clickable) */}
        <div 
          onClick={handlePosterClick}
          className="relative w-full max-h-[65vh] bg-black/90 overflow-hidden cursor-pointer group flex items-center justify-center"
        >
          <img
            src={content.popupBannerImageUrl}
            alt="Promotional Poster"
            className="w-full h-auto max-h-[60vh] object-contain transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
            <span className="px-4 py-2 bg-gold-400 text-brand-950 font-bold rounded-xl text-xs shadow-lg flex items-center gap-1">
              Click to View Offer Details <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Bottom Bar Info & Action Button */}
        <div className="p-4 sm:p-5 bg-brand-950/90 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <h3 className="font-serif font-bold text-sm sm:text-base text-gold-200 leading-snug">
              {title}
            </h3>
            <p className="text-[11px] text-ivory-200">
              Limited time offer for new members.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={handlePosterClick}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-gradient-to-r from-gold-400 to-amber-300 text-brand-950 font-bold rounded-xl text-xs hover:bg-gold-300 shadow-md flex items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <span>{language === 'MR' ? 'ऑफर पहा ➔' : 'Claim Offer ➔'}</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-2.5 border border-white/20 text-ivory-200 hover:text-white font-semibold rounded-xl text-xs hover:bg-white/10 transition-colors cursor-pointer"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
