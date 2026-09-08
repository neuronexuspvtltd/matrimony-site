import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../services/api';
import { sendMobileOtp, verifyMobileOtp } from '../services/smsOtpService';
import { Lock, Mail, Sparkles, Eye, EyeOff, Phone, KeyRound, CheckCircle2, AlertCircle, X, Clock } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot Password Modal States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotMobile, setForgotMobile] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifyLoading, setOtpVerifyLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(120);

  useEffect(() => {
    let interval: any = null;
    if (otpSent && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, timerSeconds]);

  const handleSendForgotOtp = async () => {
    if (forgotMobile.trim().length !== 10) {
      setForgotError(language === 'EN' ? 'Enter a valid 10-digit mobile number' : 'कृपया वैध १० अंकी मोबाईल नंबर टाका');
      return;
    }

    setOtpSending(true);
    setForgotError('');
    setForgotSuccess('');

    const res = await sendMobileOtp(forgotMobile);
    setOtpSending(false);

    if (res.success) {
      setOtpSent(true);
      setTimerSeconds(120);
      setForgotSuccess(res.message);
    } else {
      setForgotError(res.message);
    }
  };

  const handleResetPasswordWithOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (forgotOtp.trim().length !== 6) {
      setForgotError(language === 'EN' ? 'Enter valid 6-digit OTP' : '६ अंकी ओटीपी टाका');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setForgotError(language === 'EN' ? 'New password must be at least 6 characters' : 'नवीन पासवर्ड किमान ६ अक्षरे असावा');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setForgotError(language === 'EN' ? 'Passwords do not match' : 'पासवर्ड जुळत नाहीत');
      return;
    }

    // Verify OTP first
    const otpResult = verifyMobileOtp(forgotMobile, forgotOtp);
    if (!otpResult.success) {
      setForgotError(otpResult.message);
      return;
    }

    setOtpVerifyLoading(true);

    try {
      const resetRes = await fetchApi('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          mobile: forgotMobile,
          newPassword,
        }),
      });

      setForgotSuccess(resetRes.message || 'Password reset successfully!');
      setEmail(forgotMobile);
      setPassword(newPassword);

      setTimeout(() => {
        setShowForgotModal(false);
        setOtpSent(false);
        setForgotOtp('');
      }, 2000);
    } catch (err: any) {
      setForgotError(err.message || 'Failed to reset password');
    } finally {
      setOtpVerifyLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser?.role === 'admin' || email.includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl border border-ivory-300 shadow-xl overflow-hidden max-w-md w-full p-8 sm:p-10 space-y-6">
        
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-2xl bg-white border border-gold-400/40 p-2 shadow-md flex items-center justify-center mx-auto transition-transform hover:scale-105">
            <img
              src="/v_brothers_icon.png"
              alt="V Brothers Emblem"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-serif text-2xl font-bold text-brand-950">
            {t('navLogin')}
          </h1>
          <p className="text-xs text-gray-500">
            {language === 'EN' ? 'Welcome back to V Brothers Marriage Bureau' : 'व्ही ब्रदर्स विवाह संस्थेमध्ये आपले स्वागत आहे'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {language === 'EN' ? 'Mobile Number / Email' : 'मोबाईल नंबर / ईमेल आयडी'} *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. 9898989898 or user@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 font-medium placeholder:text-gray-400 focus:border-brand-800 focus:ring-2 focus:ring-brand-500/20 text-sm transition-all shadow-sm"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-700">{t('password')}</label>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(true);
                  setForgotError('');
                  setForgotSuccess('');
                }}
                className="text-xs font-semibold text-brand-900 hover:underline cursor-pointer"
              >
                {language === 'EN' ? 'Forgot Password?' : 'पासवर्ड विसरलात?'}
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 font-medium placeholder:text-gray-400 focus:border-brand-800 focus:ring-2 focus:ring-brand-500/20 text-sm transition-all shadow-sm"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brand-900 text-gold-300 font-semibold text-sm hover:bg-brand-950 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? 'Logging in...' : t('navLogin')}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          {language === 'EN' ? "Don't have a profile?" : 'नवीन प्रोफाइल तयार करायचे आहे?'}{' '}
          <Link to="/register" className="text-brand-900 font-bold hover:underline">
            {t('navRegister')}
          </Link>
        </div>

      </div>

      {/* 🔐 FORGOT PASSWORD OTP MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-900 flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-6 h-6 text-brand-900" />
              </div>
              <h3 className="font-serif text-xl font-bold text-brand-950">
                {language === 'EN' ? 'Reset Password via OTP' : 'ओटीपी द्वारे पासवर्ड रिसेट करा'}
              </h3>
              <p className="text-xs text-gray-500">
                {language === 'EN' ? 'Enter mobile number to receive 6-digit OTP' : '६ अंकी ओटीपी मिळवण्यासाठी मोबाईल नंबर टाका'}
              </p>
            </div>

            {forgotError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs font-medium">
                {forgotError}
              </div>
            )}

            {forgotSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            <form onSubmit={handleResetPasswordWithOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {language === 'EN' ? 'Registered Mobile Number' : 'नोंदणीकृत मोबाईल नंबर'} *
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      value={forgotMobile}
                      onChange={(e) => setForgotMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9898989898"
                      disabled={otpSent}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 font-medium placeholder:text-gray-400 focus:border-brand-800 focus:ring-2 focus:ring-brand-500/20 text-sm transition-all shadow-sm"
                      required
                    />
                  </div>
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendForgotOtp}
                      disabled={otpSending || forgotMobile.length !== 10}
                      className="px-4 py-3 bg-brand-900 text-gold-300 font-bold rounded-xl text-xs hover:bg-brand-950 disabled:opacity-50 cursor-pointer shrink-0"
                    >
                      {otpSending ? 'Sending...' : 'Send OTP'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setForgotOtp('');
                      }}
                      className="px-3 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl text-xs hover:bg-gray-100 cursor-pointer shrink-0"
                    >
                      Change
                    </button>
                  )}
                </div>
              </div>

              {otpSent && (
                <div className="space-y-3 pt-2 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {language === 'EN' ? 'Enter 6-Digit OTP' : '६-अंकी ओटीपी टाका'} *
                    </label>
                    <input
                      type="text"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      className="w-full text-center tracking-[0.5em] font-mono text-lg py-2.5 rounded-xl border border-ivory-300 bg-ivory-100/90 focus:bg-white focus:ring-2 focus:ring-brand-900 shadow-sm"
                      maxLength={6}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {language === 'EN' ? 'New Password' : 'नवीन पासवर्ड'} *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password (min 6 chars)"
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 font-medium placeholder:text-gray-400 focus:border-brand-800 focus:ring-2 focus:ring-brand-500/20 text-sm transition-all shadow-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {language === 'EN' ? 'Confirm New Password' : 'नवीन पासवर्ड पुष्टी करा'} *
                    </label>
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm New Password"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 font-medium placeholder:text-gray-400 focus:border-brand-800 focus:ring-2 focus:ring-brand-500/20 text-sm transition-all shadow-sm"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                    {timerSeconds > 0 ? (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Resend OTP in {formatTimer(timerSeconds)}</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendForgotOtp}
                        className="text-brand-900 font-bold hover:underline cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={otpVerifyLoading}
                    className="w-full py-3.5 bg-brand-900 text-gold-300 font-bold rounded-xl text-sm shadow-md hover:bg-brand-950 transition-colors cursor-pointer mt-2"
                  >
                    {otpVerifyLoading ? 'Verifying & Updating...' : 'Verify OTP & Reset Password'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

