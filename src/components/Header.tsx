import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Heart,
  Search,
  Bookmark,
  MessageSquare,
  Bell,
  User as UserIcon,
  LogOut,
  Globe,
  Shield,
  Sparkles,
  Info,
  PhoneCall,
  ChevronDown,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAllAsRead, clearAllNotifications } = useNotifications();
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-ivory-300 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-tr from-brand-900 to-brand-700 flex items-center justify-center text-gold-300 shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 fill-gold-400 stroke-brand-900" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-serif text-base sm:text-xl md:text-2xl font-bold text-brand-900 tracking-tight whitespace-nowrap leading-tight">
                {t('brandName')}
              </span>
              <span className="text-[8px] sm:text-[10px] tracking-wider sm:tracking-widest text-gold-700 font-medium uppercase block leading-none">
                {language === 'EN' ? 'Matrimony' : 'विवाह संस्था'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Spacious & Clean Layout for Logged-In Users) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-3">
            <Link
              to="/"
              className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-medium whitespace-nowrap transition-colors ${
                isActive('/') ? 'bg-brand-50 text-brand-900 font-bold' : 'text-gray-700 hover:text-brand-900 hover:bg-ivory-200'
              }`}
            >
              {t('navHome')}
            </Link>

            <Link
              to="/search"
              className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                isActive('/search') ? 'bg-brand-50 text-brand-900 font-bold' : 'text-gray-700 hover:text-brand-900 hover:bg-ivory-200'
              }`}
            >
              <Search className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gold-600 shrink-0" />
              <span>{t('navMatches')}</span>
            </Link>

            {user ? (
              /* Logged-In Desktop Primary Navigation */
              <>
                <Link
                  to="/interests"
                  className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                    isActive('/interests') ? 'bg-brand-50 text-brand-900 font-bold' : 'text-gray-700 hover:text-brand-900 hover:bg-ivory-200'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-brand-700 shrink-0" />
                  <span>{t('navInterests')}</span>
                </Link>

                <Link
                  to="/messages"
                  className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                    isActive('/messages') ? 'bg-brand-50 text-brand-900 font-bold' : 'text-gray-700 hover:text-brand-900 hover:bg-ivory-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gold-600 shrink-0" />
                  <span>{t('navMessages')}</span>
                </Link>
              </>
            ) : (
              /* Logged-Out Guest Desktop Navigation */
              <>
                <Link
                  to="/about"
                  className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive('/about') ? 'bg-brand-50 text-brand-900 font-bold' : 'text-gray-700 hover:text-brand-900 hover:bg-ivory-200'
                  }`}
                >
                  {language === 'EN' ? 'About Us' : 'आमच्याबद्दल'}
                </Link>

                <Link
                  to="/contact"
                  className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive('/contact') ? 'bg-brand-50 text-brand-900 font-bold' : 'text-gray-700 hover:text-brand-900 hover:bg-ivory-200'
                  }`}
                >
                  {language === 'EN' ? 'Contact' : 'संपर्क'}
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Items: Shortlist Quick Icon, Language, Notifications, User Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 shrink-0">
            
            {/* Quick Shortlist Icon Button for Logged-In Users */}
            {user && (
              <Link
                to="/shortlisted"
                className={`p-2 rounded-full transition-colors relative hidden sm:flex items-center justify-center ${
                  isActive('/shortlisted') ? 'bg-brand-50 text-brand-900' : 'text-gray-700 hover:bg-ivory-200'
                }`}
                title={t('navShortlisted')}
              >
                <Bookmark className="w-4 h-4 text-gold-700" />
              </Link>
            )}

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-gold-400 bg-ivory-50 text-brand-900 hover:bg-gold-50 font-medium text-[11px] sm:text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap"
              title="Switch Language / भाषा बदला"
            >
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold-600 shrink-0" />
              <span className="font-semibold">{t('langToggle')}</span>
            </button>

            {user ? (
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(!notifDropdownOpen);
                      setUserDropdownOpen(false);
                    }}
                    className="p-1.5 sm:p-2 rounded-full text-gray-700 hover:bg-ivory-200 relative transition-colors cursor-pointer"
                    title={t('navNotifications')}
                  >
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-brand-700 text-white font-bold text-[9px] sm:text-[10px] rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-ivory-300 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100">
                        <h4 className="font-semibold text-brand-900 text-sm flex items-center gap-1.5">
                          <Bell className="w-4 h-4 text-gold-600" />
                          {t('notificationTitle')}
                        </h4>
                        <div className="flex items-center gap-2.5 text-xs">
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="text-brand-700 hover:underline font-medium cursor-pointer"
                            >
                              {t('markAllRead')}
                            </button>
                          )}
                          {notifications.length > 0 && (
                            <button
                              onClick={clearAllNotifications}
                              className="text-red-600 hover:underline font-medium cursor-pointer"
                            >
                              {language === 'EN' ? 'Clear All' : 'सर्व पुसा'}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                        {notifications.length === 0 ? (
                          <p className="p-4 text-center text-xs text-gray-500">{t('noNotifications')}</p>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => {
                                setNotifDropdownOpen(false);
                                if (n.targetProfileId) {
                                  navigate(`/profile/${n.targetProfileId}`);
                                } else {
                                  navigate('/dashboard');
                                }
                              }}
                              className={`p-3 text-xs cursor-pointer hover:bg-ivory-100 transition-colors ${
                                !n.isRead ? 'bg-brand-50/60 font-medium' : ''
                              }`}
                            >
                              <div className="font-semibold text-gray-900 mb-0.5">
                                {language === 'EN' ? n.titleEn : n.titleMr}
                              </div>
                              <p className="text-gray-600 line-clamp-2">
                                {language === 'EN' ? n.messageEn : n.messageMr}
                              </p>
                              <span className="text-[10px] text-gray-400 mt-1 block">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile / Account Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(!userDropdownOpen);
                      setNotifDropdownOpen(false);
                    }}
                    className="flex items-center gap-1.5 pl-1.5 pr-2.5 sm:pl-2 sm:pr-3 py-1 sm:py-1.5 rounded-full border border-ivory-300 hover:bg-ivory-100 transition-all cursor-pointer"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-900 text-gold-300 flex items-center justify-center font-bold text-xs shrink-0">
                      {user.fullName.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold text-gray-800 hidden sm:inline max-w-[80px] lg:max-w-[120px] truncate">
                      {user.fullName.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:inline" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-xl border border-ivory-300 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2.5 border-b border-gray-100 bg-ivory-50/50 rounded-t-2xl">
                        <p className="text-sm font-bold text-gray-900">{user.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-ivory-100 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-brand-900" />
                        <span>{t('navDashboard')}</span>
                      </Link>

                      {user.profileId && (
                        <Link
                          to={`/profile/${user.profileId}`}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-ivory-100 transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-gold-600" />
                          <span>{t('viewProfile')} ({user.profileId})</span>
                        </Link>
                      )}

                      <Link
                        to="/shortlisted"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-ivory-100 transition-colors"
                      >
                        <Bookmark className="w-4 h-4 text-gold-600" />
                        <span>{t('navShortlisted')}</span>
                      </Link>

                      <div className="border-t border-gray-100 my-1"></div>

                      <Link
                        to="/about"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-600 hover:bg-ivory-100 transition-colors"
                      >
                        <Info className="w-4 h-4 text-gray-400" />
                        <span>{language === 'EN' ? 'About Us' : 'आमच्याबद्दल'}</span>
                      </Link>

                      <Link
                        to="/contact"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-600 hover:bg-ivory-100 transition-colors"
                      >
                        <PhoneCall className="w-4 h-4 text-gray-400" />
                        <span>{language === 'EN' ? 'Contact Support' : 'संपर्क मदत'}</span>
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-brand-900 font-bold hover:bg-brand-50 transition-colors"
                        >
                          <Shield className="w-4 h-4 text-brand-700" />
                          <span>{t('navAdmin')}</span>
                        </Link>
                      )}

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-600 font-medium hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('navLogout')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-brand-900 hover:bg-ivory-200 transition-colors"
                >
                  {t('navLogin')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-brand-900 text-gold-300 hover:bg-brand-950 shadow-sm transition-all"
                >
                  {t('navRegister')}
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
