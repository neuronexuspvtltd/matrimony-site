import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Scale, CheckCircle2, ShieldAlert, FileText, ArrowLeft, Users, AlertTriangle } from 'lucide-react';

export const TermsPage: React.FC = () => {
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
            <Scale className="w-4 h-4 text-gold-400" />
            <span>{language === 'EN' ? 'Pavithra Bandhan Terms of Service' : 'पावित्र्य बंधन सेवा अटी'}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gold-300 tracking-tight">
            {language === 'EN' ? 'Terms of Service & Code of Conduct' : 'सेवा अटी आणि आचारसंहिता'}
          </h1>

          <p className="text-xs sm:text-sm text-ivory-200 max-w-2xl leading-relaxed">
            {language === 'EN'
              ? 'Rules governing member eligibility, respectful conduct, interest requests, and platform safety.'
              : 'सदस्यांची पात्रता, आदरयुक्त व्यवहार आणि सुरक्षिततेचे नियम.'}
          </p>
        </div>

        {/* Legal Clauses Document Body */}
        <div className="bg-white rounded-3xl border border-ivory-300 p-8 sm:p-12 shadow-md space-y-10 text-xs sm:text-sm text-gray-800 leading-relaxed">
          
          {/* Clause 1 */}
          <div className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-brand-900 flex items-center gap-2 border-b border-ivory-200 pb-2">
              <CheckCircle2 className="w-5 h-5 text-gold-600" />
              <span>1. Member Eligibility & Truthful Profiles</span>
            </h2>
            <p>
              By creating a profile on Pavithra Bandhan, you represent and warrant that you are legally competent and meet the legal marriage age requirements under Indian Law (minimum 18 years for females and 21 years for males).
            </p>
            <p className="text-xs text-gray-600">
              Members are required to provide truthful details regarding age, education, marital status, and profession. Submitting fraudulent profile details will result in permanent account termination.
            </p>
          </div>

          {/* Clause 2 */}
          <div className="space-y-3 pt-2">
            <h2 className="font-serif text-xl font-bold text-brand-900 flex items-center gap-2 border-b border-ivory-200 pb-2">
              <Users className="w-5 h-5 text-gold-600" />
              <span>2. Code of Conduct & Family Dignity</span>
            </h2>
            <p>
              Pavithra Bandhan is designed specifically for respect-driven matrimonial matchmaking. The following actions are strictly prohibited:
            </p>
            <ul className="space-y-2 text-xs text-gray-600 pt-1">
              <li className="flex items-start gap-2 bg-red-50/50 p-3 rounded-xl border border-red-100">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>Harassing, sending vulgar messages, or abusing other members.</span>
              </li>
              <li className="flex items-start gap-2 bg-red-50/50 p-3 rounded-xl border border-red-100">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>Requesting money, financial loans, or commercial transactions.</span>
              </li>
            </ul>
          </div>

          {/* Clause 3 */}
          <div className="space-y-3 pt-2">
            <h2 className="font-serif text-xl font-bold text-brand-900 flex items-center gap-2 border-b border-ivory-200 pb-2">
              <FileText className="w-5 h-5 text-gold-600" />
              <span>3. Matrimonial Interests & Mutual Connection Rule</span>
            </h2>
            <p>
              Sending an interest request expresses a desire to connect. Direct messaging communication unlocks exclusively after the recipient accepts the interest request, establishing a mutual connection.
            </p>
          </div>

          {/* Clause 4 */}
          <div className="space-y-3 pt-2">
            <h2 className="font-serif text-xl font-bold text-brand-900 flex items-center gap-2 border-b border-ivory-200 pb-2">
              <ShieldAlert className="w-5 h-5 text-gold-600" />
              <span>4. Administration & Moderation Powers</span>
            </h2>
            <p>
              Our administration team reserves the right to review reported profiles, verify credentials, toggle verification badges (`Verified ✓`), and suspend non-compliant profiles without prior notice to preserve member trust and safety.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
