import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { fetchApi } from '../services/api';
import { ProfileCard } from '../components/ProfileCard';
import { Search, Filter, RotateCcw, X, SlidersHorizontal } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { t, language } = useLanguage();

  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  // Filter State
  const [filters, setFilters] = useState({
    name: '',
    gender: '',
    minAge: '21',
    maxAge: '40',
    city: '',
    religion: '',
    caste: '',
    motherTongue: '',
    education: '',
    occupation: '',
    maritalStatus: '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleClearFilters = () => {
    setFilters({
      name: '',
      gender: '',
      minAge: '21',
      maxAge: '40',
      city: '',
      religion: '',
      caste: '',
      motherTongue: '',
      education: '',
      occupation: '',
      maritalStatus: '',
    });
  };

  const executeSearch = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val) queryParams.append(key, val);
      });

      const res = await fetchApi(`/search?${queryParams.toString()}`);
      setProfiles(res.profiles || []);
      setTotalCount(res.total || 0);
    } catch (error) {
      console.error('Error executing search:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch();
  }, []);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setMobileFiltersOpen(false);
    executeSearch();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-ivory-300 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-950">
            {t('searchTitle')}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {language === 'EN'
              ? `Showing ${totalCount} compatible profiles`
              : `${totalCount} सुयोग्य प्रोफाईल्स उपलब्ध आहेत`}
          </p>
        </div>

        {/* Mobile Filter Drawer Button */}
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-brand-900 text-gold-300 rounded-xl text-xs font-semibold shadow-sm cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{language === 'EN' ? 'Filters' : 'फिल्टर निवडा'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Sidebar Filter Panel */}
        <form
          onSubmit={handleApply}
          className="hidden lg:block lg:col-span-4 bg-white rounded-3xl border border-ivory-300 p-6 space-y-5 sticky top-24 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-serif font-bold text-brand-900 text-base flex items-center gap-2">
              <Filter className="w-4 h-4 text-gold-600" />
              <span>{language === 'EN' ? 'Search Filters' : 'शोध फिल्टर'}</span>
            </h3>
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-gray-500 hover:text-brand-900 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('clearFilters')}</span>
            </button>
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {language === 'EN' ? 'Name or Keyword' : 'नाव किंवा शब्द'}
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-900"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{t('gender')}</label>
            <select
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs"
            >
              <option value="">{language === 'EN' ? 'All Genders' : 'सर्व'}</option>
              <option value="female">{t('female')}</option>
              <option value="male">{t('male')}</option>
            </select>
          </div>

          {/* Age Range */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {t('age')} ({t('minAgeLabel')} - {t('maxAgeLabel')})
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="minAge"
                value={filters.minAge}
                onChange={handleFilterChange}
                placeholder="21"
                className="w-1/2 px-3 py-2.5 rounded-xl border border-gray-300 text-xs"
              />
              <input
                type="number"
                name="maxAge"
                value={filters.maxAge}
                onChange={handleFilterChange}
                placeholder="40"
                className="w-1/2 px-3 py-2.5 rounded-xl border border-gray-300 text-xs"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{t('city')}</label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="e.g. Pune, Mumbai, Kolhapur"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs"
            />
          </div>

          {/* Religion */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{t('religion')}</label>
            <input
              type="text"
              name="religion"
              value={filters.religion}
              onChange={handleFilterChange}
              placeholder="e.g. Hindu"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs"
            />
          </div>

          {/* Caste */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{t('caste')}</label>
            <input
              type="text"
              name="caste"
              value={filters.caste}
              onChange={handleFilterChange}
              placeholder="e.g. Maratha, Brahmin"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs"
            />
          </div>

          {/* Education */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{t('education')}</label>
            <input
              type="text"
              name="education"
              value={filters.education}
              onChange={handleFilterChange}
              placeholder="e.g. B.Tech, MBA"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs"
            />
          </div>

          {/* Marital Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{t('maritalStatus')}</label>
            <select
              name="maritalStatus"
              value={filters.maritalStatus}
              onChange={handleFilterChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs"
            >
              <option value="">{language === 'EN' ? 'Any Marital Status' : 'सर्व'}</option>
              <option value="never_married">Never Married (अविवाहित)</option>
              <option value="divorced">Divorced (घटस्फोटित)</option>
              <option value="widowed">Widowed (विधवा/विधुर)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-brand-900 text-gold-300 font-semibold text-xs hover:bg-brand-950 shadow-md cursor-pointer"
          >
            {t('applyFilters')}
          </button>
        </form>

        {/* Profiles Results Grid */}
        <div className="lg:col-span-8 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-ivory-300"></div>
              ))}
            </div>
          ) : profiles.length === 0 ? (
            <div className="bg-white rounded-3xl border border-ivory-300 p-12 text-center space-y-3">
              <Search className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-gray-800">{t('noResultsTitle')}</h3>
              <p className="text-xs text-gray-500">{t('noResultsDesc')}</p>
              <button
                onClick={handleClearFilters}
                className="mt-2 px-4 py-2 bg-brand-900 text-gold-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                {t('clearFilters')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {profiles.map((prof) => (
                <ProfileCard key={prof._id} profile={prof} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filter Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end lg:hidden">
          <div className="bg-white w-full max-w-xs h-full p-6 overflow-y-auto space-y-5 animate-in slide-in-from-right">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-brand-900 text-base">{t('searchTitle')}</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-1 text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('gender')}</label>
                <select
                  name="gender"
                  value={filters.gender}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                >
                  <option value="">All</option>
                  <option value="female">{t('female')}</option>
                  <option value="male">{t('male')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('city')}</label>
                <input
                  type="text"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="w-1/2 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold"
                >
                  {t('clearFilters')}
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-brand-900 text-gold-300 text-xs font-semibold"
                >
                  {t('applyFilters')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
