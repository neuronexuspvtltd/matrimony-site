import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { fetchApi } from '../services/api';
import { uploadUserPhotoToStorage } from '../services/firebaseService';
import {
  Shield,
  Users,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertTriangle,
  Send,
  Search,
  Check,
  Ban,
  Star,
  Edit3,
  Trash2,
  Plus,
  FileCheck2,
  Heart,
  Globe2,
  X,
  Lock,
  Save,
  FileText,
  UploadCloud,
  Images,
  KeyRound,
  Camera,
  User,
  Briefcase,
  Sliders,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { t, language } = useLanguage();

  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [reportsList, setReportsList] = useState<any[]>([]);
  const [storiesList, setStoriesList] = useState<any[]>([]);
  const [siteContent, setSiteContent] = useState<any>({
    heroHeadlineEn: 'Choose Your Forever',
    heroHeadlineMr: 'तुमच्या आयुष्याचा साथीदार शोधा',
    heroSubtitleEn: 'Find love on your terms with thousands of verified profiles',
    heroSubtitleMr: 'तुमच्या आवडीनुसार आणि विश्वासाने शोधा सुयोग्य स्थळे',
    supportPhone: '+91 90750 36382',
    supportEmail: 'pranotipawar056@gmail.com',
    puneOffice: 'FC Road, Shivajinagar, Pune',
    mumbaiOffice: 'Nariman Point, Mumbai',
  });

  const [tab, setTab] = useState<'users' | 'stories' | 'content' | 'announcement' | 'reports'>('users');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [savingContent, setSavingContent] = useState(false);

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [adminUserTab, setAdminUserTab] = useState<'account' | 'personal' | 'career' | 'family' | 'photos' | 'partner'>('account');
  const [adminUploadingPhoto, setAdminUploadingPhoto] = useState(false);
  const [adminShowPassword, setAdminShowPassword] = useState(false);

  const handleAdminPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !editingUser) return;

    setAdminUploadingPhoto(true);
    try {
      const targetUserId = editingUser._id || editingUser.user?._id || 'usr_me';
      const uploadedUrls = await Promise.all(
        files.map((file) => uploadUserPhotoToStorage(file, targetUserId))
      );

      const existingPhotos = Array.isArray(editingUser.photos)
        ? editingUser.photos
        : (editingUser.primaryPhoto ? [editingUser.primaryPhoto] : []);

      const newPhotos = Array.from(new Set([...existingPhotos, ...uploadedUrls]));
      const newPrimary = editingUser.primaryPhoto || newPhotos[0] || '';

      setEditingUser({
        ...editingUser,
        photos: newPhotos,
        primaryPhoto: newPrimary,
      });
    } catch (err: any) {
      alert(err.message || 'Error uploading photo');
    } finally {
      setAdminUploadingPhoto(false);
    }
  };

  const handleAdminRemovePhoto = (photoUrl: string) => {
    if (!editingUser) return;
    const newPhotos = (editingUser.photos || []).filter((p: string) => p !== photoUrl);
    const newPrimary = editingUser.primaryPhoto === photoUrl ? (newPhotos[0] || '') : editingUser.primaryPhoto;
    setEditingUser({
      ...editingUser,
      photos: newPhotos,
      primaryPhoto: newPrimary,
    });
  };

  const handleAdminSetPrimaryPhoto = (photoUrl: string) => {
    if (!editingUser) return;
    setEditingUser({
      ...editingUser,
      primaryPhoto: photoUrl,
    });
  };

  // Success Story Modal State (Add & Edit)
  const [showAddStory, setShowAddStory] = useState(false);
  const [editingStory, setEditingStory] = useState<any | null>(null);
  const [storyForm, setStoryForm] = useState<{
    namesEn: string;
    namesMr: string;
    locationEn: string;
    locationMr: string;
    quoteEn: string;
    quoteMr: string;
    photos: string[];
  }>({
    namesEn: '',
    namesMr: '',
    locationEn: '',
    locationMr: '',
    quoteEn: '',
    quoteMr: '',
    photos: [],
  });

  // Announcement state
  const [announcement, setAnnouncement] = useState({
    titleEn: '📢 Welcome to V Brothers Marriage Bureau!',
    titleMr: '📢 व्ही ब्रदर्स विवाह संस्थेमध्ये आपले स्वागत आहे!',
    messageEn: 'Welcome to V Brothers Marriage Bureau! Upload your PDF biodata to get 5x more responses from verified families.',
    messageMr: 'व्ही ब्रदर्स विवाह संस्थेमध्ये स्वागत आहे! अधिक प्रतिसादांसाठी आपला PDF बायोडाटा अपलोड करा.',
  });

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [sRes, uRes, rRes, stRes, cRes] = await Promise.all([
        fetchApi('/admin/stats'),
        fetchApi(`/admin/users?search=${encodeURIComponent(search)}`),
        fetchApi('/admin/reports'),
        fetchApi('/admin/stories'),
        fetchApi('/admin/site-content'),
      ]);
      setStats(sRes);
      setUsersList(uRes.users || []);
      setReportsList(rRes || []);
      setStoriesList(stRes || []);
      if (cRes) setSiteContent(cRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [search]);

  // Actions
  const handleToggleVerify = async (userId: string) => {
    try {
      const res = await fetchApi(`/admin/users/${userId}/verify`, { method: 'PUT' });
      setUsersList((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isVerified: res.isVerified ?? !u.isVerified } : u))
      );
      alert(res.message || 'Verification updated successfully!');
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Error updating verification');
      fetchAdminData();
    }
  };

  const handleToggleFeatured = async (userId: string) => {
    try {
      const res = await fetchApi(`/admin/users/${userId}/featured`, { method: 'PUT' });
      setUsersList((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isFeatured: res.isFeatured ?? !u.isFeatured } : u))
      );
      alert(res.message || 'Featured status updated!');
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Error updating featured status');
      fetchAdminData();
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetchApi(`/admin/users/${userId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      setUsersList((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: res.status || newStatus } : u))
      );
      alert(res.message || `Member status updated to ${newStatus.toUpperCase()}!`);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Error updating user status');
      fetchAdminData();
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this member profile?')) return;
    setUsersList((prev) => prev.filter((u) => u._id !== userId));
    try {
      await fetchApi(`/admin/users/${userId}`, { method: 'DELETE' });
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Error deleting user');
      fetchAdminData();
    }
  };

  const handleSaveUserEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const targetId = editingUser._id;
    setUsersList((prev) =>
      prev.map((u) => (u._id === targetId ? { ...u, ...editingUser } : u))
    );
    try {
      await fetchApi(`/admin/users/${targetId}/edit`, {
        method: 'PUT',
        body: JSON.stringify(editingUser),
      });
      setEditingUser(null);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Error updating user profile');
      fetchAdminData();
    }
  };

  const handleSaveSiteContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingContent(true);
    try {
      const res = await fetchApi('/admin/site-content', {
        method: 'PUT',
        body: JSON.stringify(siteContent),
      });
      alert(res.message || 'Site content updated and published live!');
    } catch (err: any) {
      alert(err.message || 'Error saving site content');
    } finally {
      setSavingContent(false);
    }
  };

  const handleOpenAddStory = () => {
    setEditingStory(null);
    setStoryForm({ namesEn: '', namesMr: '', locationEn: '', locationMr: '', quoteEn: '', quoteMr: '', photos: [] });
    setShowAddStory(true);
  };

  const handleOpenEditStory = (story: any) => {
    setEditingStory(story);
    const existingPhotos = story.photos && story.photos.length > 0 ? story.photos : (story.image ? [story.image] : []);
    setStoryForm({
      namesEn: story.namesEn || '',
      namesMr: story.namesMr || '',
      locationEn: story.locationEn || '',
      locationMr: story.locationMr || '',
      quoteEn: story.quoteEn || '',
      quoteMr: story.quoteMr || '',
      photos: existingPhotos,
    });
    setShowAddStory(true);
  };

  const handleStoryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setStoryForm((prev) => ({
            ...prev,
            photos: [...prev.photos, result],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveStoryPhoto = (index: number) => {
    setStoryForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyForm.namesEn || !storyForm.quoteEn) return;
    if (storyForm.photos.length === 0) {
      alert('Please upload at least 1 photo for this success story.');
      return;
    }
    try {
      const payload = {
        ...storyForm,
        image: storyForm.photos[0] || '',
      };
      if (editingStory) {
        await fetchApi(`/admin/stories/${editingStory.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await fetchApi('/admin/stories', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setShowAddStory(false);
      setEditingStory(null);
      setStoryForm({ namesEn: '', namesMr: '', locationEn: '', locationMr: '', quoteEn: '', quoteMr: '', photos: [] });
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Error saving success story');
    }
  };

  const handleDeleteStory = async (id: string) => {
    if (!window.confirm('Delete this success story from the homepage?')) return;
    try {
      await fetchApi(`/admin/stories/${id}`, { method: 'DELETE' });
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Error deleting story');
    }
  };

  const handleBroadcastAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetchApi('/admin/announcement', {
        method: 'POST',
        body: JSON.stringify(announcement),
      });
      alert(res.message || 'Announcement broadcasted successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to send announcement');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Header */}
      <div className="border-b border-ivory-300 pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="font-serif text-xl sm:text-3xl font-bold text-brand-950 flex items-center gap-2">
            <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-brand-700 shrink-0" />
            <span>Master Website CMS & Admin Control Center</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
            Complete administrative control over all member profiles, verification, PDF biodatas, site content & copy, success stories, and announcements.
          </p>
        </div>
      </div>

      {/* 5 Real-Time Admin Stat Cards (Optimized for Mobile & Desktop) */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-ivory-300 space-y-1 sm:space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-brand-900">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gold-600" />
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400">Total</span>
            </div>
            <div className="font-serif text-xl sm:text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
            <div className="text-[11px] sm:text-xs text-gray-500">Registered Members</div>
          </div>

          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-ivory-300 space-y-1 sm:space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-emerald-600">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400">Verified</span>
            </div>
            <div className="font-serif text-xl sm:text-2xl font-bold text-gray-900">{stats.verifiedUsers}</div>
            <div className="text-[11px] sm:text-xs text-gray-500">Verified Profiles</div>
          </div>

          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-ivory-300 space-y-1 sm:space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-brand-700">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-brand-700 fill-brand-700/20" />
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400">Stories</span>
            </div>
            <div className="font-serif text-xl sm:text-2xl font-bold text-gray-900">{stats.totalStories}</div>
            <div className="text-[11px] sm:text-xs text-gray-500">Homepage Stories</div>
          </div>

          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-ivory-300 space-y-1 sm:space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-gold-700">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gold-600" />
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400">Views</span>
            </div>
            <div className="font-serif text-xl sm:text-2xl font-bold text-gray-900">{stats.totalViews}</div>
            <div className="text-[11px] sm:text-xs text-gray-500">Profile Views Logged</div>
          </div>

          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-ivory-300 space-y-1 sm:space-y-2 shadow-xs col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-amber-600">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400">Reports</span>
            </div>
            <div className="font-serif text-xl sm:text-2xl font-bold text-gray-900">{stats.pendingReports}</div>
            <div className="text-[11px] sm:text-xs text-gray-500">Pending Reviews</div>
          </div>
        </div>
      )}

      {/* Responsive Horizontal Scroll Tabs */}
      <div className="flex border-b border-ivory-300 gap-2 sm:gap-6 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setTab('users')}
          className={`px-3 py-2 sm:px-0 sm:pb-3 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap rounded-xl sm:rounded-none ${
            tab === 'users'
              ? 'bg-brand-900 text-gold-300 sm:bg-transparent sm:text-brand-900 sm:border-b-2 sm:border-brand-900'
              : 'bg-ivory-100/80 text-gray-600 hover:text-gray-900 sm:bg-transparent sm:text-gray-500 sm:hover:text-gray-800'
          }`}
        >
          Member Profiles & Badges ({usersList.length})
        </button>
        <button
          onClick={() => setTab('stories')}
          className={`px-3 py-2 sm:px-0 sm:pb-3 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap rounded-xl sm:rounded-none ${
            tab === 'stories'
              ? 'bg-brand-900 text-gold-300 sm:bg-transparent sm:text-brand-900 sm:border-b-2 sm:border-brand-900'
              : 'bg-ivory-100/80 text-gray-600 hover:text-gray-900 sm:bg-transparent sm:text-gray-500 sm:hover:text-gray-800'
          }`}
        >
          Success Stories CMS ({storiesList.length})
        </button>
        <button
          onClick={() => setTab('content')}
          className={`px-3 py-2 sm:px-0 sm:pb-3 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap rounded-xl sm:rounded-none ${
            tab === 'content'
              ? 'bg-brand-900 text-gold-300 sm:bg-transparent sm:text-brand-900 sm:border-b-2 sm:border-brand-900'
              : 'bg-ivory-100/80 text-gray-600 hover:text-gray-900 sm:bg-transparent sm:text-gray-500 sm:hover:text-gray-800'
          }`}
        >
          Site Copy Editor
        </button>
        <button
          onClick={() => setTab('announcement')}
          className={`px-3 py-2 sm:px-0 sm:pb-3 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap rounded-xl sm:rounded-none ${
            tab === 'announcement'
              ? 'bg-brand-900 text-gold-300 sm:bg-transparent sm:text-brand-900 sm:border-b-2 sm:border-brand-900'
              : 'bg-ivory-100/80 text-gray-600 hover:text-gray-900 sm:bg-transparent sm:text-gray-500 sm:hover:text-gray-800'
          }`}
        >
          Announcements & Banners
        </button>
        <button
          onClick={() => setTab('reports')}
          className={`px-3 py-2 sm:px-0 sm:pb-3 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap rounded-xl sm:rounded-none ${
            tab === 'reports'
              ? 'bg-brand-900 text-gold-300 sm:bg-transparent sm:text-brand-900 sm:border-b-2 sm:border-brand-900'
              : 'bg-ivory-100/80 text-gray-600 hover:text-gray-900 sm:bg-transparent sm:text-gray-500 sm:hover:text-gray-800'
          }`}
        >
          Safety Reports ({reportsList.length})
        </button>
      </div>

      {/* TAB 1: User & Profile Management */}
      {tab === 'users' && (
        <div className="bg-white rounded-3xl border border-ivory-300 p-4 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, profile ID, city, or caste..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-900"
              />
            </div>
          </div>

          {/* DESKTOP TABLE VIEW (Preserved 100% on desktop md:block) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-100 text-gray-700 font-semibold border-b border-ivory-200">
                <tr>
                  <th className="p-3">User Details</th>
                  <th className="p-3">Profile ID</th>
                  <th className="p-3">Caste & Location</th>
                  <th className="p-3">PDF Privacy</th>
                  <th className="p-3">Badges</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-ivory-50">
                    <td className="p-3">
                      <div className="font-semibold text-gray-900">{u.fullName}</div>
                      <div className="text-gray-400 text-[10px]">{u.email} • {u.mobile}</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-brand-900">{u.profileId || 'N/A'}</td>
                    <td className="p-3">
                      <div className="font-medium text-gray-800">{u.caste || 'Maratha'}</div>
                      <div className="text-gray-500 text-[10px]">{u.city || 'Pune'}</div>
                    </td>
                    <td className="p-3">
                      <span className="bg-ivory-200 text-brand-950 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-ivory-300">
                        {u.biodataPrivacy || 'Connections Only'}
                      </span>
                    </td>
                    <td className="p-3 space-x-1">
                      {u.isVerified && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          Verified ✓
                        </span>
                      )}
                      {u.isFeatured && (
                        <span className="bg-gold-100 text-gold-900 text-[10px] font-bold px-2 py-0.5 rounded border border-gold-300">
                          Featured ⭐
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        u.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        {/* Verify */}
                        <button
                          onClick={() => handleToggleVerify(u._id)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                            u.isVerified ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-brand-900 text-gold-300 hover:bg-brand-950'
                          }`}
                          title="Toggle Verification"
                        >
                          {u.isVerified ? 'Verified ✓' : 'Verify'}
                        </button>

                        {/* Featured */}
                        <button
                          onClick={() => handleToggleFeatured(u._id)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                            u.isFeatured ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-gold-400 text-brand-950 hover:bg-gold-300'
                          }`}
                          title="Toggle Featured on Homepage"
                        >
                          {u.isFeatured ? 'Starred ⭐' : 'Unstar ⭐'}
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => setEditingUser(u)}
                          className="p-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
                          title="Edit Profile Content"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Block / Unblock Status Toggle */}
                        <button
                          onClick={() => handleToggleStatus(u._id, u.status)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer flex items-center gap-1 transition-colors ${
                            u.status === 'active' ? 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-300' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                          }`}
                          title={u.status === 'active' ? 'Block / Suspend Member' : 'Unblock / Activate Member'}
                        >
                          <Ban className="w-3 h-3" />
                          <span>{u.status === 'active' ? 'Block' : 'Unblock'}</span>
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 cursor-pointer"
                          title="Delete Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE RESPONSIVE CARDS VIEW (< md screen size) */}
          <div className="block md:hidden space-y-3">
            {usersList.map((u) => (
              <div key={u._id} className="p-4 rounded-2xl border border-ivory-300 bg-ivory-50/40 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{u.fullName}</h3>
                    <p className="text-[11px] text-gray-500 font-mono">{u.email}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded shrink-0 ${
                    u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {u.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-700">
                  <span className="font-mono font-bold text-brand-900 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                    ID: {u.profileId || 'N/A'}
                  </span>
                  <span>{u.caste || 'Maratha'} • {u.city || 'Pune'}</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {u.isVerified && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      Verified ✓
                    </span>
                  )}
                  {u.isFeatured && (
                    <span className="bg-gold-100 text-gold-900 text-[10px] font-bold px-2 py-0.5 rounded border border-gold-300">
                      Featured ⭐
                    </span>
                  )}
                  <span className="bg-ivory-200 text-brand-950 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-ivory-300">
                    PDF: {u.biodataPrivacy || 'Connections Only'}
                  </span>
                </div>

                {/* Touch-Friendly Action Buttons */}
                <div className="pt-2 border-t border-ivory-200 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleToggleVerify(u._id)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold text-center cursor-pointer ${
                      u.isVerified ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-brand-900 text-gold-300'
                    }`}
                  >
                    {u.isVerified ? 'Verified ✓' : 'Verify'}
                  </button>

                  <button
                    onClick={() => handleToggleFeatured(u._id)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold text-center cursor-pointer ${
                      u.isFeatured ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-gold-400 text-brand-950'
                    }`}
                  >
                    {u.isFeatured ? 'Starred ⭐' : 'Unstar ⭐'}
                  </button>

                  <button
                    onClick={() => setEditingUser(u)}
                    className="p-1.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 cursor-pointer"
                    title="Edit Profile Content"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleToggleStatus(u._id, u.status)}
                    className={`px-2 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 cursor-pointer ${
                      u.status === 'active' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                    title={u.status === 'active' ? 'Block / Suspend Member' : 'Unblock / Activate Member'}
                  >
                    <Ban className="w-4 h-4" />
                    <span>{u.status === 'active' ? 'Block' : 'Unblock'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    className="p-1.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 cursor-pointer"
                    title="Delete Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: Success Stories CMS */}
      {tab === 'stories' && (
        <div className="bg-white rounded-3xl border border-ivory-300 p-4 sm:p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif font-bold text-brand-950 text-base sm:text-lg">Homepage Success Stories CMS</h3>
              <p className="text-[11px] sm:text-xs text-gray-500">Manage happy couple testimonials displayed on the homepage.</p>
            </div>
            <button
              onClick={handleOpenAddStory}
              className="px-4 py-2.5 bg-brand-900 text-gold-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:bg-brand-950 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Success Story</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {storiesList.map((story) => (
              <div key={story.id} className="border border-ivory-300 rounded-2xl p-4 space-y-3 relative bg-ivory-50/50">
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditStory(story)}
                    className="p-1.5 bg-brand-50 text-brand-900 border border-brand-200 rounded-full hover:bg-brand-100 cursor-pointer"
                    title="Edit Story"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteStory(story.id)}
                    className="p-1.5 bg-red-100 text-red-700 rounded-full hover:bg-red-200 cursor-pointer"
                    title="Delete Story"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <div className="font-bold text-brand-950 text-base pr-16">{story.namesEn} ({story.namesMr})</div>
                <div className="text-xs text-gray-500 font-medium">{story.locationEn}</div>
                <p className="text-xs text-gray-700 italic bg-white p-3 rounded-xl border border-ivory-200">
                  "{story.quoteEn}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Website Site Content & Copy Editor */}
      {tab === 'content' && (
        <form onSubmit={handleSaveSiteContent} className="bg-white rounded-3xl border border-ivory-300 p-4 sm:p-6 space-y-6 max-w-3xl shadow-sm">
          <div>
            <h3 className="font-serif font-bold text-brand-950 text-base sm:text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-gold-600" />
              <span>Website Site Content & Copy Editor</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
              Edit live homepage headlines, subtitles, support contact numbers, and office addresses.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Hero Headline (English)</label>
                <input
                  type="text"
                  value={siteContent.heroHeadlineEn || ''}
                  onChange={(e) => setSiteContent({ ...siteContent, heroHeadlineEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Hero Headline (मराठी)</label>
                <input
                  type="text"
                  value={siteContent.heroHeadlineMr || ''}
                  onChange={(e) => setSiteContent({ ...siteContent, heroHeadlineMr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Hero Subtitle (English)</label>
                <textarea
                  value={siteContent.heroSubtitleEn || ''}
                  onChange={(e) => setSiteContent({ ...siteContent, heroSubtitleEn: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Hero Subtitle (मराठी)</label>
                <textarea
                  value={siteContent.heroSubtitleMr || ''}
                  onChange={(e) => setSiteContent({ ...siteContent, heroSubtitleMr: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Support Phone Number</label>
                <input
                  type="text"
                  value={siteContent.supportPhone || ''}
                  onChange={(e) => setSiteContent({ ...siteContent, supportPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Support Email Address</label>
                <input
                  type="email"
                  value={siteContent.supportEmail || ''}
                  onChange={(e) => setSiteContent({ ...siteContent, supportEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Pune HQ Office Address</label>
                <input
                  type="text"
                  value={siteContent.puneOffice || ''}
                  onChange={(e) => setSiteContent({ ...siteContent, puneOffice: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mumbai Office Address</label>
                <input
                  type="text"
                  value={siteContent.mumbaiOffice || ''}
                  onChange={(e) => setSiteContent({ ...siteContent, mumbaiOffice: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingContent}
            className="w-full sm:w-auto px-6 py-3 bg-brand-900 text-gold-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md hover:bg-brand-950"
          >
            <Save className="w-4 h-4" />
            <span>{savingContent ? 'Saving...' : 'Save & Publish Live Site Content'}</span>
          </button>
        </form>
      )}

      {/* TAB 4: System Announcements & Banners */}
      {tab === 'announcement' && (
        <form onSubmit={handleBroadcastAnnouncement} className="bg-white rounded-3xl border border-ivory-300 p-4 sm:p-6 space-y-4 max-w-2xl shadow-sm">
          <h3 className="font-serif font-bold text-brand-950 text-base">Broadcast System Notification & Banner</h3>
          <p className="text-[11px] sm:text-xs text-gray-500">
            Sends an instant notification alert to all registered members on their header bell dropdown.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Title (English)</label>
              <input
                type="text"
                value={announcement.titleEn}
                onChange={(e) => setAnnouncement({ ...announcement, titleEn: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Title (मराठी)</label>
              <input
                type="text"
                value={announcement.titleMr}
                onChange={(e) => setAnnouncement({ ...announcement, titleMr: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border text-xs"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Message (English)</label>
              <textarea
                value={announcement.messageEn}
                onChange={(e) => setAnnouncement({ ...announcement, messageEn: e.target.value })}
                rows={2}
                className="w-full p-3 rounded-xl border text-xs"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Message (मराठी)</label>
              <textarea
                value={announcement.messageMr}
                onChange={(e) => setAnnouncement({ ...announcement, messageMr: e.target.value })}
                rows={2}
                className="w-full p-3 rounded-xl border text-xs"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-brand-900 text-gold-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Broadcast Notification</span>
          </button>
        </form>
      )}

      {/* TAB 5: Reports Review */}
      {tab === 'reports' && (
        <div className="bg-white rounded-3xl border border-ivory-300 p-4 sm:p-6 space-y-4 shadow-sm">
          {reportsList.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-6">No reported profiles to review.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {reportsList.map((r) => (
                <div key={r._id} className="py-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-red-600">Reason: {r.reason}</span>
                    <span className="text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-gray-700">
                    Reporter: <strong>{r.reporterId?.fullName}</strong> ({r.reporterId?.email}) reported User:{' '}
                    <strong>{r.reportedUserId?.fullName}</strong> ({r.reportedUserId?.email})
                  </p>
                  {r.details && <p className="text-xs text-gray-500 bg-ivory-100 p-2.5 rounded-xl">{r.details}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* EDIT MEMBER MODAL (Full Admin Control) */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-4 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[92vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ivory-300 pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-900 text-gold-300 flex items-center justify-center font-bold text-sm">
                  {editingUser.fullName?.[0] || 'U'}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-brand-950 text-base flex items-center gap-2">
                    <span>Edit Profile: {editingUser.fullName}</span>
                    <span className="text-xs font-mono font-normal text-gold-600 bg-gold-50 px-2 py-0.5 rounded-full border border-gold-200">
                      ID: {editingUser.profileId}
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-500">Full Admin Management & Credentials Control</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Admin Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto border-b border-ivory-200 bg-ivory-50/50 p-1 rounded-2xl shrink-0 text-xs">
              <button
                type="button"
                onClick={() => setAdminUserTab('account')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  adminUserTab === 'account'
                    ? 'bg-brand-900 text-gold-300 shadow-xs'
                    : 'text-gray-600 hover:bg-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Account & Password</span>
              </button>

              <button
                type="button"
                onClick={() => setAdminUserTab('personal')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  adminUserTab === 'personal'
                    ? 'bg-brand-900 text-gold-300 shadow-xs'
                    : 'text-gray-600 hover:bg-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Personal Info</span>
              </button>

              <button
                type="button"
                onClick={() => setAdminUserTab('career')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  adminUserTab === 'career'
                    ? 'bg-brand-900 text-gold-300 shadow-xs'
                    : 'text-gray-600 hover:bg-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Education & Job</span>
              </button>

              <button
                type="button"
                onClick={() => setAdminUserTab('family')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  adminUserTab === 'family'
                    ? 'bg-brand-900 text-gold-300 shadow-xs'
                    : 'text-gray-600 hover:bg-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Family Details</span>
              </button>

              <button
                type="button"
                onClick={() => setAdminUserTab('photos')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  adminUserTab === 'photos'
                    ? 'bg-brand-900 text-gold-300 shadow-xs'
                    : 'text-gray-600 hover:bg-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Photos Gallery</span>
              </button>

              <button
                type="button"
                onClick={() => setAdminUserTab('partner')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  adminUserTab === 'partner'
                    ? 'bg-brand-900 text-gold-300 shadow-xs'
                    : 'text-gray-600 hover:bg-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Partner Preferences</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveUserEdit} className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
              
              {/* TAB 1: ACCOUNT & PASSWORD */}
              {adminUserTab === 'account' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-amber-50/70 border border-amber-200 text-amber-900 p-3 rounded-2xl flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Admin Security Settings: You can reset member password and change account status directly.</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={editingUser.fullName || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                        className="w-full p-2.5 border rounded-xl"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={editingUser.email || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                        className="w-full p-2.5 border rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Mobile Phone</label>
                      <input
                        type="text"
                        value={editingUser.mobile || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, mobile: e.target.value })}
                        className="w-full p-2.5 border rounded-xl"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-gray-700 mb-1">User Password 🔑</label>
                      <div className="relative">
                        <input
                          type={adminShowPassword ? 'text' : 'password'}
                          value={editingUser.password || ''}
                          onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                          placeholder="Password (e.g. Password@123)"
                          className="w-full p-2.5 pr-10 border rounded-xl font-mono text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setAdminShowPassword(!adminShowPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700 cursor-pointer"
                        >
                          {adminShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">Admin can view or change password for any candidate.</p>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Account Role</label>
                      <select
                        value={editingUser.role || 'user'}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        className="w-full p-2.5 border rounded-xl"
                      >
                        <option value="user">User (Standard Member)</option>
                        <option value="admin">Admin (System Administrator)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Account Status</label>
                      <select
                        value={editingUser.status || 'active'}
                        onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                        className="w-full p-2.5 border rounded-xl"
                      >
                        <option value="active">Active (Normal Access)</option>
                        <option value="suspended">Suspended (Blocked Access)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Verification Status</label>
                      <select
                        value={editingUser.isVerified ? 'true' : 'false'}
                        onChange={(e) => setEditingUser({ ...editingUser, isVerified: e.target.value === 'true' })}
                        className="w-full p-2.5 border rounded-xl"
                      >
                        <option value="true">Verified ✓ (Green Badge)</option>
                        <option value="false">Unverified</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Featured Badge</label>
                      <select
                        value={editingUser.isFeatured ? 'true' : 'false'}
                        onChange={(e) => setEditingUser({ ...editingUser, isFeatured: e.target.value === 'true' })}
                        className="w-full p-2.5 border rounded-xl"
                      >
                        <option value="true">Featured ⭐ (Highlighted Member)</option>
                        <option value="false">Normal Listing</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-gray-700 mb-1">PDF Biodata Privacy Setting</label>
                      <select
                        value={editingUser.biodataPrivacy || editingUser.biodataVisibility || 'Connections Only'}
                        onChange={(e) => setEditingUser({ ...editingUser, biodataPrivacy: e.target.value, biodataVisibility: e.target.value })}
                        className="w-full p-2.5 border rounded-xl"
                      >
                        <option value="Connections Only">Connections Only (Recommended)</option>
                        <option value="Visible to All">Visible to All</option>
                        <option value="Private">Private</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PERSONAL INFO */}
              {adminUserTab === 'personal' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Gender</label>
                    <select
                      value={editingUser.gender || 'male'}
                      onChange={(e) => setEditingUser({ ...editingUser, gender: e.target.value })}
                      className="w-full p-2.5 border rounded-xl capitalize"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Age (Years)</label>
                    <input
                      type="number"
                      value={editingUser.age || 26}
                      onChange={(e) => setEditingUser({ ...editingUser, age: Number(e.target.value) })}
                      min="18"
                      max="80"
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Height</label>
                    <input
                      type="text"
                      value={editingUser.height || "5'8\""}
                      onChange={(e) => setEditingUser({ ...editingUser, height: e.target.value })}
                      placeholder="e.g. 5'8&quot;"
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Marital Status</label>
                    <select
                      value={editingUser.maritalStatus || 'never_married'}
                      onChange={(e) => setEditingUser({ ...editingUser, maritalStatus: e.target.value })}
                      className="w-full p-2.5 border rounded-xl capitalize"
                    >
                      <option value="never_married">Never Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                      <option value="awaiting_divorce">Awaiting Divorce</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Religion</label>
                    <input
                      type="text"
                      value={editingUser.religion || 'Hindu'}
                      onChange={(e) => setEditingUser({ ...editingUser, religion: e.target.value })}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Caste</label>
                    <input
                      type="text"
                      value={editingUser.caste || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, caste: e.target.value })}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Sub-Caste</label>
                    <input
                      type="text"
                      value={editingUser.subCaste || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, subCaste: e.target.value })}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Mother Tongue</label>
                    <input
                      type="text"
                      value={editingUser.motherTongue || 'Marathi'}
                      onChange={(e) => setEditingUser({ ...editingUser, motherTongue: e.target.value })}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={editingUser.city || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, city: e.target.value })}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={editingUser.state || 'Maharashtra'}
                      onChange={(e) => setEditingUser({ ...editingUser, state: e.target.value })}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-gray-700 mb-1">About Candidate</label>
                    <textarea
                      value={editingUser.aboutMe || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, aboutMe: e.target.value })}
                      rows={3}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: CAREER & EDUCATION */}
              {adminUserTab === 'career' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Education Degree</label>
                    <input
                      type="text"
                      value={editingUser.education || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, education: e.target.value })}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">College / University</label>
                    <input
                      type="text"
                      value={editingUser.college || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, college: e.target.value })}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Occupation / Designation</label>
                    <input
                      type="text"
                      value={editingUser.occupation || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, occupation: e.target.value })}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={editingUser.company || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, company: e.target.value })}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-gray-700 mb-1">Annual Income</label>
                    <input
                      type="text"
                      value={editingUser.income || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, income: e.target.value })}
                      placeholder="e.g. ₹10 - ₹15 Lakhs p.a."
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: FAMILY DETAILS */}
              {adminUserTab === 'family' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Father's Occupation</label>
                    <input
                      type="text"
                      value={editingUser.fatherOccupation || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, fatherOccupation: e.target.value })}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Mother's Occupation</label>
                    <input
                      type="text"
                      value={editingUser.motherOccupation || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, motherOccupation: e.target.value })}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Family Type</label>
                    <select
                      value={editingUser.familyType || 'nuclear'}
                      onChange={(e) => setEditingUser({ ...editingUser, familyType: e.target.value })}
                      className="w-full p-2.5 border rounded-xl capitalize"
                    >
                      <option value="nuclear">Nuclear Family</option>
                      <option value="joint">Joint Family</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Family Values</label>
                    <select
                      value={editingUser.familyValues || 'moderate'}
                      onChange={(e) => setEditingUser({ ...editingUser, familyValues: e.target.value })}
                      className="w-full p-2.5 border rounded-xl capitalize"
                    >
                      <option value="traditional">Traditional</option>
                      <option value="moderate">Moderate</option>
                      <option value="liberal">Liberal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Number of Brothers</label>
                    <input
                      type="number"
                      value={editingUser.brothers ?? 0}
                      onChange={(e) => setEditingUser({ ...editingUser, brothers: Number(e.target.value) })}
                      min="0"
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Number of Sisters</label>
                    <input
                      type="number"
                      value={editingUser.sisters ?? 0}
                      onChange={(e) => setEditingUser({ ...editingUser, sisters: Number(e.target.value) })}
                      min="0"
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* TAB 5: PHOTOS GALLERY */}
              {adminUserTab === 'photos' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="border-2 border-dashed border-ivory-300 hover:border-gold-500 bg-ivory-50 p-4 rounded-2xl text-center transition-all cursor-pointer relative">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleAdminPhotoUpload}
                      disabled={adminUploadingPhoto}
                      className="hidden"
                      id="admin-photo-upload"
                    />
                    <label
                      htmlFor="admin-photo-upload"
                      className="cursor-pointer flex flex-col items-center justify-center gap-1 text-xs text-gray-600"
                    >
                      <Camera className="w-8 h-8 text-brand-900" />
                      <span className="font-bold text-brand-950 text-sm">
                        {adminUploadingPhoto ? 'Uploading Photos...' : 'Admin Upload Photos for User'}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        Upload single or multiple candidate photos directly to Firebase Storage
                      </span>
                    </label>
                  </div>

                  {Array.isArray(editingUser.photos) && editingUser.photos.length > 0 ? (
                    <div className="space-y-2">
                      <span className="font-semibold text-gray-700">
                        Candidate Photos ({editingUser.photos.length}):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {editingUser.photos.map((photo: string, idx: number) => {
                          const isPrimary = editingUser.primaryPhoto === photo;
                          return (
                            <div key={idx} className="relative group border rounded-xl overflow-hidden bg-gray-100 h-28 shadow-xs">
                              <img src={photo} alt={`Candidate Photo ${idx + 1}`} className="w-full h-full object-cover" />
                              {isPrimary && (
                                <span className="absolute top-1 left-1 bg-gold-400 text-brand-950 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                                  Primary ⭐
                                </span>
                              )}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                {!isPrimary && (
                                  <button
                                    type="button"
                                    onClick={() => handleAdminSetPrimaryPhoto(photo)}
                                    className="px-2 py-1 bg-gold-400 text-brand-950 text-[10px] font-bold rounded hover:bg-gold-300"
                                  >
                                    Set Main
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleAdminRemovePhoto(photo)}
                                  className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                                  title="Delete photo"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-center py-4 text-gray-400">No photos currently uploaded for this user.</p>
                  )}
                </div>
              )}

              {/* TAB 6: PARTNER PREFERENCES */}
              {adminUserTab === 'partner' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Preferred Min Age</label>
                    <input
                      type="number"
                      value={editingUser.partnerMinAge ?? editingUser.partnerPreferences?.minAge ?? 21}
                      onChange={(e) => setEditingUser({ ...editingUser, partnerMinAge: Number(e.target.value) })}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Preferred Max Age</label>
                    <input
                      type="number"
                      value={editingUser.partnerMaxAge ?? editingUser.partnerPreferences?.maxAge ?? 35}
                      onChange={(e) => setEditingUser({ ...editingUser, partnerMaxAge: Number(e.target.value) })}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Preferred Education</label>
                    <input
                      type="text"
                      value={editingUser.partnerEducation ?? editingUser.partnerPreferences?.education ?? 'Graduate'}
                      onChange={(e) => setEditingUser({ ...editingUser, partnerEducation: e.target.value })}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Preferred Occupation</label>
                    <input
                      type="text"
                      value={editingUser.partnerOccupation ?? editingUser.partnerPreferences?.occupation ?? 'Any'}
                      onChange={(e) => setEditingUser({ ...editingUser, partnerOccupation: e.target.value })}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-gray-700 mb-1">Preferred Location</label>
                    <input
                      type="text"
                      value={editingUser.partnerLocation ?? editingUser.partnerPreferences?.location ?? 'Maharashtra'}
                      onChange={(e) => setEditingUser({ ...editingUser, partnerLocation: e.target.value })}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-ivory-300 flex items-center justify-between shrink-0">
                <span className="text-[11px] text-gray-400">All changes will be updated live across the database.</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-900 text-gold-300 font-bold rounded-xl hover:bg-brand-950 shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT SUCCESS STORY MODAL (Mobile Responsive) */}
      {showAddStory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-ivory-300 pb-3">
              <h3 className="font-serif font-bold text-brand-950 text-base">
                {editingStory ? 'Edit Success Story' : 'Add New Success Story to Homepage'}
              </h3>
              <button onClick={() => setShowAddStory(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStory} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Names (English)</label>
                  <input
                    type="text"
                    value={storyForm.namesEn}
                    onChange={(e) => setStoryForm({ ...storyForm, namesEn: e.target.value })}
                    placeholder="e.g. Suyash & Priya"
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Names (मराठी)</label>
                  <input
                    type="text"
                    value={storyForm.namesMr}
                    onChange={(e) => setStoryForm({ ...storyForm, namesMr: e.target.value })}
                    placeholder="e.g. सुयश आणि प्रिया"
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Location & Date (EN)</label>
                  <input
                    type="text"
                    value={storyForm.locationEn}
                    onChange={(e) => setStoryForm({ ...storyForm, locationEn: e.target.value })}
                    placeholder="e.g. Married Dec 2025 • Pune"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Location & Date (मराठी)</label>
                  <input
                    type="text"
                    value={storyForm.locationMr}
                    onChange={(e) => setStoryForm({ ...storyForm, locationMr: e.target.value })}
                    placeholder="e.g. विवाह: डिसेंबर २०२५ • पुणे"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Quote (English)</label>
                <textarea
                  value={storyForm.quoteEn}
                  onChange={(e) => setStoryForm({ ...storyForm, quoteEn: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Quote (मराठी)</label>
                <textarea
                  value={storyForm.quoteMr}
                  onChange={(e) => setStoryForm({ ...storyForm, quoteMr: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              {/* Multi-Photo Upload Area */}
              <div className="space-y-2">
                <label className="block font-semibold text-gray-700">
                  Couple Photos (Upload Multiple Photos)
                </label>
                
                <div className="border-2 border-dashed border-ivory-300 hover:border-gold-500 bg-ivory-50/60 hover:bg-gold-50/40 p-4 rounded-2xl text-center transition-all cursor-pointer relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleStoryFileUpload}
                    className="hidden"
                    id="story-photos-upload"
                  />
                  <label
                    htmlFor="story-photos-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-1 text-xs text-gray-600"
                  >
                    <UploadCloud className="w-8 h-8 text-brand-900" />
                    <span className="font-bold text-brand-950 text-sm">
                      Click to Select & Upload Photos
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Supports PNG, JPG, WEBP • You can select multiple images at once
                    </span>
                  </label>
                </div>

                {/* Photos Preview Grid */}
                {storyForm.photos.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-bold text-gray-600">
                      Uploaded Gallery Photos ({storyForm.photos.length}):
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1.5 bg-gray-50 rounded-xl border border-gray-200">
                      {storyForm.photos.map((photo, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group shadow-xs bg-white"
                        >
                          <img
                            src={photo}
                            alt={`Upload ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 bg-gold-400 text-brand-950 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                              Cover 🌟
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveStoryPhoto(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-90 hover:opacity-100 cursor-pointer shadow-sm transition-opacity"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStory(false)}
                  className="px-4 py-2 border rounded-xl text-gray-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-900 text-gold-300 font-bold rounded-xl cursor-pointer"
                >
                  {editingStory ? 'Save Changes' : 'Publish Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
