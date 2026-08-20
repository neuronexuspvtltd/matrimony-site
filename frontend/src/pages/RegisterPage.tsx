import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Check, ChevronLeft, ChevronRight, User, Heart, Briefcase, Users, Sliders } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    gender: 'male',
    dob: '1998-01-01',

    // Step 2
    height: "5'8\"",
    maritalStatus: 'never_married',
    religion: 'Hindu',
    caste: 'Maratha',
    subCaste: '',
    motherTongue: 'Marathi',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',

    // Step 3
    education: 'B.Tech / B.E.',
    college: '',
    occupation: 'Software Professional',
    company: '',
    income: '10-15 LPA',

    // Step 4
    fatherOccupation: 'Government Officer',
    motherOccupation: 'Homemaker',
    brothers: 1,
    sisters: 0,
    familyType: 'nuclear',
    familyValues: 'moderate',
    aboutMe: '',

    // Step 5
    partnerMinAge: 21,
    partnerMaxAge: 32,
    partnerEducation: 'Graduate',
    partnerOccupation: 'Employed',
    partnerLocation: 'Maharashtra',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.mobile || !formData.password) {
        setError(language === 'EN' ? 'Please fill in all required fields' : 'कृपया सर्व आवश्यक माहिती भरा');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError(language === 'EN' ? 'Passwords do not match' : 'पासवर्ड जुळत नाहीत');
        return;
      }
    }
    setError('');
    setCurrentStep((prev) => Math.min(5, prev + 1));
  };

  const handlePrevious = () => {
    setError('');
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({
        ...formData,
        partnerPreferences: {
          minAge: formData.partnerMinAge,
          maxAge: formData.partnerMaxAge,
          education: formData.partnerEducation,
          occupation: formData.partnerOccupation,
          location: formData.partnerLocation,
          religion: formData.religion,
          caste: 'Any',
        },
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, title: t('regStep1'), icon: User },
    { num: 2, title: t('regStep2'), icon: Heart },
    { num: 3, title: t('regStep3'), icon: Briefcase },
    { num: 4, title: t('regStep4'), icon: Users },
    { num: 5, title: t('regStep5'), icon: Sliders },
  ];

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl border border-ivory-300 shadow-xl overflow-hidden p-6 sm:p-10 space-y-8">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl font-bold text-brand-950">
            {t('regTitle')}
          </h1>
          <p className="text-xs text-gray-500">
            {language === 'EN' ? 'Step ' + currentStep + ' of 5' : 'पायरी ' + currentStep + ' पैकी ५'}
          </p>
        </div>

        {/* Multi-step Progress Bar */}
        <div className="flex items-center justify-between border-b border-ivory-200 pb-6 overflow-x-auto">
          {steps.map((step) => {
            const isDone = currentStep > step.num;
            const isCurrent = currentStep === step.num;
            return (
              <div key={step.num} className="flex flex-col items-center gap-1.5 flex-1 min-w-[70px]">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-brand-900 text-gold-300 ring-4 ring-brand-100'
                      : 'bg-ivory-200 text-gray-400'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : step.num}
                </div>
                <span className={`text-[10px] font-medium text-center truncate max-w-[80px] ${isCurrent ? 'text-brand-900 font-bold' : 'text-gray-500'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* STEP 1: Account Details */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('fullName')} *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Suyash Narade"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('email')} *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="suyash@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('mobile')} *</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('gender')} *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-900 text-sm"
                >
                  <option value="male">{t('male')}</option>
                  <option value="female">{t('female')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('dateOfBirth')} *</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-900 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('password')} *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-900 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('confirmPassword')} *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-900 text-sm"
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 2: Personal Info */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('height')}</label>
                <input
                  type="text"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="5'8&quot;"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('maritalStatus')}</label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm"
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('caste')}</label>
                <input
                  type="text"
                  name="caste"
                  value={formData.caste}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm"
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('motherTongue')}</label>
                <input
                  type="text"
                  name="motherTongue"
                  value={formData.motherTongue}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('city')}</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('state')}</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Education & Career */}
          {currentStep === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('education')}</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="B.Tech, MBA, M.Sc, MD"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm"
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm"
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm"
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Family Details */}
          {currentStep === 4 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('fatherOccupation')}</label>
                <input
                  type="text"
                  name="fatherOccupation"
                  value={formData.fatherOccupation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('motherOccupation')}</label>
                <input
                  type="text"
                  name="motherOccupation"
                  value={formData.motherOccupation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm"
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm"
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('aboutMe')}</label>
                <textarea
                  name="aboutMe"
                  value={formData.aboutMe}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Share a short bio about yourself and your aspirations..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Partner Preferences */}
          {currentStep === 5 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('preferredAge')} (Min - Max)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="partnerMinAge"
                    value={formData.partnerMinAge}
                    onChange={handleChange}
                    className="w-1/2 px-4 py-3 rounded-xl border border-gray-300 text-sm"
                  />
                  <input
                    type="number"
                    name="partnerMaxAge"
                    value={formData.partnerMaxAge}
                    onChange={handleChange}
                    className="w-1/2 px-4 py-3 rounded-xl border border-gray-300 text-sm"
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('preferredOccupation')}</label>
                <input
                  type="text"
                  name="partnerOccupation"
                  value={formData.partnerOccupation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('preferredLocation')}</label>
                <input
                  type="text"
                  name="partnerLocation"
                  value={formData.partnerLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm"
                />
              </div>
            </div>
          )}

          {/* Form Wizard Navigation Controls */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-100 flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('previous')}</span>
              </button>
            ) : <div />}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 rounded-xl bg-brand-900 text-gold-300 font-semibold text-xs hover:bg-brand-950 flex items-center gap-1 cursor-pointer ml-auto"
              >
                <span>{t('next')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-gold-400 text-brand-950 font-bold text-xs hover:bg-gold-300 shadow-md cursor-pointer ml-auto"
              >
                {loading ? 'Registering...' : t('submit')}
              </button>
            )}
          </div>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2">
          {language === 'EN' ? 'Already have a profile?' : 'आधीच खाते आहे का?'}{' '}
          <Link to="/login" className="text-brand-900 font-bold hover:underline">
            {t('navLogin')}
          </Link>
        </div>

      </div>
    </div>
  );
};
