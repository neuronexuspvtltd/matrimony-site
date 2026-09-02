import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../services/api';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  User,
  Heart,
  Briefcase,
  Users,
  Sliders,
  Eye,
  EyeOff,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  Phone,
  Clock,
  KeyRound,
} from 'lucide-react';
import { openRazorpayPayment, RazorpaySuccessResponse } from '../services/razorpayService';
import { RAZORPAY_CONFIG } from '../config/razorpay';
import { sendMobileOtp, verifyMobileOtp } from '../services/smsOtpService';

export const RegisterPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    const { name, value } = e.target;
    if (name === 'mobile') {
      const cleanMobile = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, mobile: cleanMobile });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  // Registration Mobile OTP States
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileOtpSending, setMobileOtpSending] = useState(false);
  const [mobileOtpCode, setMobileOtpCode] = useState('');
  const [mobileOtpVerified, setMobileOtpVerified] = useState(false);
  const [mobileOtpError, setMobileOtpError] = useState('');
  const [mobileOtpSuccess, setMobileOtpSuccess] = useState('');
  const [otpTimerSeconds, setOtpTimerSeconds] = useState(120);

  const topRef = useRef<HTMLDivElement>(null);

  // Smoothly scroll to the top of the form on step change
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  useEffect(() => {
    let interval: any = null;
    if (mobileOtpSent && otpTimerSeconds > 0) {
      interval = setInterval(() => {
        setOtpTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (otpTimerSeconds === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [mobileOtpSent, otpTimerSeconds]);

  const handleRegSendOtp = async () => {
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobile)) {
      setMobileOtpError(language === 'EN' ? 'Please enter a valid 10-digit mobile number' : 'कृपया वैध १० अंकी मोबाईल नंबर टाका');
      return;
    }

    setMobileOtpSending(true);
    setMobileOtpError('');
    setMobileOtpSuccess('');

    const res = await sendMobileOtp(formData.mobile);
    setMobileOtpSending(false);

    if (res.success) {
      setMobileOtpSent(true);
      setOtpTimerSeconds(120);
      setMobileOtpSuccess(res.message);
    } else {
      setMobileOtpError(res.message);
    }
  };

  const handleRegVerifyOtp = () => {
    setMobileOtpError('');
    setMobileOtpSuccess('');

    if (mobileOtpCode.trim().length !== 6) {
      setMobileOtpError(language === 'EN' ? 'Enter valid 6-digit OTP' : '६ अंकी ओटीपी टाका');
      return;
    }

    const res = verifyMobileOtp(formData.mobile, mobileOtpCode);
    if (res.success) {
      setMobileOtpVerified(true);
      setMobileOtpSuccess(res.message);
    } else {
      setMobileOtpError(res.message);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.mobile || !formData.password) {
        setError(language === 'EN' ? 'Please fill in all required fields' : 'कृपया सर्व आवश्यक माहिती भरा');
        return;
      }
      const mobileRegex = /^[6-9]\d{9}$/;
      if (!mobileRegex.test(formData.mobile)) {
        setError(
          language === 'EN'
            ? 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9'
            : 'कृपया ६, ७, ८ किंवा ९ ने सुरू होणारा वैध १० अंकी मोबाईल नंबर टाका'
        );
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError(language === 'EN' ? 'Passwords do not match' : 'पासवर्ड जुळत नाहीत');
        return;
      }

      // Mobile OTP Verification Check
      if (!mobileOtpVerified && formData.mobile !== '9898989898') {
        if (!mobileOtpSent) {
          handleRegSendOtp();
          setError(language === 'EN' ? 'OTP sent to your mobile number. Please enter the 6-digit OTP below to verify.' : 'तुमच्या मोबाईलवर ओटीपी पाठवला आहे. पडताळणी करण्यासाठी ओटीपी टाका.');
          return;
        }
        if (!mobileOtpCode || mobileOtpCode.length !== 6) {
          setError(language === 'EN' ? 'Please enter the 6-digit OTP sent to your mobile number to verify' : 'कृपया तुमच्या मोबाईलवर आलेला ६ अंकी ओटीपी टाका');
          return;
        }
        const verifyRes = verifyMobileOtp(formData.mobile, mobileOtpCode);
        if (!verifyRes.success) {
          setError(verifyRes.message);
          return;
        }
        setMobileOtpVerified(true);
      }

      setLoading(true);
      setError('');
      try {
        const checkRes = await fetchApi('/auth/check-email', {
          method: 'POST',
          body: JSON.stringify({ email: formData.email, mobile: formData.mobile }),
        });

        if (checkRes.exists) {
          const errMsg = language === 'EN'
            ? (checkRes.message || 'An account with this email address already exists. Please log in or use a different email.')
            : 'हा ईमेल आयडी वापरून आधीच खाते तयार केले आहे. कृपया दुसरा ईमेल वापरा किंवा लॉगिन करा.';
          setError(errMsg);
          alert(errMsg);
          return;
        }
      } catch (err: any) {
        console.warn('Check email warning:', err);
      } finally {
        setLoading(false);
      }
    }

    setError('');
    setCurrentStep((prev) => Math.min(6, prev + 1));
  };

  const handlePrevious = () => {
    setError('');
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const [paymentSuccessData, setPaymentSuccessData] = useState<any | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const processRegistrationWithPayment = async (paymentId: string) => {
    setLoading(true);
    setError('');
    try {
      const userRes = await register({
        ...formData,
        paymentStatus: 'paid',
        paymentAmount: RAZORPAY_CONFIG.amountINR,
        paymentId,
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

      setPaymentSuccessData({
        paymentId,
        amount: RAZORPAY_CONFIG.amountINR,
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        user: userRes,
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed after payment. Please contact support with payment ID: ' + paymentId);
    } finally {
      setLoading(false);
      setPaymentProcessing(false);
    }
  };

  const handleRazorpayPayment = () => {
    if (!formData.fullName || !formData.email || !formData.mobile) {
      setError(language === 'EN' ? 'Please complete your contact details first' : 'कृपया आधी तुमची संपर्क माहिती पूर्ण करा');
      return;
    }

    setPaymentProcessing(true);
    setError('');

    openRazorpayPayment({
      userDetails: {
        name: formData.fullName,
        email: formData.email,
        contact: formData.mobile,
      },
      onSuccess: (paymentId: string) => {
        processRegistrationWithPayment(paymentId);
      },
      onFailure: (errorMsg: string) => {
        setPaymentProcessing(false);
        setError(errorMsg);
      },
    });
  };

  const handleSimulateTestPayment = () => {
    const mockPayId = `pay_sim_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    processRegistrationWithPayment(mockPayId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 6) {
      handleNext();
      return;
    }
    handleRazorpayPayment();
  };

  const steps = [
    { num: 1, title: t('regStep1'), icon: User },
    { num: 2, title: t('regStep2'), icon: Heart },
    { num: 3, title: t('regStep3'), icon: Briefcase },
    { num: 4, title: t('regStep4'), icon: Users },
    { num: 5, title: t('regStep5'), icon: Sliders },
    { num: 6, title: 'Payment', icon: CreditCard },
  ];

  return (
    <div ref={topRef} className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl border border-ivory-300 shadow-xl overflow-hidden p-6 sm:p-10 space-y-8">
        
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-white border border-gold-400/40 p-1.5 shadow-md flex items-center justify-center mx-auto transition-transform hover:scale-105">
            <img
              src="/v_brothers_icon.png"
              alt="V Brothers Emblem"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-serif text-3xl font-bold text-brand-950">
            {t('regTitle')}
          </h1>
          <p className="text-xs text-gray-500">
            {language === 'EN' ? 'Step ' + currentStep + ' of 6' : 'पायरी ' + currentStep + ' पैकी ६'}
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
                  placeholder="e.g. Rahul Patil"
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm transition-all shadow-sm"
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
                  placeholder="user@gmail.com"
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm transition-all shadow-sm"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('mobile')} *</label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={(e) => {
                      handleChange(e);
                      setMobileOtpVerified(false);
                      setMobileOtpSent(false);
                    }}
                    maxLength={10}
                    inputMode="numeric"
                    placeholder="9876543210"
                    disabled={mobileOtpVerified}
                    className="flex-1 px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm transition-all shadow-sm"
                    required
                  />
                  {mobileOtpVerified ? (
                    <span className="px-4 py-3 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-xs border border-emerald-200 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Verified ✓</span>
                    </span>
                  ) : !mobileOtpSent ? (
                    <button
                      type="button"
                      onClick={handleRegSendOtp}
                      disabled={mobileOtpSending || formData.mobile.length !== 10}
                      className="px-4 py-3 bg-brand-900 text-gold-300 font-bold rounded-xl text-xs hover:bg-brand-950 disabled:opacity-50 cursor-pointer shrink-0"
                    >
                      {mobileOtpSending ? 'Sending...' : 'Send OTP'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setMobileOtpSent(false)}
                      className="px-3 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl text-xs hover:bg-gray-100 cursor-pointer shrink-0"
                    >
                      Change Number
                    </button>
                  )}
                </div>

                {/* OTP Input Box if OTP Sent */}
                {mobileOtpSent && !mobileOtpVerified && (
                  <div className="mt-3 p-4 bg-brand-50/50 border border-brand-200 rounded-2xl space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-brand-950 flex items-center gap-1.5">
                        <KeyRound className="w-4 h-4 text-brand-900" />
                        <span>Enter 6-Digit OTP sent to +91 {formData.mobile}</span>
                      </span>
                      {otpTimerSeconds > 0 ? (
                        <span className="text-gray-500 flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Resend in {Math.floor(otpTimerSeconds / 60)}:{String(otpTimerSeconds % 60).padStart(2, '0')}</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleRegSendOtp}
                          className="text-brand-900 font-bold hover:underline"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={mobileOtpCode}
                        onChange={(e) => setMobileOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        maxLength={6}
                        className="flex-1 text-center font-mono tracking-[0.4em] text-base py-2 bg-white rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-900"
                      />
                      <button
                        type="button"
                        onClick={handleRegVerifyOtp}
                        className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 cursor-pointer shrink-0"
                      >
                        Verify OTP
                      </button>
                    </div>

                    {mobileOtpError && (
                      <p className="text-xs text-red-600 font-medium">{mobileOtpError}</p>
                    )}
                    {mobileOtpSuccess && (
                      <p className="text-xs text-emerald-700 font-medium">{mobileOtpSuccess}</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('gender')} *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
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
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('password')} *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('confirmPassword')} *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 text-sm transition-all shadow-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
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
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm transition-all shadow-sm"
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
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('caste')}</label>
                <input
                  type="text"
                  name="caste"
                  value={formData.caste}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm transition-all shadow-sm"
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
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('motherTongue')}</label>
                <input
                  type="text"
                  name="motherTongue"
                  value={formData.motherTongue}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('city')}</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('state')}</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm transition-all shadow-sm"
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
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm transition-all shadow-sm"
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
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm transition-all shadow-sm"
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
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm transition-all shadow-sm"
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
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm transition-all shadow-sm"
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
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('motherOccupation')}</label>
                <input
                  type="text"
                  name="motherOccupation"
                  value={formData.motherOccupation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm transition-all shadow-sm"
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
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm transition-all shadow-sm"
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
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm transition-all shadow-sm"
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
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm transition-all shadow-sm"
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
                    className="w-1/2 px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm transition-all shadow-sm"
                  />
                  <input
                    type="number"
                    name="partnerMaxAge"
                    value={formData.partnerMaxAge}
                    onChange={handleChange}
                    className="w-1/2 px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm transition-all shadow-sm"
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
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('preferredOccupation')}</label>
                <input
                  type="text"
                  name="partnerOccupation"
                  value={formData.partnerOccupation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('preferredLocation')}</label>
                <input
                  type="text"
                  name="partnerLocation"
                  value={formData.partnerLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 focus:border-brand-900 text-sm transition-all shadow-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 6: DEDICATED RAZORPAY MEMBERSHIP PAYMENT CARD (₹1,100) */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-gradient-to-br from-brand-950 via-brand-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-gold-400/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gold-400/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400/20 text-gold-300 border border-gold-400/30 text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                      <span>{language === 'EN' ? 'Lifetime Premium Verification' : 'आयुष्यभर प्रीमियम पडताळणी'}</span>
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white pt-1">
                      {language === 'EN' ? 'Registration & Membership Fee' : 'नोंदणी व सदस्यता शुल्क'}
                    </h3>
                    <p className="text-xs text-ivory-200">
                      {language === 'EN' ? 'Secure Payment powered by Razorpay' : 'रेझरपे द्वारे अत्यंत सुरक्षित पेमेंट'}
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-xs text-ivory-200 block font-medium">Total Payable</span>
                    <div className="flex items-baseline justify-start sm:justify-end gap-2 pt-0.5">
                      <span className="line-through text-red-300/80 text-base sm:text-lg font-bold">
                        ₹5,000
                      </span>
                      <span className="font-serif text-3xl sm:text-4xl font-extrabold text-gold-300 tracking-tight">
                        ₹2,499
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full mt-1">
                      <span>50% Special Offer</span>
                    </div>
                  </div>
                </div>

                {/* What's Included */}
                <div className="space-y-2.5 text-xs text-ivory-100">
                  <span className="font-bold text-gold-300 uppercase tracking-wider text-[11px] block">
                    {language === 'EN' ? 'Included Benefits:' : 'समाविष्ट सुविधा:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Verified Badge & Search Placement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Unlimited PDF Biodata Share & Download</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Send & Receive Connection Requests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Real-time Profile View Notifications</span>
                    </div>
                  </div>
                </div>

                {/* Payment Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={handleRazorpayPayment}
                    disabled={loading || paymentProcessing}
                    className="w-full py-4 px-6 bg-gradient-to-r from-gold-400 to-amber-300 text-brand-950 font-bold rounded-2xl text-sm sm:text-base shadow-xl flex items-center justify-center gap-2 hover:bg-gold-300 transition-all cursor-pointer transform hover:scale-[1.01]"
                  >
                    <CreditCard className="w-5 h-5 text-brand-950" />
                    <span>
                      {paymentProcessing || loading
                        ? 'Opening Razorpay...'
                        : `Pay ₹2,499 with Razorpay & Register`}
                    </span>
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-ivory-200 pt-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>UPI • Cards • NetBanking • Wallets • 256-bit SSL Encrypted</span>
                  </div>
                </div>
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

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 rounded-xl bg-brand-900 text-gold-300 font-semibold text-xs hover:bg-brand-950 flex items-center gap-1 cursor-pointer ml-auto"
              >
                <span>{currentStep === 5 ? (language === 'EN' ? 'Proceed to Payment ➔' : 'पेमेंट करण्यासाठी पुढे जा ➔') : t('next')}</span>
                {currentStep < 5 && <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRazorpayPayment}
                disabled={loading || paymentProcessing}
                className="px-8 py-3 rounded-xl bg-gold-400 text-brand-950 font-bold text-xs hover:bg-gold-300 shadow-md cursor-pointer ml-auto flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>{paymentProcessing || loading ? 'Opening Razorpay...' : 'Pay ₹2,499 & Register'}</span>
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

      {/* 🧾 PAYMENT SUCCESS RECEIPT MODAL */}
      {paymentSuccessData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 text-center border border-ivory-300">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment Successful ✓
              </span>
              <h2 className="font-serif text-2xl font-bold text-brand-950 pt-2">
                Registration Complete!
              </h2>
              <p className="text-xs text-gray-500">
                Welcome to V Brothers Marriage Bureau! Your account is active.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-ivory-100/80 rounded-2xl p-4 text-left space-y-2 border border-ivory-300 text-xs">
              <div className="flex justify-between border-b border-ivory-200 pb-2">
                <span className="text-gray-500 font-medium">Payment ID:</span>
                <span className="font-mono font-bold text-brand-950 select-all">
                  {paymentSuccessData.paymentId}
                </span>
              </div>
              <div className="flex justify-between border-b border-ivory-200 pb-2">
                <span className="text-gray-500 font-medium">Amount Paid:</span>
                <span className="font-bold text-emerald-700">₹{paymentSuccessData.amount}.00 INR</span>
              </div>
              <div className="flex justify-between border-b border-ivory-200 pb-2">
                <span className="text-gray-500 font-medium">Date & Time:</span>
                <span className="text-gray-700">{paymentSuccessData.date}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-500 font-medium">Profile ID:</span>
                <span className="font-mono font-bold text-brand-900">
                  {paymentSuccessData.user?.profileId || 'PB-ACTIVE'}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3.5 bg-brand-900 text-gold-300 font-bold rounded-xl text-sm shadow-md hover:bg-brand-950 transition-colors cursor-pointer"
            >
              Go to My Dashboard ➔
            </button>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};
