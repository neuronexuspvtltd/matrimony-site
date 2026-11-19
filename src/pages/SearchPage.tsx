import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../services/api';
import { ProfileCard } from '../components/ProfileCard';
import { Search, Filter, RotateCcw, X, SlidersHorizontal, Lock } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

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
    const defaultFilters = {
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
    };
    setFilters(defaultFilters);
    executeSearch(defaultFilters);
  };

  const executeSearch = async (overrideFilters?: typeof filters) => {
    setLoading(true);
    try {
      const activeFilters = overrideFilters || filters;
      const queryParams = new URLSearchParams();
      Object.entries(activeFilters).forEach(([key, val]) => {
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

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileFiltersOpen]);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setMobileFiltersOpen(false);
    executeSearch();
  };

  const renderFilterInputs = () => (
    <>
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
          placeholder="e.g. Sangli, Solapur, Satara, Kolhapur, Pune"
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
    </>
  );

  {/* Mobile-optimized Filter Inputs with modern touch controls */}
  const renderMobileFilterInputs = () => (
    <>
      {/* Search Input */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          {language === 'EN' ? 'Name or Keyword' : 'नाव किंवा शब्द'}
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-900/15 focus:border-brand-900 transition-all"
          />
        </div>
      </div>

      {/* Gender Segmented Tabs */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t('gender')}</label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 rounded-xl border border-gray-200/80">
          <button
            type="button"
            onClick={() => setFilters({ ...filters, gender: '' })}
            className={`py-2 px-1 text-center text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filters.gender === ''
                ? 'bg-white text-brand-950 shadow-xs border border-gray-200'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {language === 'EN' ? 'All' : 'सर्व'}
          </button>
          <button
            type="button"
            onClick={() => setFilters({ ...filters, gender: 'female' })}
            className={`py-2 px-1 text-center text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filters.gender === 'female'
                ? 'bg-brand-900 text-gold-300 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {language === 'EN' ? 'Bride' : 'वधू (स्त्री)'}
          </button>
          <button
            type="button"
            onClick={() => setFilters({ ...filters, gender: 'male' })}
            className={`py-2 px-1 text-center text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filters.gender === 'male'
                ? 'bg-brand-900 text-gold-300 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {language === 'EN' ? 'Groom' : 'वर (पुरुष)'}
          </button>
        </div>
      </div>

      {/* Age Range with Min / Max Badge Inputs */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            {t('age')}
          </label>
          <span className="text-[11px] text-brand-900 font-semibold bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
            {filters.minAge || '21'} - {filters.maxAge || '40'} {language === 'EN' ? 'Yrs' : 'वर्षे'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="relative">
            <span className="absolute left-3 top-2 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              {language === 'EN' ? 'Min' : 'किमान'}
            </span>
            <input
              type="number"
              name="minAge"
              value={filters.minAge}
              onChange={handleFilterChange}
              placeholder="21"
              className="w-full pt-5 pb-1.5 px-3 rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-900/15 focus:border-brand-900 transition-all"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-2 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              {language === 'EN' ? 'Max' : 'कमाल'}
            </span>
            <input
              type="number"
              name="maxAge"
              value={filters.maxAge}
              onChange={handleFilterChange}
              placeholder="40"
              className="w-full pt-5 pb-1.5 px-3 rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-900/15 focus:border-brand-900 transition-all"
            />
          </div>
        </div>
      </div>

      {/* City */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t('city')}</label>
        <input
          type="text"
          name="city"
          value={filters.city}
          onChange={handleFilterChange}
          placeholder="e.g. Sangli, Solapur, Satara, Kolhapur, Pune"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-900/15 focus:border-brand-900 transition-all"
        />
      </div>

      {/* Religion */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t('religion')}</label>
        <input
          type="text"
          name="religion"
          value={filters.religion}
          onChange={handleFilterChange}
          placeholder="e.g. Hindu"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-900/15 focus:border-brand-900 transition-all"
        />
      </div>

      {/* Caste */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t('caste')}</label>
        <input
          type="text"
          name="caste"
          value={filters.caste}
          onChange={handleFilterChange}
          placeholder="e.g. Maratha, Brahmin, Mahar"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-900/15 focus:border-brand-900 transition-all"
        />
      </div>

      {/* Education */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t('education')}</label>
        <input
          type="text"
          name="education"
          value={filters.education}
          onChange={handleFilterChange}
          placeholder="e.g. B.Tech, MBA, Doctor"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-900/15 focus:border-brand-900 transition-all"
        />
      </div>

      {/* Marital Status */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t('maritalStatus')}</label>
        <select
          name="maritalStatus"
          value={filters.maritalStatus}
          onChange={handleFilterChange}
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-900/15 focus:border-brand-900 transition-all"
        >
          <option value="">{language === 'EN' ? 'Any Marital Status' : 'सर्व वैवाहिक स्थिती'}</option>
          <option value="never_married">{language === 'EN' ? 'Never Married' : 'Never Married (अविवाहित)'}</option>
          <option value="divorced">{language === 'EN' ? 'Divorced' : 'Divorced (घटस्फोटित)'}</option>
          <option value="widowed">{language === 'EN' ? 'Widowed' : 'Widowed (विधवा/विधुर)'}</option>
        </select>
      </div>
    </>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Guest Privacy Protection Banner */}
      {!user && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-950 via-brand-900 to-brand-950 text-ivory-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md border border-gold-400/30">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-gold-400 text-brand-950 flex items-center justify-center shrink-0 shadow-sm">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-gold-300 text-sm sm:text-base">
                {language === 'MR' ? '🔒 सदस्यांच्या गोपनीयतेसाठी सुरक्षित प्रोफाईल्स' : '🔒 Privacy Protected Member Directory'}
              </h4>
              <p className="text-xs text-ivory-200 mt-0.5">
                {language === 'MR' ? 'संपूर्ण प्रोफाईल, फोटो व बायोडाटा पाहण्यासाठी लॉगिन करा.' : 'Member photos and full profile details are visible to logged-in users.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-center">
            <Link to="/login" className="px-5 py-2.5 bg-gold-400 text-brand-950 font-bold text-xs rounded-xl hover:bg-gold-300 transition-all shadow-sm">
              {language === 'MR' ? 'लॉगिन करा' : 'Sign In'}
            </Link>
            <Link to="/register" className="px-5 py-2.5 bg-brand-800 text-gold-300 font-bold text-xs rounded-xl border border-gold-400/30 hover:bg-brand-700 transition-all">
              {language === 'MR' ? 'नोंदणी करा' : 'Register Free'}
            </Link>
          </div>
        </div>
      )}

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
          className="hidden lg:flex lg:flex-col lg:col-span-4 bg-white rounded-3xl border border-ivory-300 p-6 sticky top-24 shadow-sm max-h-[calc(100vh-7.5rem)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4 shrink-0">
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

          {/* Scrollable Filter Inputs */}
          <div className="overflow-y-auto pr-2 space-y-4 flex-1 min-h-0 custom-scrollbar">
            {renderFilterInputs()}
          </div>

          {/* Action Button */}
          <div className="pt-3 border-t border-gray-100 mt-4 shrink-0">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-900 text-gold-300 font-semibold text-xs hover:bg-brand-950 shadow-md cursor-pointer transition-colors"
            >
              {t('applyFilters')}
            </button>
          </div>
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
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-xs lg:hidden overflow-hidden">
          {/* Backdrop click to dismiss */}
          <div
            className="absolute inset-0 bg-transparent"
            onClick={() => setMobileFiltersOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer strictly pinned from top 0 to bottom 0 */}
          <div className="absolute inset-y-0 right-0 w-full sm:max-w-md bg-white flex flex-col shadow-2xl overflow-hidden sm:border-l sm:border-ivory-300 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 text-brand-900 flex items-center justify-center shadow-xs">
                  <Filter className="w-4 h-4 text-gold-600" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-brand-950 text-base leading-tight">
                    {language === 'EN' ? 'Search Filters' : 'शोध फिल्टर'}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {language === 'EN' ? `${totalCount} profiles available` : `${totalCount} प्रोफाईल्स उपलब्ध`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-2.5 py-1.5 text-xs text-brand-900 hover:bg-brand-50 rounded-lg transition-colors font-medium flex items-center gap-1 cursor-pointer"
                  title={t('clearFilters')}
                >
                  <RotateCcw className="w-3.5 h-3.5 text-gold-600" />
                  <span className="hidden sm:inline">{t('clearFilters')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleApply} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              {/* Scrollable Filter Inputs */}
              <div className="overflow-y-auto px-5 py-4 space-y-4 flex-1 min-h-0 custom-scrollbar overscroll-contain">
                {renderMobileFilterInputs()}
              </div>

              {/* Action Buttons - Pinned at bottom with safe padding */}
              <div className="p-4 pb-6 sm:pb-5 border-t border-gray-200 bg-white shrink-0 flex items-center gap-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="py-3 px-4 rounded-xl border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition-all active:scale-95 shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                  <span>{language === 'EN' ? 'Reset' : 'रीसेट'}</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800 text-gold-300 font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-brand-950/25 cursor-pointer transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  <Filter className="w-4 h-4 text-gold-400" />
                  <span>{t('applyFilters')}</span>
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-gold-400/20 text-gold-200 text-[10px] font-bold border border-gold-400/30">
                    {totalCount}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
