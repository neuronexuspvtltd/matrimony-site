import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { fetchApi } from '../services/api';
import { Shield, Users, ShieldCheck, Eye, AlertTriangle, Send, Search, Check, Ban } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { t, language } = useLanguage();

  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [reportsList, setReportsList] = useState<any[]>([]);
  const [tab, setTab] = useState<'users' | 'reports' | 'announcement'>('users');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Announcement state
  const [announcement, setAnnouncement] = useState({
    titleEn: 'Platform Update',
    titleMr: 'महत्त्वाची सूचना',
    messageEn: 'Welcome to Pavithra Bandhan! Upload your PDF biodata to receive more responses.',
    messageMr: 'पावित्र्य बंधन मध्ये स्वागत आहे! अधिक प्रतिसादांसाठी आपला PDF बायोडाटा अपलोड करा.',
  });

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [sRes, uRes, rRes] = await Promise.all([
        fetchApi('/admin/stats'),
        fetchApi(`/admin/users?search=${encodeURIComponent(search)}`),
        fetchApi('/admin/reports'),
      ]);
      setStats(sRes);
      setUsersList(uRes.users || []);
      setReportsList(rRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [search]);

  const handleToggleVerify = async (userId: string) => {
    try {
      await fetchApi(`/admin/users/${userId}/verify`, { method: 'PUT' });
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Error updating verification');
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
      <div className="border-b border-ivory-300 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-950 flex items-center gap-2">
            <Shield className="w-7 h-7 text-brand-700" />
            <span>{t('adminDashboardTitle')}</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Platform moderation, verification, reports, and system broadcasts
          </p>
        </div>
      </div>

      {/* 4 Admin Stat Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-ivory-300 space-y-2">
            <div className="flex items-center justify-between text-brand-900">
              <Users className="w-5 h-5 text-gold-600" />
              <span className="text-[10px] uppercase font-bold text-gray-400">Total</span>
            </div>
            <div className="font-serif text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
            <div className="text-xs text-gray-500">{t('adminTotalUsers')}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-ivory-300 space-y-2">
            <div className="flex items-center justify-between text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] uppercase font-bold text-gray-400">Verified</span>
            </div>
            <div className="font-serif text-2xl font-bold text-gray-900">{stats.verifiedUsers}</div>
            <div className="text-xs text-gray-500">{t('adminVerifiedUsers')}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-ivory-300 space-y-2">
            <div className="flex items-center justify-between text-brand-700">
              <Eye className="w-5 h-5 text-brand-700" />
              <span className="text-[10px] uppercase font-bold text-gray-400">Views</span>
            </div>
            <div className="font-serif text-2xl font-bold text-gray-900">{stats.totalViews}</div>
            <div className="text-xs text-gray-500">{t('adminTotalViews')}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-ivory-300 space-y-2">
            <div className="flex items-center justify-between text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-[10px] uppercase font-bold text-gray-400">Reports</span>
            </div>
            <div className="font-serif text-2xl font-bold text-gray-900">{stats.pendingReports}</div>
            <div className="text-xs text-gray-500">{t('adminPendingReports')}</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-ivory-300 gap-4">
        <button
          onClick={() => setTab('users')}
          className={`pb-3 text-xs font-bold transition-colors cursor-pointer ${
            tab === 'users' ? 'border-b-2 border-brand-900 text-brand-900' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          User Management ({usersList.length})
        </button>
        <button
          onClick={() => setTab('reports')}
          className={`pb-3 text-xs font-bold transition-colors cursor-pointer ${
            tab === 'reports' ? 'border-b-2 border-brand-900 text-brand-900' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Reports Review ({reportsList.length})
        </button>
        <button
          onClick={() => setTab('announcement')}
          className={`pb-3 text-xs font-bold transition-colors cursor-pointer ${
            tab === 'announcement' ? 'border-b-2 border-brand-900 text-brand-900' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          System Announcement
        </button>
      </div>

      {/* TAB 1: User Management */}
      {tab === 'users' && (
        <div className="bg-white rounded-3xl border border-ivory-300 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user by name, email, or mobile..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-100 text-gray-700 font-semibold border-b border-ivory-200">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Profile ID</th>
                  <th className="p-3">City</th>
                  <th className="p-3">Verified</th>
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
                    <td className="p-3 font-mono font-semibold text-gold-700">{u.profileId || 'N/A'}</td>
                    <td className="p-3">{u.city || 'Maharashtra'}</td>
                    <td className="p-3">
                      {u.isVerified ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          Verified ✓
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded">
                          Unverified
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
                    <td className="p-3 flex items-center gap-2">
                      <button
                        onClick={() => handleToggleVerify(u._id)}
                        className="px-2.5 py-1 bg-brand-900 text-gold-300 rounded-lg text-[11px] font-semibold cursor-pointer"
                      >
                        {u.isVerified ? t('unverifyUserBtn') : t('verifyUserBtn')}
                      </button>

                      <button
                        onClick={() => handleToggleStatus(u._id, u.status)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${
                          u.status === 'active' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {u.status === 'active' ? t('suspendUserBtn') : t('activateUserBtn')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Reports Review */}
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

      {/* TAB 3: System Announcement */}
      {tab === 'announcement' && (
        <form onSubmit={handleBroadcastAnnouncement} className="bg-white rounded-3xl border border-ivory-300 p-6 space-y-4 max-w-2xl shadow-sm">
          <h3 className="font-serif font-bold text-brand-950 text-base">{t('sendAnnouncement')}</h3>
          
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

    </div>
  );
};
