import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../services/api';
import { uploadUserPhotoToStorage } from '../services/firebaseService';
import { BiodataPdfViewer } from '../components/BiodataPdfViewer';
import { EditProfileModal } from '../components/EditProfileModal';
import {
  Heart,
  Star,
  MapPin,
  GraduationCap,
  Briefcase,
  User as UserIcon,
  User,
  ShieldCheck,
  Share2,
  Flag,
  FileText,
  Users,
  CheckCircle2,
  MessageSquare,
  Camera,
  Upload,
  Edit,
  Edit3,
} from 'lucide-react';

export const ProfileDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [interestSent, setInterestSent] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!id) return;
    setLoading(true);
    try {
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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhoto(true);
    try {
      const targetUserId = user?.id || profile?.user?._id || profile?._id || 'usr_me';
      const fileList = Array.from(files);
      const uploadedUrls = await Promise.all(
        fileList.map((file) => uploadUserPhotoToStorage(file, targetUserId))
      );

      const existingPhotos = Array.isArray(profile?.photos) && profile.photos.length > 0
        ? profile.photos
        : (profile?.primaryPhoto ? [profile.primaryPhoto] : []);

      const updatedPhotos = Array.from(new Set([...existingPhotos, ...uploadedUrls]));
      const updatedPrimary = profile?.primaryPhoto || updatedPhotos[0] || uploadedUrls[0];

      await fetchApi('/profiles/me', {
        method: 'PUT',
        body: JSON.stringify({
          primaryPhoto: updatedPrimary,
          photos: updatedPhotos,
        }),
      });

      alert(
        language === 'EN'
          ? `${uploadedUrls.length} photo(s) uploaded successfully!`
          : `${uploadedUrls.length} फोटो यशस्वीपणे सेव्ह झाले!`
      );
      await fetchProfile();
      await refreshUser();
    } catch (err: any) {
      alert(err.message || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

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

  const isOwnProfile = Boolean(user && (user.id === (profile.user?._id || profile.user) || user.profileId === profile.profileId));
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
            
            {/* Avatar & Main Info with Upload Button */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              
              <div className="relative group w-32 h-32 sm:w-36 sm:h-36 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-ivory-200 shrink-0">
                {profile.primaryPhoto ? (
                  <img src={profile.primaryPhoto} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 select-none">
                    <User className="w-16 h-16 text-slate-400 stroke-[1.5]" />
                    <span className="text-[10px] text-slate-400 font-semibold mt-1">No Photo</span>
                  </div>
                )}

                {/* Profile Photo Upload Overlay */}
                {(isOwnProfile || user?.role === 'admin') && (
                  <label className="absolute inset-0 bg-black/60 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-all duration-200">
                    <Camera className="w-6 h-6 mb-1 text-gold-300" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                      className="hidden"
                    />
                  </label>
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
            {isOwnProfile || user?.role === 'admin' ? (
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-gold-400 text-brand-950 font-bold text-xs hover:bg-gold-300 shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4 text-brand-950" />
                  <span>{language === 'EN' ? 'Edit Profile' : 'प्रोफाईल एडिट करा'}</span>
                </button>

                <label className="px-5 py-3 rounded-2xl bg-brand-900 text-gold-300 font-bold text-xs hover:bg-brand-950 shadow-md transition-all cursor-pointer flex items-center gap-2 border border-gold-400/30">
                  <Camera className="w-4 h-4 text-gold-400" />
                  <span>{uploadingPhoto ? 'Uploading...' : '📷 Add / Change Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
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

          {/* Photo Gallery Card */}
          {(() => {
            const displayPhotos: string[] = Array.isArray(profile.photos) && profile.photos.length > 0
              ? profile.photos
              : (profile.primaryPhoto ? [profile.primaryPhoto] : []);

            return (
              <div className="bg-white rounded-3xl border border-ivory-300 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
                  <h3 className="font-serif font-bold text-brand-900 text-base flex items-center gap-2">
                    <Camera className="w-4 h-4 text-gold-600" />
                    <span>{language === 'EN' ? 'Photo Gallery' : 'फोटो गॅलरी'}</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-gold-100 text-brand-900 border border-gold-300/50">
                      {displayPhotos.length} {displayPhotos.length === 1 ? 'Photo' : 'Photos'}
                    </span>
                    {(isOwnProfile || user?.role === 'admin') && (
                      <label className="text-[11px] font-bold text-brand-950 hover:text-black bg-gold-400 hover:bg-gold-300 px-2.5 py-1 rounded-xl cursor-pointer transition-all flex items-center gap-1 shadow-xs border border-gold-500/30">
                        <Camera className="w-3.5 h-3.5" />
                        <span>{uploadingPhoto ? '...' : '+ Add Photos'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoUpload}
                          disabled={uploadingPhoto}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {displayPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {displayPhotos.map((photo: string, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => setPreviewImage(photo)}
                        className="relative group cursor-pointer overflow-hidden rounded-xl border border-gray-200 h-28 bg-gray-100 shadow-xs"
                      >
                        <img
                          src={photo}
                          alt={`Gallery ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-semibold">
                          <Camera className="w-4 h-4 text-gold-300 mb-0.5" />
                          <span>View Photo</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <Camera className="w-8 h-8 mx-auto text-gray-300 mb-1" />
                    <p className="text-xs text-gray-400 font-medium">No gallery photos added yet</p>
                    {(isOwnProfile || user?.role === 'admin') && (
                      <label className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-brand-900 text-gold-300 text-xs font-semibold rounded-xl cursor-pointer hover:bg-brand-950 transition-all shadow-sm">
                        <Camera className="w-4 h-4 text-gold-400" />
                        <span>Upload Multiple Photos</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoUpload}
                          disabled={uploadingPhoto}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

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

      {/* Image Lightbox Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center text-lg font-bold hover:bg-black/80 transition-colors z-10"
            >
              ✕
            </button>
            <img
              src={previewImage}
              alt="Photo preview"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        profileData={profile}
        onProfileUpdated={(updated) => {
          setProfile(updated);
          fetchProfile();
        }}
      />

    </div>
  );
};
