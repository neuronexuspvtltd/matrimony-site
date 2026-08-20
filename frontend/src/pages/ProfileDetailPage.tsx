import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../services/api';
import { BiodataPdfViewer } from '../components/BiodataPdfViewer';
import {
  Heart,
  Star,
  MapPin,
  GraduationCap,
  Briefcase,
  User as UserIcon,
  ShieldCheck,
  Share2,
  Flag,
  FileText,
  Users,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';

export const ProfileDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [interestSent, setInterestSent] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const fetchProfile = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // Endpoint automatically logs profile view and sends notification to owner if viewer is logged in!
      const data = await fetchApi(`/profiles/${id}`);
      setProfile(data);
    } catch (err: any) {
      setError(err.message || 'Profile not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-brand-900 border-t-transparent animate-spin mx-auto"></div>
        <p className="text-xs text-gray-500 mt-4">Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-gray-800">Profile Not Found</h2>
        <p className="text-xs text-gray-500">{error || 'The requested profile could not be loaded.'}</p>
        <button
          onClick={() => navigate('/search')}
          className="px-6 py-2.5 bg-brand-900 text-gold-300 rounded-xl text-xs font-semibold"
        >
          {t('heroCtaExplore')}
        </button>
      </div>
    );
  }

  const isOwnProfile = Boolean(user && user.id === (profile.user?._id || profile.user));
  const fullName = profile.user?.fullName || 'Profile Member';

  const handleSendInterest = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await fetchApi('/interests/send', {
        method: 'POST',
        body: JSON.stringify({ receiverId: profile.user._id }),
      });
      setInterestSent(true);
    } catch (err: any) {
      alert(err.message || 'Error sending interest');
    }
  };

  const handleToggleShortlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await fetchApi('/shortlists/toggle', {
        method: 'POST',
        body: JSON.stringify({ targetUserId: profile.user._id }),
      });
      setIsShortlisted(res.shortlisted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    try {
      await fetchApi('/reports/report', {
        method: 'POST',
        body: JSON.stringify({ reportedUserId: profile.user._id, reason: reportReason }),
      });
      alert(language === 'EN' ? 'Report submitted successfully' : 'तक्रार दाखल झाली आहे');
      setReportModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to submit report');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner & Profile Header Card */}
      <div className="bg-white rounded-3xl border border-ivory-300 shadow-sm overflow-hidden">
        <div className="h-36 bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800 relative">
          <div className="absolute top-4 right-4 text-gold-400 text-xs font-mono font-bold px-3 py-1 bg-black/40 rounded-full backdrop-blur-md">
            ID: {profile.profileId}
          </div>
        </div>

        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 gap-6">
            
            {/* Avatar & Main Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-ivory-200 shrink-0">
                {profile.primaryPhoto ? (
                  <img src={profile.primaryPhoto} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-serif text-4xl font-bold text-brand-900 bg-ivory-100">
                    {fullName.charAt(0)}
                  </div>
                )}
              </div>

              <div className="space-y-1 pb-1">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-950">
                    {fullName}, <span className="font-sans font-normal text-xl text-gray-700">{profile.age}</span>
                  </h1>
                  {profile.isVerified && (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-md flex items-center gap-1 border border-emerald-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t('verifiedBadge')}</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600 font-medium">
                  {profile.occupation} • {profile.education}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500 justify-center sm:justify-start pt-1">
                  <MapPin className="w-3.5 h-3.5 text-gold-600" />
                  <span>{profile.city}, {profile.state}, {profile.country}</span>
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            {!isOwnProfile && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleSendInterest}
                  disabled={interestSent}
                  className={`flex-1 sm:flex-initial px-6 py-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                    interestSent
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-brand-900 hover:bg-brand-950 text-gold-300'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${interestSent ? 'fill-emerald-600 stroke-none' : 'fill-gold-300'}`} />
                  <span>{interestSent ? t('interestSent') : t('sendInterest')}</span>
                </button>

                <button
                  onClick={handleToggleShortlist}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    isShortlisted
                      ? 'bg-gold-400 text-brand-950 border-gold-400'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-ivory-100'
                  }`}
                  title={isShortlisted ? t('shortlisted') : t('shortlist')}
                >
                  <Star className={`w-4 h-4 ${isShortlisted ? 'fill-brand-950' : ''}`} />
                </button>

                <button
                  onClick={() => setReportModalOpen(true)}
                  className="p-3 rounded-2xl border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                  title="Report Profile"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Main Grid: Details & Biodata PDF */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Cols: Comprehensive Info */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* About Me */}
          {profile.aboutMe && (
            <div className="bg-white rounded-3xl border border-ivory-300 p-6 space-y-3">
              <h3 className="font-serif font-bold text-brand-900 text-base flex items-center gap-2 border-b border-ivory-200 pb-3">
                <UserIcon className="w-4 h-4 text-gold-600" />
                <span>{t('aboutMe')}</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {profile.aboutMe}
              </p>
            </div>
          )}

          {/* PDF Biodata Section */}
          <BiodataPdfViewer
            biodataUrl={profile.biodataUrl}
            biodataFileName={profile.biodataFileName}
            visibility={profile.biodataVisibility}
            isOwnProfile={isOwnProfile}
            onUpdate={fetchProfile}
          />

          {/* Personal Information */}
          <div className="bg-white rounded-3xl border border-ivory-300 p-6 space-y-4">
            <h3 className="font-serif font-bold text-brand-900 text-base flex items-center gap-2 border-b border-ivory-200 pb-3">
              <Heart className="w-4 h-4 text-gold-600" />
              <span>{language === 'EN' ? 'Personal Information' : 'वैयक्तिक माहिती'}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block">{t('age')}</span>
                <span className="font-semibold text-gray-800">{profile.age} Yrs</span>
              </div>
              <div>
                <span className="text-gray-400 block">{t('height')}</span>
                <span className="font-semibold text-gray-800">{profile.height}</span>
              </div>
              <div>
                <span className="text-gray-400 block">{t('maritalStatus')}</span>
                <span className="font-semibold text-gray-800 capitalize">{profile.maritalStatus?.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-gray-400 block">{t('religion')}</span>
                <span className="font-semibold text-gray-800">{profile.religion}</span>
              </div>
              <div>
                <span className="text-gray-400 block">{t('caste')}</span>
                <span className="font-semibold text-gray-800">{profile.caste}</span>
              </div>
              <div>
                <span className="text-gray-400 block">{t('subCaste')}</span>
                <span className="font-semibold text-gray-800">{profile.subCaste || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">{t('motherTongue')}</span>
                <span className="font-semibold text-gray-800">{profile.motherTongue}</span>
              </div>
            </div>
          </div>

          {/* Education & Career */}
          <div className="bg-white rounded-3xl border border-ivory-300 p-6 space-y-4">
            <h3 className="font-serif font-bold text-brand-900 text-base flex items-center gap-2 border-b border-ivory-200 pb-3">
              <GraduationCap className="w-4 h-4 text-gold-600" />
              <span>{t('regStep3')}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block">{t('education')}</span>
                <span className="font-semibold text-gray-800">{profile.education}</span>
              </div>
              <div>
                <span className="text-gray-400 block">{t('college')}</span>
                <span className="font-semibold text-gray-800">{profile.college || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">{t('occupation')}</span>
                <span className="font-semibold text-gray-800">{profile.occupation}</span>
              </div>
              <div>
                <span className="text-gray-400 block">{t('company')}</span>
                <span className="font-semibold text-gray-800">{profile.company || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">{t('income')}</span>
                <span className="font-semibold text-gray-800">{profile.income || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Family Information */}
          <div className="bg-white rounded-3xl border border-ivory-300 p-6 space-y-4">
            <h3 className="font-serif font-bold text-brand-900 text-base flex items-center gap-2 border-b border-ivory-200 pb-3">
              <Users className="w-4 h-4 text-gold-600" />
              <span>{t('familyDetails')}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block">{t('fatherOccupation')}</span>
                <span className="font-semibold text-gray-800">{profile.fatherOccupation || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">{t('motherOccupation')}</span>
                <span className="font-semibold text-gray-800">{profile.motherOccupation || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">{t('familyType')}</span>
                <span className="font-semibold text-gray-800 capitalize">{profile.familyType}</span>
              </div>
              <div>
                <span className="text-gray-400 block">{t('familyValues')}</span>
                <span className="font-semibold text-gray-800 capitalize">{profile.familyValues}</span>
              </div>
              <div>
                <span className="text-gray-400 block">{t('brothers')} / {t('sisters')}</span>
                <span className="font-semibold text-gray-800">{profile.brothers || 0} Brother(s), {profile.sisters || 0} Sister(s)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right 4 Cols: Partner Preferences & Gallery */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Partner Preferences Box */}
          <div className="bg-white rounded-3xl border border-ivory-300 p-6 space-y-4">
            <h3 className="font-serif font-bold text-brand-900 text-base border-b border-ivory-200 pb-3">
              {t('partnerPreferences')}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400 block">{t('preferredAge')}</span>
                <span className="font-semibold text-gray-800">
                  {profile.partnerPreferences?.minAge || 21} - {profile.partnerPreferences?.maxAge || 35} Yrs
                </span>
              </div>
              <div>
                <span className="text-gray-400 block">{t('preferredEducation')}</span>
                <span className="font-semibold text-gray-800">{profile.partnerPreferences?.education || 'Any'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">{t('preferredOccupation')}</span>
                <span className="font-semibold text-gray-800">{profile.partnerPreferences?.occupation || 'Any'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">{t('preferredLocation')}</span>
                <span className="font-semibold text-gray-800">{profile.partnerPreferences?.location || 'Any'}</span>
              </div>
            </div>
          </div>

          {/* Photo Gallery */}
          {profile.photos && profile.photos.length > 0 && (
            <div className="bg-white rounded-3xl border border-ivory-300 p-6 space-y-4">
              <h3 className="font-serif font-bold text-brand-900 text-base border-b border-ivory-200 pb-3">
                {language === 'EN' ? 'Photo Gallery' : 'फोटो गॅलरी'}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {profile.photos.map((photo: string, idx: number) => (
                  <img
                    key={idx}
                    src={photo}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-28 object-cover rounded-xl border border-gray-100"
                  />
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-gray-900 text-lg">Report Profile</h3>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              rows={4}
              placeholder="Describe the reason for reporting this profile..."
              className="w-full p-3 border rounded-xl text-xs focus:ring-2 focus:ring-brand-900"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReportModalOpen(false)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
