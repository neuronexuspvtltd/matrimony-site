import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { fetchApi } from '../services/api';
import { ProfileCard } from '../components/ProfileCard';
import { Star, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ShortlistPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [shortlisted, setShortlisted] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShortlist = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/shortlists/my-shortlist');
      setShortlisted(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlist();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-ivory-300 pb-4">
        <h1 className="font-serif text-3xl font-bold text-brand-950 flex items-center gap-2">
          <Star className="w-6 h-6 text-gold-500 fill-gold-400" />
          <span>{t('navShortlisted')}</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {language === 'EN'
            ? `You have saved ${shortlisted.length} profiles`
            : `तुम्ही ${shortlisted.length} प्रोफाईल्स पसंतीत जोडली आहेत`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-ivory-300"></div>
          ))}
        </div>
      ) : shortlisted.length === 0 ? (
        <div className="bg-white rounded-3xl border border-ivory-300 p-12 text-center space-y-3 max-w-md mx-auto">
          <Star className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-gray-800">
            {language === 'EN' ? 'No Shortlisted Profiles Yet' : 'अद्याप कोणतेही प्रोफाइल जोडले नाही'}
          </h3>
          <p className="text-xs text-gray-500">
            {language === 'EN'
              ? 'Click the star icon on any profile card to save it here.'
              : 'स्थळे शोधताना कोणत्याही प्रोफाइल कार्डवरील स्टार चिन्हावर क्लिक करा.'}
          </p>
          <Link
            to="/search"
            className="inline-block mt-2 px-5 py-2.5 bg-brand-900 text-gold-300 rounded-xl text-xs font-semibold"
          >
            {t('heroCtaExplore')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shortlisted.map((item) => (
            <ProfileCard key={item._id} profile={{ ...item.profile, isShortlisted: true }} />
          ))}
        </div>
      )}
    </div>
  );
};
