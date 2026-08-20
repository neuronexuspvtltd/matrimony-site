import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { fetchApi } from '../services/api';
import {
  Shield,
  Users,
  ShieldCheck,
  Eye,
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
    supportPhone: '+91 98765 43210',
    supportEmail: 'support@pavithrabandhan.com',
    puneOffice: 'FC Road, Shivajinagar, Pune',
    mumbaiOffice: 'Nariman Point, Mumbai',
  });

  const [tab, setTab] = useState<'users' | 'stories' | 'content' | 'announcement' | 'reports'>('users');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [savingContent, setSavingContent] = useState(false);

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<any | null>(null);

  // Success Story Modal State (Add & Edit)
  const [showAddStory, setShowAddStory] = useState(false);
  const [editingStory, setEditingStory] = useState<any | null>(null);
  const [storyForm, setStoryForm] = useState({
    namesEn: '',
    namesMr: '',
    locationEn: '',
    locationMr: '',
    quoteEn: '',
    quoteMr: '',
    image: '',
  });

  // Announcement state
  const [announcement, setAnnouncement] = useState({
    titleEn: 'Festive Offer: Free Profile Verification',
    titleMr: 'उत्सव विशेष: मोफत प्रोफाईल पडताळणी',
    messageEn: 'Welcome to Pavithra Bandhan! Upload your PDF biodata to get 5x more responses from verified families.',
    messageMr: 'पावित्र्य बंधन मध्ये स्वागत आहे! अधिक प्रतिसादांसाठी आपला PDF बायोडाटा अपलोड करा.',
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
      await fetchApi(`/admin/users/${userId}/verify`, { method: 'PUT' });
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Error updating verification');
    }
  };

  const handleToggleFeatured = async (userId: string) => {
    try {
      await fetchApi(`/admin/users/${userId}/featured`, { method: 'PUT' });
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Error updating featured status');
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await fetchApi(`/admin/users/${userId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Error updating user status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this member profile?')) return;
    try {
      await fetchApi(`/admin/users/${userId}`, { method: 'DELETE' });
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Error deleting user');
    }
  };

  const handleSaveUserEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await fetchApi(`/admin/users/${editingUser._id}/edit`, {
        method: 'PUT',
        body: JSON.stringify(editingUser),
      });
      setEditingUser(null);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Error updating user profile');
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
    setStoryForm({ namesEn: '', namesMr: '', locationEn: '', locationMr: '', quoteEn: '', quoteMr: '', image: '' });
    setShowAddStory(true);
  };

  const handleOpenEditStory = (story: any) => {
    setEditingStory(story);
    setStoryForm({
      namesEn: story.namesEn || '',
      namesMr: story.namesMr || '',
      locationEn: story.locationEn || '',
      locationMr: story.locationMr || '',
      quoteEn: story.quoteEn || '',
      quoteMr: story.quoteMr || '',
      image: story.image || '',
    });
    setShowAddStory(true);
  };

  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyForm.namesEn || !storyForm.quoteEn) return;
    try {
      if (editingStory) {
        await fetchApi(`/admin/stories/${editingStory.id}`, {
          method: 'PUT',
          body: JSON.stringify(storyForm),
        });
      } else {
        await fetchApi('/admin/stories', {
          method: 'POST',
          body: JSON.stringify(storyForm),
        });
      }
      setShowAddStory(false);
      setEditingStory(null);
      setStoryForm({ namesEn: '', namesMr: '', locationEn: '', locationMr: '', quoteEn: '', quoteMr: '', image: '' });
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-ivory-300 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-950 flex items-center gap-2">
            <Shield className="w-7 h-7 text-brand-700" />
            <span>Master Website CMS & Admin Control Center</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Complete administrative control over all member profiles, verification, PDF biodatas, site content & copy, success stories, and announcements.
          </p>
        </div>
      </div>

      {/* 5 Real-Time Admin Stat Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-ivory-300 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-brand-900">
              <Users className="w-5 h-5 text-gold-600" />
              <span className="text-[10px] uppercase font-bold text-gray-400">Total</span>
            </div>
            <div className="font-serif text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
            <div className="text-xs text-gray-500">Registered Members</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-ivory-300 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] uppercase font-bold text-gray-400">Verified</span>
            </div>
            <div className="font-serif text-2xl font-bold text-gray-900">{stats.verifiedUsers}</div>
            <div className="text-xs text-gray-500">Verified Profiles</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-ivory-300 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-brand-700">
              <Heart className="w-5 h-5 text-brand-700 fill-brand-700/20" />
              <span className="text-[10px] uppercase font-bold text-gray-400">Stories</span>
            </div>
            <div className="font-serif text-2xl font-bold text-gray-900">{stats.totalStories}</div>
            <div className="text-xs text-gray-500">Homepage Stories</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-ivory-300 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-gold-700">
              <Eye className="w-5 h-5 text-gold-600" />
              <span className="text-[10px] uppercase font-bold text-gray-400">Views</span>
            </div>
            <div className="font-serif text-2xl font-bold text-gray-900">{stats.totalViews}</div>
            <div className="text-xs text-gray-500">Profile Views Logged</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-ivory-300 space-y-2 shadow-xs col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-[10px] uppercase font-bold text-gray-400">Reports</span>
            </div>
            <div className="font-serif text-2xl font-bold text-gray-900">{stats.pendingReports}</div>
            <div className="text-xs text-gray-500">Pending Reviews</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-ivory-300 gap-6 overflow-x-auto">
        <button
          onClick={() => setTab('users')}
          className={`pb-3 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            tab === 'users' ? 'border-b-2 border-brand-900 text-brand-900' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Member Profiles & Badges ({usersList.length})
        </button>
        <button
          onClick={() => setTab('stories')}
          className={`pb-3 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            tab === 'stories' ? 'border-b-2 border-brand-900 text-brand-900' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Success Stories CMS ({storiesList.length})
        </button>
        <button
          onClick={() => setTab('content')}
          className={`pb-3 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            tab === 'content' ? 'border-b-2 border-brand-900 text-brand-900' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Website Site Content & Copy Editor
        </button>
        <button
          onClick={() => setTab('announcement')}
          className={`pb-3 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            tab === 'announcement' ? 'border-b-2 border-brand-900 text-brand-900' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          System Announcements & Banners
        </button>
        <button
          onClick={() => setTab('reports')}
          className={`pb-3 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            tab === 'reports' ? 'border-b-2 border-brand-900 text-brand-900' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Safety Reports ({reportsList.length})
        </button>
      </div>

      {/* TAB 1: User & Profile Management */}
      {tab === 'users' && (
        <div className="bg-white rounded-3xl border border-ivory-300 p-6 space-y-4 shadow-sm">
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

          <div className="overflow-x-auto">
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
                          className="px-2 py-1 bg-brand-900 text-gold-300 rounded-lg text-[10px] font-semibold cursor-pointer"
                          title="Toggle Verification"
                        >
                          {u.isVerified ? 'Unverify' : 'Verify'}
                        </button>

                        {/* Featured */}
                        <button
                          onClick={() => handleToggleFeatured(u._id)}
                          className="px-2 py-1 bg-gold-400 text-brand-950 rounded-lg text-[10px] font-bold cursor-pointer"
                          title="Toggle Featured on Homepage"
                        >
                          {u.isFeatured ? 'Unstar' : 'Feature ⭐'}
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => setEditingUser(u)}
                          className="p-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
                          title="Edit Profile Content"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Status Suspend */}
                        <button
                          onClick={() => handleToggleStatus(u._id, u.status)}
                          className={`p-1 rounded-lg cursor-pointer ${
                            u.status === 'active' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}
                          title={u.status === 'active' ? 'Suspend Member' : 'Activate Member'}
                        >
                          <Ban className="w-3.5 h-3.5" />
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
        </div>
      )}

      {/* TAB 2: Success Stories CMS */}
      {tab === 'stories' && (
        <div className="bg-white rounded-3xl border border-ivory-300 p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-brand-950 text-lg">Homepage Success Stories CMS</h3>
              <p className="text-xs text-gray-500">Manage happy couple testimonials displayed on the homepage.</p>
            </div>
            <button
              onClick={handleOpenAddStory}
              className="px-4 py-2 bg-brand-900 text-gold-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm hover:bg-brand-950"
            >
              <Plus className="w-4 h-4" />
              <span>Add Success Story</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <form onSubmit={handleSaveSiteContent} className="bg-white rounded-3xl border border-ivory-300 p-6 space-y-6 max-w-3xl shadow-sm">
          <div>
            <h3 className="font-serif font-bold text-brand-950 text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-gold-600" />
              <span>Website Site Content & Copy Editor</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
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
            className="px-6 py-3 bg-brand-900 text-gold-300 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md hover:bg-brand-950"
          >
            <Save className="w-4 h-4" />
            <span>{savingContent ? 'Saving...' : 'Save & Publish Live Site Content'}</span>
          </button>
        </form>
      )}

      {/* TAB 4: System Announcements & Banners */}
      {tab === 'announcement' && (
        <form onSubmit={handleBroadcastAnnouncement} className="bg-white rounded-3xl border border-ivory-300 p-6 space-y-4 max-w-2xl shadow-sm">
          <h3 className="font-serif font-bold text-brand-950 text-base">Broadcast System Notification & Banner</h3>
          <p className="text-xs text-gray-500">
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
            className="px-6 py-3 bg-brand-900 text-gold-300 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Broadcast Notification</span>
          </button>
        </form>
      )}

      {/* TAB 5: Reports Review */}
      {tab === 'reports' && (
        <div className="bg-white rounded-3xl border border-ivory-300 p-6 space-y-4 shadow-sm">
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

      {/* EDIT MEMBER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ivory-300 pb-3">
              <h3 className="font-serif font-bold text-brand-950 text-base">Edit Member Profile ({editingUser.profileId})</h3>
              <button onClick={() => setEditingUser(null)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingUser.fullName}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={editingUser.city}
                  onChange={(e) => setEditingUser({ ...editingUser, city: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Caste</label>
                <input
                  type="text"
                  value={editingUser.caste}
                  onChange={(e) => setEditingUser({ ...editingUser, caste: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">PDF Biodata Privacy Setting</label>
                <select
                  value={editingUser.biodataPrivacy || 'Connections Only'}
                  onChange={(e) => setEditingUser({ ...editingUser, biodataPrivacy: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                >
                  <option value="Connections Only">Connections Only (Recommended)</option>
                  <option value="Visible to All">Visible to All</option>
                  <option value="Private">Private</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border rounded-xl text-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-900 text-gold-300 font-bold rounded-xl"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT SUCCESS STORY MODAL */}
      {showAddStory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ivory-300 pb-3">
              <h3 className="font-serif font-bold text-brand-950 text-base">
                {editingStory ? 'Edit Success Story' : 'Add New Success Story to Homepage'}
              </h3>
              <button onClick={() => setShowAddStory(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStory} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
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

              <div className="grid grid-cols-2 gap-3">
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

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Couple Photo Image URL</label>
                <input
                  type="text"
                  value={storyForm.image}
                  onChange={(e) => setStoryForm({ ...storyForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStory(false)}
                  className="px-4 py-2 border rounded-xl text-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-900 text-gold-300 font-bold rounded-xl"
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
