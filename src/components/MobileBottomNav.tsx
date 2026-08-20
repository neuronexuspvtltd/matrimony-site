import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Home, Search, Plus, Heart, User as UserIcon, MessageSquare } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-ivory-300 shadow-2xl">
      <div className="grid grid-cols-5 h-16 items-center px-1">
        
        {/* 1. Home Tab */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
            isActive('/') ? 'text-brand-900 font-bold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Home className={`w-5 h-5 ${isActive('/') ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] truncate max-w-[64px]">{t('navHome')}</span>
        </Link>

        {/* 2. Matches Tab */}
        <Link
          to="/search"
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
            isActive('/search') ? 'text-brand-900 font-bold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Search className={`w-5 h-5 ${isActive('/search') ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] truncate max-w-[64px]">{t('navMatches')}</span>
        </Link>

        {/* 3. Center Elevated Floating Button (Messages when logged in, Create when logged out) */}
        <div className="relative flex flex-col items-center justify-center">
          {user ? (
            /* Logged-In Center Button: Messages */
            <>
              <Link
                to="/messages"
                className={`absolute -top-6 w-12 h-12 rounded-full shadow-xl border-4 border-white flex items-center justify-center active:scale-95 transition-transform ${
                  isActive('/messages')
                    ? 'bg-gold-400 text-brand-950 ring-2 ring-brand-900'
                    : 'bg-gradient-to-tr from-brand-900 via-brand-900 to-brand-800 text-gold-300'
                }`}
                title={t('navMessages')}
              >
                <MessageSquare className="w-5 h-5 stroke-[2.5]" />
              </Link>
              <span className={`text-[10px] font-bold mt-6 truncate max-w-[64px] ${isActive('/messages') ? 'text-brand-900' : 'text-brand-900'}`}>
                {language === 'EN' ? 'Messages' : 'संदेश'}
              </span>
            </>
          ) : (
            /* Logged-Out Center Button: Create Profile */
            <>
              <Link
                to="/register"
                className="absolute -top-6 w-12 h-12 rounded-full bg-gradient-to-tr from-brand-900 via-brand-900 to-brand-800 text-gold-300 shadow-xl border-4 border-white flex items-center justify-center active:scale-95 transition-transform"
                title={t('navRegister')}
              >
                <Plus className="w-6 h-6 stroke-[3] fill-gold-400" />
              </Link>
              <span className="text-[10px] font-bold text-brand-900 mt-6 truncate max-w-[64px]">
                {language === 'EN' ? 'Create' : 'नोंदणी'}
              </span>
            </>
          )}
        </div>

        {/* 4. Interests Tab */}
        <Link
          to={user ? '/interests' : '/login'}
          className={`flex flex-col items-center justify-center gap-0.5 relative transition-colors ${
            isActive('/interests') ? 'text-brand-900 font-bold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${isActive('/interests') ? 'fill-brand-900 stroke-none' : 'stroke-2'}`} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-700 rounded-full border border-white"></span>
            )}
          </div>
          <span className="text-[10px] truncate max-w-[64px]">
            {user ? t('navInterests') : t('navLogin')}
          </span>
        </Link>

        {/* 5. Account / Dashboard Tab */}
        <Link
          to={user ? '/dashboard' : '/login'}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
            isActive('/dashboard') || isActive('/login') ? 'text-brand-900 font-bold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <UserIcon className={`w-5 h-5 ${isActive('/dashboard') || isActive('/login') ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] truncate max-w-[64px]">
            {user ? (language === 'EN' ? 'Account' : 'खाते') : (language === 'EN' ? 'Login' : 'लॉग इन')}
          </span>
        </Link>

      </div>
    </div>
  );
};
