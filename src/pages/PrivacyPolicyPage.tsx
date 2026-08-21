import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Lock, Eye, FileText, UserCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-ivory-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back to Home Header Navigation */}
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-900 hover:text-brand-950 bg-white border border-ivory-300 px-4 py-2 rounded-xl shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'EN' ? 'Back to Home' : 'मुखपृष्ठावर जा'}</span>
          </a>
          <span className="text-xs text-gray-500 font-mono">
            Document Version 2.0 • 2026
          </span>
        </div>

        {/* Dedicated Document Header Banner */}
        <div className="bg-brand-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-4 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-400/20 text-gold-300 text-xs font-semibold border border-gold-400/30">
            <ShieldCheck className="w-4 h-4 fill-gold-400 text-brand-950" />
            <span>{language === 'EN' ? 'V Brothers Marriage Bureau Official Policy' : 'व्ही ब्रदर्स विवाह संस्था अधिकृत धोरण'}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gold-300 tracking-tight">
            {language === 'EN' ? 'Privacy Policy & Data Security' : 'गोपनीयता धोरण आणि डेटा सुरक्षा'}
          </h1>

          <p className="text-xs sm:text-sm text-ivory-200 max-w-2xl leading-relaxed">
            {language === 'EN'
              ? 'Your privacy, PDF biodata security, and photo confidentiality are fundamental to everything we build at V Brothers Marriage Bureau.'
              : 'तुमची गोपनीयता, PDF बायोडाटा सुरक्षा आणि फोटोंची गोपनीयता यावर आमचा पूर्ण विश्वास आहे.'}
          </p>
        </div>

        {/* Legal Clauses Document Body */}
        <div className="bg-white rounded-3xl border border-ivory-300 p-8 sm:p-12 shadow-md space-y-10 text-xs sm:text-sm text-gray-800 leading-relaxed">
          
          {/* Clause 1 */}
          <div className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-brand-900 flex items-center gap-2 border-b border-ivory-200 pb-2">
              <Lock className="w-5 h-5 text-gold-600" />
              <span>1. Information Collection & Purpose</span>
            </h2>
            <p>
              V Brothers Marriage Bureau collects personal information solely for facilitating authentic matrimonial matchmaking among verified Maharashtrian families and individuals. Collected details include:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 pt-1">
              <li className="flex items-center gap-2 bg-ivory-50 p-2.5 rounded-xl border border-ivory-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Account Info (Name, DOB, Mobile, Email)</span>
              </li>
              <li className="flex items-center gap-2 bg-ivory-50 p-2.5 rounded-xl border border-ivory-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cultural Background (Religion, Caste, Sub-caste)</span>
              </li>
              <li className="flex items-center gap-2 bg-ivory-50 p-2.5 rounded-xl border border-ivory-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Education & Occupation Details</span>
              </li>
              <li className="flex items-center gap-2 bg-ivory-50 p-2.5 rounded-xl border border-ivory-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Uploaded Photos & Matrimonial PDF Biodatas</span>
              </li>
            </ul>
          </div>

          {/* Clause 2 */}
          <div className="space-y-3 pt-2">
            <h2 className="font-serif text-xl font-bold text-brand-900 flex items-center gap-2 border-b border-ivory-200 pb-2">
              <FileText className="w-5 h-5 text-gold-600" />
              <span>2. PDF Biodata Security & Visibility Controls</span>
            </h2>
            <p>
              Uploaded PDF biodata files are stored securely with strict privacy rules. You choose who views your PDF biodata:
            </p>
            <div className="space-y-2 pt-1 text-xs">
              <div className="p-3.5 rounded-2xl bg-brand-50/60 border border-brand-200">
                <strong className="text-brand-950 block">Connections Only (Recommended):</strong>
                Your PDF biodata is accessible strictly to members whose interest request you have explicitly accepted.
              </div>
              <div className="p-3.5 rounded-2xl bg-ivory-100 border border-ivory-300">
                <strong className="text-gray-900 block">Public:</strong>
                Visible to all logged-in verified members on the platform.
              </div>
            </div>
          </div>

          {/* Clause 3 */}
          <div className="space-y-3 pt-2">
            <h2 className="font-serif text-xl font-bold text-brand-900 flex items-center gap-2 border-b border-ivory-200 pb-2">
              <Eye className="w-5 h-5 text-gold-600" />
              <span>3. Profile View Tracking & Notification Rules</span>
            </h2>
            <p>
              Whenever a logged-in member views your profile, the system logs the view timestamp in the database and sends you an instant alert (*"Suyash viewed your profile / सुयश यांनी तुमचे प्रोफाइल पाहिले"*). To prevent notification spam, a 24-hour cooldown is enforced for repeat visits by the same viewer.
            </p>
          </div>

          {/* Clause 4 */}
          <div className="space-y-3 pt-2">
            <h2 className="font-serif text-xl font-bold text-brand-900 flex items-center gap-2 border-b border-ivory-200 pb-2">
              <UserCheck className="w-5 h-5 text-gold-600" />
              <span>4. Data Sharing & Third-Party Protection</span>
            </h2>
            <p>
              We do not sell, rent, or trade member personal data or contact details to third-party marketing companies. Data is used exclusively for internal matchmaking algorithms, profile verification, and platform moderation.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
