import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { fetchApi } from '../services/api';
import { Heart, Check, X, MessageSquare, ShieldCheck } from 'lucide-react';

export const InterestsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [tab, setTab] = useState<'received' | 'sent' | 'accepted'>('received');
  const [allReceived, setAllReceived] = useState<any[]>([]);
  const [sent, setSent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInterests = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/interests/my-interests');
      setAllReceived(data.received || []);
      setSent(data.sent || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  const handleRespond = async (interestId: string, action: 'accept' | 'reject') => {
    try {
      // Instantly remove from pending received list in UI
      setAllReceived((prev) =>
        prev.map((item) =>
          (item._id === interestId || item.id === interestId)
            ? { ...item, status: action === 'accept' ? 'accepted' : 'rejected' }
            : item
        )
      );

      await fetchApi('/interests/respond', {
        method: 'POST',
        body: JSON.stringify({ interestId, action }),
      });

      if (action === 'accept') {
        alert(
          language === 'EN'
            ? 'Interest accepted! You can now chat in Messages.'
            : 'आवड स्वीकारली! तुम्ही आता संदेश पाठवू शकता.'
        );
      }

      await fetchInterests();
    } catch (err: any) {
      alert(err.message || 'Action failed');
      await fetchInterests();
    }
  };

  // Filter lists based on tab
  const pendingReceived = allReceived.filter((item) => item.status === 'pending');
  const acceptedReceived = allReceived.filter((item) => item.status === 'accepted');

  const getActiveList = () => {
    if (tab === 'received') return pendingReceived;
    if (tab === 'accepted') return acceptedReceived;
    return sent;
  };

  const list = getActiveList();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header & Tabs */}
      <div className="border-b border-ivory-300 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-950 flex items-center gap-2">
            <Heart className="w-6 h-6 text-brand-700 fill-brand-700" />
            <span>{t('navInterests')}</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {language === 'EN'
              ? 'Manage matrimonial interest requests and mutual connections'
              : 'प्राप्त झालेल्या व पाठवलेल्या आवडी (Interests) व्यवस्थापित करा'}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-ivory-200 p-1 rounded-2xl overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setTab('received')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              tab === 'received' ? 'bg-brand-900 text-gold-300 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('dashboardInterests')} ({pendingReceived.length})
          </button>

          <button
            onClick={() => setTab('accepted')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              tab === 'accepted' ? 'bg-brand-900 text-gold-300 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {language === 'EN' ? 'Connected' : 'स्वीकारलेले'} ({acceptedReceived.length})
          </button>

          <button
            onClick={() => setTab('sent')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              tab === 'sent' ? 'bg-brand-900 text-gold-300 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('dashboardSent')} ({sent.length})
          </button>
        </div>
      </div>

      {/* List Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-24 animate-pulse border border-ivory-300"></div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-3xl border border-ivory-300 p-12 text-center space-y-3 max-w-md mx-auto">
          <Heart className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-gray-800">
            {tab === 'received'
              ? (language === 'EN' ? 'No Pending Requests' : 'अद्याप कोणत्याही प्रलंबित विनंत्या नाहीत')
              : tab === 'accepted'
              ? (language === 'EN' ? 'No Connected Members Yet' : 'अद्याप जोडलेली खाती नाहीत')
              : (language === 'EN' ? 'No Sent Interests' : 'अद्याप कोणत्याच प्रोफाईलला आवड पाठवली नाही')}
          </h3>
          <Link
            to="/search"
            className="inline-block mt-2 px-5 py-2.5 bg-brand-900 text-gold-300 rounded-xl text-xs font-semibold"
          >
            {t('heroCtaExplore')}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((item) => (
            <div
              key={item._id || item.id}
              className="bg-white rounded-2xl border border-ivory-300 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-14 h-14 rounded-2xl bg-brand-900/10 text-brand-900 font-serif font-bold text-xl flex items-center justify-center overflow-hidden shrink-0">
                  {item.user?.primaryPhoto ? (
                    <img src={item.user.primaryPhoto} alt="" className="w-full h-full object-cover" />
                  ) : (
                    item.user?.fullName?.charAt(0) || 'M'
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Link
                      to={item.user?.profileId ? `/profile/${item.user.profileId}` : '#'}
                      className="font-serif text-base font-bold text-brand-950 hover:underline"
                    >
                      {item.user?.fullName}, {item.user?.age}
                    </Link>
                    <span className="text-[10px] font-mono text-gold-700 bg-gold-50 px-1.5 py-0.5 rounded border border-gold-200">
                      {item.user?.profileId}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500">
                    {item.user?.occupation} • {item.user?.city}
                  </p>

                  <div className="text-[11px] text-gray-400">
                    Status:{' '}
                    <span className={`font-semibold capitalize ${
                      item.status === 'accepted' ? 'text-emerald-600' : item.status === 'rejected' ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      {item.status}
                    </span>{' '}
                    • {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {tab === 'received' && item.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleRespond(item._id || item.id, 'accept')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>{t('accept')}</span>
                    </button>
                    <button
                      onClick={() => handleRespond(item._id || item.id, 'reject')}
                      className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <X className="w-4 h-4 text-red-500" />
                      <span>{t('reject')}</span>
                    </button>
                  </>
                )}

                {(tab === 'accepted' || item.status === 'accepted') && (
                  <button
                    onClick={() => navigate('/messages')}
                    className="px-4 py-2 bg-brand-900 hover:bg-brand-950 text-gold-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{t('chatNow')}</span>
                  </button>
                )}

                {item.user?.profileId && (
                  <Link
                    to={`/profile/${item.user.profileId}`}
                    className="px-4 py-2 border border-brand-900 text-brand-900 hover:bg-brand-50 rounded-xl text-xs font-semibold"
                  >
                    {t('viewProfile')}
                  </Link>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
