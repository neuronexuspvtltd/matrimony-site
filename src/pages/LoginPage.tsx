import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Sparkles, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl border border-ivory-300 shadow-xl overflow-hidden max-w-md w-full p-8 sm:p-10 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-brand-900 text-gold-300 flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-6 h-6 fill-gold-400 stroke-brand-900" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-brand-950">
            {t('navLogin')}
          </h1>
          <p className="text-xs text-gray-500">
            {language === 'EN' ? 'Welcome back to Pavithra Bandhan Matrimony' : 'पावित्र्य बंधन मॅट्रीमोनी मध्ये आपले स्वागत आहे'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{t('email')}</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="suyash@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-900 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{t('password')}</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-900 text-sm"
                required
              />
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

        {/* Demo Credentials Helper Box */}
        <div className="bg-ivory-100 p-4 rounded-2xl border border-ivory-300 space-y-2 text-xs">
          <p className="font-bold text-gray-800 text-[11px] uppercase tracking-wider">
            {language === 'EN' ? 'Quick Demo Login Options:' : 'त्वरित डेमो लॉग इन पर्याय:'}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              onClick={() => fillDemoAccount('suyash@example.com', 'Password123')}
              className="px-2.5 py-1 bg-white hover:bg-brand-50 border border-gray-200 rounded-lg text-brand-900 font-medium cursor-pointer"
            >
              Suyash (Groom)
            </button>
            <button
              onClick={() => fillDemoAccount('priya@example.com', 'Password123')}
              className="px-2.5 py-1 bg-white hover:bg-brand-50 border border-gray-200 rounded-lg text-brand-900 font-medium cursor-pointer"
            >
              Priya (Bride)
            </button>
            <button
              onClick={() => fillDemoAccount('admin@matrimony.com', 'Admin@123')}
              className="px-2.5 py-1 bg-brand-900 text-gold-300 rounded-lg font-bold cursor-pointer flex items-center gap-1"
            >
              <Shield className="w-3 h-3 text-gold-400" />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 pt-2">
          {language === 'EN' ? "Don't have a profile?" : 'नवीन प्रोफाइल तयार करायचे आहे?'}{' '}
          <Link to="/register" className="text-brand-900 font-bold hover:underline">
            {t('navRegister')}
          </Link>
        </div>

      </div>
    </div>
  );
};
