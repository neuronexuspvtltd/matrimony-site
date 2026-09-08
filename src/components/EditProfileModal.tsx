import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../services/api';
import { uploadUserPhotoToStorage } from '../services/firebaseService';
import {
  X,
  User,
  Heart,
  Briefcase,
  Users,
  Sliders,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Camera,
  Trash2,
  Star,
  Plus,
  Image as ImageIcon,
} from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: any;
  onProfileUpdated?: (updatedProfile: any) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profileData,
  onProfileUpdated,
}) => {
  const { t, language } = useLanguage();
  const { refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'personal' | 'career' | 'family' | 'partner' | 'photos'>('personal');
  const [loading, setLoading] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [photosList, setPhotosList] = useState<string[]>([]);
  const [primaryPhotoUrl, setPrimaryPhotoUrl] = useState<string>('');

  const [formData, setFormData] = useState({
    fullName: '',
    age: 25,
    height: "5'8\"",
    maritalStatus: 'never_married',
    religion: 'Hindu',
    caste: 'Maratha',
    subCaste: 'Deshmukh',
    motherTongue: 'Marathi',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    aboutMe: '',

    // Education & Career
    education: 'B.Tech / B.E.',
    college: 'Pune University',
    occupation: 'Software Engineer',
    income: '12 - 15 LPA',

    // Family
    fatherOccupation: 'Businessman',
    motherOccupation: 'Homemaker',
    brothers: 1,
    sisters: 0,
    familyType: 'nuclear',
    familyValues: 'moderate',

    // Partner Preferences
    partnerMinAge: 21,
    partnerMaxAge: 32,
    partnerEducation: 'Graduate',
    partnerOccupation: 'Employed',
    partnerLocation: 'Maharashtra',
  });

  useEffect(() => {
    if (profileData) {
      const existingPhotos: string[] = Array.isArray(profileData.photos) ? profileData.photos : [];
      const primary: string = profileData.primaryPhoto || (existingPhotos.length > 0 ? existingPhotos[0] : '');

      setPrimaryPhotoUrl(primary);
      setPhotosList(existingPhotos.length > 0 ? existingPhotos : (primary ? [primary] : []));

      setFormData({
        fullName: profileData.user?.fullName || profileData.fullName || '',
        age: profileData.age || 25,
        height: profileData.height || "5'8\"",
        maritalStatus: profileData.maritalStatus || 'never_married',
        religion: profileData.religion || 'Hindu',
        caste: profileData.caste || 'Maratha',
        subCaste: profileData.subCaste || '',
        motherTongue: profileData.motherTongue || 'Marathi',
        city: profileData.city || 'Pune',
        state: profileData.state || 'Maharashtra',
        country: profileData.country || 'India',
        aboutMe: profileData.aboutMe || '',

        education: profileData.education || '',
        college: profileData.college || '',
        occupation: profileData.occupation || '',
        income: profileData.income || '',

        fatherOccupation: profileData.fatherOccupation || '',
        motherOccupation: profileData.motherOccupation || '',
        brothers: profileData.brothers ?? 0,
        sisters: profileData.sisters ?? 0,
        familyType: profileData.familyType || 'nuclear',
        familyValues: profileData.familyValues || 'moderate',

        partnerMinAge: profileData.partnerPreferences?.minAge || profileData.partnerMinAge || 21,
        partnerMaxAge: profileData.partnerPreferences?.maxAge || profileData.partnerMaxAge || 32,
        partnerEducation: profileData.partnerPreferences?.education || profileData.partnerEducation || 'Graduate',
        partnerOccupation: profileData.partnerPreferences?.occupation || profileData.partnerOccupation || 'Employed',
        partnerLocation: profileData.partnerPreferences?.location || profileData.partnerLocation || 'Maharashtra',
      });
    }
  }, [profileData]);

  const handleMultiplePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingPhotos(true);
    setError('');
    try {
      const targetUserId = profileData?.user?._id || profileData?._id || 'usr_me';
      const uploadPromises = files.map((file) => uploadUserPhotoToStorage(file, targetUserId));
      const uploadedUrls = await Promise.all(uploadPromises);

      setPhotosList((prev) => {
        const next = [...prev, ...uploadedUrls];
        if (!primaryPhotoUrl && next.length > 0) {
          setPrimaryPhotoUrl(next[0]);
        }
        return next;
      });
    } catch (err: any) {
      setError(err.message || 'Failed to upload photos');
    } finally {
      setUploadingPhotos(false);
    }
  };

  const removePhoto = (index: number) => {
    const targetUrl = photosList[index];
    const updated = photosList.filter((_, i) => i !== index);
    setPhotosList(updated);
    if (primaryPhotoUrl === targetUrl) {
      setPrimaryPhotoUrl(updated[0] || '');
    }
  };

  const handleSetPrimary = (url: string) => {
    setPrimaryPhotoUrl(url);
  };

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const targetId = profileData?.profileId || profileData?.user?._id || 'me';
      const res = await fetchApi(`/profiles/${targetId}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...formData,
          primaryPhoto: primaryPhotoUrl || (photosList.length > 0 ? photosList[0] : ''),
          photos: photosList,
        }),
      });

      const updated = res.profile || res;
      setSuccess(
        language === 'EN'
          ? 'Profile details updated successfully!'
          : 'प्रोफाईल माहिती यशस्वीरीत्या अद्ययावत झाली!'
      );

      if (onProfileUpdated) {
        onProfileUpdated(updated);
      }

      await refreshUser();

      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative animate-in zoom-in-95 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-gold-300">
              <Sparkles className="w-5 h-5 fill-gold-400" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-white">
                {language === 'EN' ? 'Edit Profile Details' : 'प्रोफाईल संपादित करा'}
              </h2>
              <p className="text-xs text-ivory-200">
                {language === 'EN' ? 'Update your personal, career, and family information' : 'तुमची वैयक्तिक, शैक्षणिक व कौटुंबिक माहिती अपडेट करा'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-ivory-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-around border-b border-ivory-200 bg-ivory-50 shrink-0 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`flex-1 py-3.5 px-3 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'personal'
                ? 'border-brand-900 text-brand-950 bg-white font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <User className="w-4 h-4 text-gold-600" />
            <span>{language === 'EN' ? 'Personal Details' : 'वैयक्तिक माहिती'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('career')}
            className={`flex-1 py-3.5 px-3 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'career'
                ? 'border-brand-900 text-brand-950 bg-white font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Briefcase className="w-4 h-4 text-gold-600" />
            <span>{language === 'EN' ? 'Education & Job' : 'शिक्षण व नोकरी'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('family')}
            className={`flex-1 py-3.5 px-3 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'family'
                ? 'border-brand-900 text-brand-950 bg-white font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Users className="w-4 h-4 text-gold-600" />
            <span>{language === 'EN' ? 'Family Details' : 'कौटुंबिक माहिती'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('partner')}
            className={`flex-1 py-3.5 px-3 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'partner'
                ? 'border-brand-900 text-brand-950 bg-white font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Sliders className="w-4 h-4 text-gold-600" />
            <span>{language === 'EN' ? 'Partner Preferences' : 'अपेक्षित जोडीदार'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`flex-1 py-3.5 px-3 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'photos'
                ? 'border-brand-900 text-brand-950 bg-white font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Camera className="w-4 h-4 text-gold-600" />
            <span>{language === 'EN' ? 'Photos Gallery' : 'फोटो गॅलरी'}</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* TAB 1: PERSONAL DETAILS */}
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('fullName')} *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Patil"
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('age')} *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="18"
                  max="80"
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('height')}</label>
                <input
                  type="text"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="5'8&quot;"
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('maritalStatus')}</label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                >
                  <option value="never_married">Never Married (अविवाहित)</option>
                  <option value="divorced">Divorced (घटस्फोटित)</option>
                  <option value="widowed">Widowed (विधवा/विधुर)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('religion')}</label>
                <input
                  type="text"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('caste')}</label>
                <input
                  type="text"
                  name="caste"
                  value={formData.caste}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('subCaste')}</label>
                <input
                  type="text"
                  name="subCaste"
                  value={formData.subCaste}
                  onChange={handleChange}
                  placeholder="Deshmukh / 96 Kuli"
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('motherTongue')}</label>
                <input
                  type="text"
                  name="motherTongue"
                  value={formData.motherTongue}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('city')}</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('state')}</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('aboutMe')}</label>
                <textarea
                  name="aboutMe"
                  value={formData.aboutMe}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Share a short bio about your personal qualities, interests, and aspirations..."
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                />
              </div>
            </div>
          )}

          {/* TAB 2: CAREER & EDUCATION */}
          {activeTab === 'career' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('education')}</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="B.Tech, MBA, M.Sc, MD"
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('college')}</label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="College / University Name"
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('occupation')}</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="Software Engineer, Doctor, CA"
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('income')}</label>
                <input
                  type="text"
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                  placeholder="e.g. 10-15 LPA"
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                />
              </div>
            </div>
          )}

          {/* TAB 3: FAMILY DETAILS */}
          {activeTab === 'family' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('fatherOccupation')}</label>
                <input
                  type="text"
                  name="fatherOccupation"
                  value={formData.fatherOccupation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('motherOccupation')}</label>
                <input
                  type="text"
                  name="motherOccupation"
                  value={formData.motherOccupation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('brothers')}</label>
                <input
                  type="number"
                  name="brothers"
                  value={formData.brothers}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('sisters')}</label>
                <input
                  type="number"
                  name="sisters"
                  value={formData.sisters}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                />
              </div>
            </div>
          )}

          {/* TAB 4: PARTNER PREFERENCES */}
          {activeTab === 'partner' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('preferredAge')} (Min - Max)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="partnerMinAge"
                    value={formData.partnerMinAge}
                    onChange={handleChange}
                    className="w-1/2 px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                  />
                  <input
                    type="number"
                    name="partnerMaxAge"
                    value={formData.partnerMaxAge}
                    onChange={handleChange}
                    className="w-1/2 px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('preferredEducation')}</label>
                <input
                  type="text"
                  name="partnerEducation"
                  value={formData.partnerEducation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('preferredOccupation')}</label>
                <input
                  type="text"
                  name="partnerOccupation"
                  value={formData.partnerOccupation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('preferredLocation')}</label>
                <input
                  type="text"
                  name="partnerLocation"
                  value={formData.partnerLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                />
              </div>
            </div>
          )}

          {/* TAB 5: PHOTOS GALLERY */}
          {activeTab === 'photos' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-brand-50/60 border border-brand-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-serif font-bold text-brand-950 text-sm flex items-center gap-2">
                    <Camera className="w-4 h-4 text-brand-900" />
                    <span>{language === 'EN' ? 'Manage Multiple Profile Photos' : 'प्रोफाईल फोटो गॅलरी'}</span>
                  </h4>
                  <p className="text-xs text-gray-600">
                    {language === 'EN'
                      ? 'Upload multiple photos. Click Star ⭐ to set a photo as your primary profile picture.'
                      : 'एकापेक्षा जास्त फोटो अपलोड करा. स्टार ⭐ वर क्लिक करून मुख्य फोटो सेट करा.'}
                  </p>
                </div>

                <label className="px-4 py-2.5 bg-brand-900 text-gold-300 font-bold rounded-xl text-xs hover:bg-brand-950 cursor-pointer flex items-center gap-2 shrink-0 self-start sm:self-auto shadow-md">
                  <Plus className="w-4 h-4 text-gold-400" />
                  <span>{uploadingPhotos ? 'Uploading...' : 'Upload Photos'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMultiplePhotoUpload}
                    disabled={uploadingPhotos}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Photos Grid */}
              {photosList.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  {photosList.map((photoUrl, idx) => (
                    <div
                      key={idx}
                      className={`relative group aspect-square rounded-2xl overflow-hidden border-2 bg-slate-100 shadow-sm ${
                        primaryPhotoUrl === photoUrl ? 'border-gold-400 ring-2 ring-gold-400/40' : 'border-gray-200'
                      }`}
                    >
                      <img src={photoUrl} alt="" className="w-full h-full object-cover" />

                      {/* Primary Photo Badge */}
                      {primaryPhotoUrl === photoUrl && (
                        <div className="absolute top-2 left-2 bg-gold-400 text-brand-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                          <Star className="w-3 h-3 fill-brand-950" />
                          <span>Primary</span>
                        </div>
                      )}

                      {/* Hover Action Buttons Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                        {primaryPhotoUrl !== photoUrl && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(photoUrl)}
                            className="px-3 py-1.5 bg-gold-400 text-brand-950 font-bold rounded-xl text-xs flex items-center gap-1 shadow hover:bg-gold-300"
                            title="Set as Primary Profile Photo"
                          >
                            <Star className="w-3.5 h-3.5 fill-brand-950" />
                            <span>Set Main</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="p-2 bg-red-600 text-white rounded-xl shadow hover:bg-red-700 cursor-pointer"
                          title="Delete Photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 border-2 border-dashed border-ivory-300 rounded-2xl text-center space-y-3 bg-ivory-50">
                  <div className="w-12 h-12 rounded-full bg-ivory-200 text-gray-400 flex items-center justify-center mx-auto">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-gray-500">
                    No photos added to your gallery yet. Click "Upload Photos" above to select multiple photos.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-ivory-200 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {language === 'EN' ? 'Cancel' : 'रद्द करा'}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-brand-900 text-gold-300 font-bold text-xs hover:bg-brand-950 shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-gold-400" />
              <span>{loading ? (language === 'EN' ? 'Saving...' : 'सेव्ह होत आहे...') : (language === 'EN' ? 'Save Changes' : 'बदल सेव्ह करा')}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
