import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../services/api';
import { uploadUserPhotoToStorage } from '../services/firebaseService';
import { ProfileCard } from '../components/ProfileCard';
import {
  Eye,
  Heart,
  Star,
  FileText,
  User,
  Sparkles,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Camera,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, profile, refreshUser } = useAuth();

  const [recentViews, setRecentViews] = useState<any[]>([]);
  const [recommendedMatches, setRecommendedMatches] = useState<any[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [stats, setStats] = useState({
    viewsCount: 0,
    interestsReceivedCount: 0,
    interestsSentCount: 0,
    shortlistCount: 0,
  });

  useEffect(() => {
    if (!user) return;

    // Fetch profile views log
    fetchApi('/profile-views/recent')
      .then((res) => {
        setRecentViews(res.views || []);
        setStats((prev) => ({ ...prev, viewsCount: res.count || 0 }));
      })
      .catch((err) => console.error(err));

    // Fetch interests count
    fetchApi('/interests/my-interests')
      .then((res) => {
        setStats((prev) => ({
          ...prev,
          interestsReceivedCount: res.received?.length || 0,
          interestsSentCount: res.sent?.length || 0,
        }));
      })
      .catch((err) => console.error(err));

    // Fetch shortlist count
    fetchApi('/shortlists/my-shortlist')
      .then((res) => {
        setStats((prev) => ({ ...prev, shortlistCount: res.length || 0 }));
      })
      .catch((err) => console.error(err));

    // Fetch recommended matches
    fetchApi('/search?limit=4')
      .then((res) => setRecommendedMatches(res.profiles || []))
      .catch((err) => console.error(err));
  }, [user]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingPhoto(true);
    try {
      const photoUrl = await uploadUserPhotoToStorage(file, user.id);
      await fetchApi('/profiles/me', {
        method: 'PUT',
        body: JSON.stringify({ primaryPhoto: photoUrl }),
      });
      alert(language === 'EN' ? 'Profile photo uploaded successfully to Firebase Storage!' : 'प्रोफाईल फोटो बदलला व सेव्ह झाला!');
      await refreshUser();
    } catch (err: any) {
      alert(err.message || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <p className="text-gray-600">Please log in to view your dashboard.</p>
        <Link to="/login" className="px-6 py-2.5 bg-brand-900 text-gold-300 rounded-xl text-xs font-semibold">
          {t('navLogin')}
        </Link>
      </div>
    );
  }

  // Active user profile or safe fallback
  const userProfile = profile || {
    profileId: user.profileId || 'PB-10030',
    city: 'Pune',
    state: 'Maharashtra',
    completionPercentage: 75,
    primaryPhoto: '',
    biodataUrl: '',
  };

  const completionPct = userProfile.completionPercentage || 75;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 text-center sm:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400/20 text-gold-300 text-xs font-semibold border border-gold-400/30">
            <Sparkles className="w-3.5 h-3.5 fill-gold-400" />
            <span>{t('dashboardTitle')}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">
            {t('welcomeBack')}, <span className="text-gold-300">{user.fullName}</span>!
          </h1>
          <p className="text-xs text-ivory-200">
            Profile ID: <strong className="font-mono text-gold-300">{userProfile.profileId}</strong> • {userProfile.city}, {userProfile.state || 'Maharashtra'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          <label className="px-5 py-3 rounded-2xl bg-brand-800 text-gold-300 font-bold text-xs hover:bg-brand-700 shadow-md transition-all cursor-pointer flex items-center gap-2 border border-gold-400/30">
            <Camera className="w-4 h-4 text-gold-400" />
            <span>{uploadingPhoto ? 'Uploading...' : '📷 Add Profile Photo'}</span>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploadingPhoto} className="hidden" />
          </label>

          {userProfile.profileId && (
            <Link
              to={`/profile/${userProfile.profileId}`}
              className="px-5 py-3 rounded-2xl bg-gold-400 text-brand-950 font-bold text-xs hover:bg-gold-300 shadow-md transition-all"
            >
              {t('viewProfile')}
            </Link>
          )}
        </div>
      </div>

      {/* Profile Completion Meter */}
      <div className="bg-white rounded-3xl border border-ivory-300 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-100 text-brand-900 flex items-center justify-center font-bold text-xs">
              {completionPct}%
            </div>
            <div>
              <h3 className="font-serif font-bold text-gray-900 text-sm">{t('profileCompletion')}</h3>
              <p className="text-xs text-gray-500">{t('completeProfileTip')}</p>
            </div>
          </div>
          <span className="text-xs font-bold text-brand-900">{completionPct}% Complete</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-400 to-brand-900 rounded-full transition-all duration-1000"
            style={{ width: `${completionPct}%` }}
          ></div>
        </div>

        {/* Missing Suggestions */}
        {completionPct < 90 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-gray-600">
            <AlertCircle className="w-4 h-4 text-gold-600" />
            <span>Suggestions:</span>
            {!userProfile.primaryPhoto && (
              <label className="bg-brand-50 text-brand-900 border border-brand-200 px-3 py-1 rounded-full font-semibold cursor-pointer hover:bg-brand-100 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-brand-900" />
                <span>+ Upload Photo</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploadingPhoto} className="hidden" />
              </label>
            )}
            {!userProfile.biodataUrl && (
              <Link to={`/profile/${userProfile.profileId}`} className="bg-brand-50 text-brand-900 px-2.5 py-1 rounded-full font-medium">
                + Upload PDF Biodata
              </Link>
            )}
          </div>
        )}
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-brand-900">
            <Eye className="w-5 h-5 text-gold-600" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Total</span>
          </div>
          <div className="font-serif text-2xl font-bold text-gray-900">{stats.viewsCount}</div>
          <div className="text-xs text-gray-500">{t('dashboardViews')}</div>
        </div>

        <Link to="/interests" className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-sm space-y-2 hover:border-brand-900 transition-colors">
          <div className="flex items-center justify-between text-brand-700">
            <Heart className="w-5 h-5 fill-brand-700/20" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Received</span>
          </div>
          <div className="font-serif text-2xl font-bold text-gray-900">{stats.interestsReceivedCount}</div>
          <div className="text-xs text-gray-500">{t('dashboardInterests')}</div>
        </Link>

        <Link to="/interests" className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-sm space-y-2 hover:border-brand-900 transition-colors">
          <div className="flex items-center justify-between text-gray-600">
            <Heart className="w-5 h-5 text-gray-500" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Sent</span>
          </div>
          <div className="font-serif text-2xl font-bold text-gray-900">{stats.interestsSentCount}</div>
          <div className="text-xs text-gray-500">{t('dashboardSent')}</div>
        </Link>

        <Link to="/shortlisted" className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-sm space-y-2 hover:border-gold-500 transition-colors">
          <div className="flex items-center justify-between text-gold-600">
            <Star className="w-5 h-5 fill-gold-400" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Saved</span>
          </div>
          <div className="font-serif text-2xl font-bold text-gray-900">{stats.shortlistCount}</div>
          <div className="text-xs text-gray-500">{t('dashboardShortlists')}</div>
        </Link>
      </div>

      {/* Recent Profile Views Tracked */}
      <div className="bg-white rounded-3xl border border-ivory-300 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
          <h3 className="font-serif font-bold text-brand-900 text-base flex items-center gap-2">
            <Eye className="w-4 h-4 text-gold-600" />
            <span>{t('recentProfileViews')}</span>
          </h3>
          <span className="text-xs text-gray-500">{recentViews.length} Recent Viewers</span>
        </div>

        {recentViews.length === 0 ? (
          <p className="text-xs text-gray-500 py-4 text-center">No profile views recorded yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentViews.map((item) => (
              <div key={item._id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-900/10 text-brand-900 font-bold text-xs flex items-center justify-center overflow-hidden">
                    {item.viewer?.primaryPhoto ? (
                      <img src={item.viewer.primaryPhoto} alt="" className="w-full h-full object-cover" />
                    ) : (
                      item.viewer?.fullName?.charAt(0) || 'U'
                    )}
                  </div>
                  <div>
                    <Link
                      to={item.viewer?.profileId ? `/profile/${item.viewer.profileId}` : '#'}
                      className="font-semibold text-xs text-gray-900 hover:text-brand-900"
                    >
                      {item.viewer?.fullName}
                    </Link>
                    <p className="text-[11px] text-gray-500">
                      {item.viewer?.occupation || 'Member'} • {item.viewer?.city || 'Maharashtra'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-gray-400">
                    {new Date(item.viewedAt).toLocaleDateString()}
                  </span>
                  {item.viewer?.profileId && (
                    <Link
                      to={`/profile/${item.viewer.profileId}`}
                      className="block text-[11px] font-semibold text-brand-900 hover:underline mt-0.5"
                    >
                      {t('viewProfile')} →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Matches Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-brand-950 text-xl">
            {t('recommendedMatches')}
          </h3>
          <Link to="/search" className="text-xs font-semibold text-brand-900 flex items-center gap-1">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedMatches.map((prof) => (
            <ProfileCard key={prof._id} profile={prof} />
          ))}
        </div>
      </div>

    </div>
  );
};
