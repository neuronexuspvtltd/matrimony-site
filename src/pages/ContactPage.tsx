import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  const faqs = [
    {
      qEn: 'How does the PDF Biodata privacy setting work?',
      qMr: 'PDF बायोडाटा गोपनीयता सेटिंग कशी काम करते?',
      aEn: 'When set to "Connections Only", your uploaded PDF biodata is visible only to members whose interest request you have accepted.',
      aMr: 'जेव्हा तुम्ही "Connections Only" निवडता, तेव्हा तुमचा PDF बायोडाटा केवळ तुम्ही मंजूर केलेल्या सदस्यांनाच दिसतो.',
    },
    {
      qEn: 'How are profile-view notifications generated?',
      qMr: 'प्रोफाइल-व्ह्यू सूचना (Notifications) कशा पाठवल्या जातात?',
      aEn: 'Whenever a logged-in member views your profile, our system logs the view with a 24-hour cooldown and notifies you immediately.',
      aMr: 'जेव्हा कोणताही सदस्य तुमचे प्रोफाइल पाहतो, तेव्हा आमची प्रणाली २४ तासांच्या वेळेचे नियंत्रण ठेवून तुम्हाला तात्काळ सूचना पाठवते.',
    },
    {
      qEn: 'Is my phone number visible publicly?',
      qMr: 'माझा मोबाईल नंबर सर्वांना दिसेल का?',
      aEn: 'No. Contact details remain private and are shared only with mutual connections.',
      aMr: 'नाही. संपर्क माहिती पूर्णपणे सुरक्षित राहते आणि केवळ परस्पर जोडलेल्या सदस्यांनाच दिसते.',
    },
    {
      qEn: 'How can I get my profile verified?',
      qMr: 'माझे प्रोफाइल पडताळणी (Verified) कसे करून घ्यावे?',
      aEn: 'Upload a valid government ID or contact our Pune/Mumbai office team for fast-track verification.',
      aMr: 'तुमचे शासकीय ओळखपत्र अपलोड करा किंवा त्वरित पडताळणीसाठी आमच्या कार्यालयाशी संपर्क साधा.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="font-serif text-4xl font-bold text-brand-950">
          {language === 'EN' ? 'Get in Touch with Us' : 'आमच्याशी संपर्क साधा'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          {language === 'EN'
            ? 'Have questions or need assistance with your matrimonial search? Our dedicated support team is here to help.'
            : 'काही प्रश्न किंवा मदत हवी आहे का? आमची टीम तुम्हाला मार्गदर्शन करण्यासाठी सदैव तत्पर आहे.'}
        </p>
      </div>

      {/* 3 Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Phone */}
        <div className="bg-white rounded-3xl border border-ivory-300 p-6 space-y-3 shadow-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-900/10 text-brand-900 flex items-center justify-center mx-auto">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-gray-900 text-base">
            {language === 'EN' ? 'Call Support' : 'फोन संपर्क'}
          </h3>
          <p className="text-xs text-gray-600 font-semibold">+91 98765 43210</p>
          <p className="text-xs text-gray-600">+91 98765 43211</p>
          <span className="text-[10px] text-gray-400 block pt-1">Mon - Sat, 9:00 AM - 7:00 PM IST</span>
        </div>

        {/* Email */}
        <div className="bg-white rounded-3xl border border-ivory-300 p-6 space-y-3 shadow-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-800 flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-gray-900 text-base">
            {language === 'EN' ? 'Email Support' : 'ईमेल संपर्क'}
          </h3>
          <p className="text-xs text-gray-600 font-semibold">support@pavithrabandhan.com</p>
          <p className="text-xs text-gray-600">help@pavithrabandhan.com</p>
          <span className="text-[10px] text-gray-400 block pt-1">We respond within 24 hours</span>
        </div>

        {/* Offices */}
        <div className="bg-white rounded-3xl border border-ivory-300 p-6 space-y-3 shadow-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-gray-900 text-base">
            {language === 'EN' ? 'Office Locations' : 'मुख्य कार्यालये'}
          </h3>
          <p className="text-xs text-gray-600 font-semibold">Pune HQ: FC Road, Shivajinagar</p>
          <p className="text-xs text-gray-600">Mumbai Office: Nariman Point</p>
          <span className="text-[10px] text-gray-400 block pt-1">Maharashtra, India</span>
        </div>

      </div>

      {/* Main Grid: Contact Form & FAQs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left 7 Cols: Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-ivory-300 p-8 shadow-sm space-y-6">
          <div>
            <h3 className="font-serif font-bold text-brand-950 text-xl">
              {language === 'EN' ? 'Send Us a Message' : 'आम्हाला संदेश पाठवा'}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'EN' ? 'Fill out the form below and our relationship manager will contact you.' : 'खालील फॉर्म भरा आणि आमचे प्रतिनिधी तुमच्याशी संपर्क साधतील.'}
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-2">
              <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-serif font-bold text-emerald-900 text-base">
                {language === 'EN' ? 'Thank You!' : 'धन्यवाद!'}
              </h4>
              <p className="text-xs text-emerald-700">
                {language === 'EN' ? 'Your message has been sent successfully. We will get back to you shortly.' : 'तुमचा संदेश मिळाला आहे. आम्ही लवकरच तुमच्याशी संपर्क साधू.'}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs text-emerald-800 font-bold underline"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{t('fullName')} *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Suyash Narade"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{t('email')} *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="suyash@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{t('mobile')}</label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Profile Verification">Profile Verification</option>
                    <option value="PDF Biodata Issue">PDF Biodata Support</option>
                    <option value="Billing & Membership">Membership Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  placeholder="How can we assist you?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-900"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-brand-900 text-gold-300 font-bold rounded-xl text-xs hover:bg-brand-950 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Right 5 Cols: FAQs Accordion */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-ivory-300 p-8 shadow-sm space-y-6">
          <div>
            <h3 className="font-serif font-bold text-brand-950 text-xl">
              {language === 'EN' ? 'Frequently Asked Questions' : 'सतत विचारले जाणारे प्रश्न (FAQ)'}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Quick answers about privacy, verification, and features
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border border-ivory-300 rounded-2xl overflow-hidden transition-colors">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-semibold text-xs text-gray-900 flex items-center justify-between gap-2 hover:bg-ivory-100/60 cursor-pointer"
                  >
                    <span>{language === 'EN' ? faq.qEn : faq.qMr}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-brand-900 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-gray-600 border-t border-gray-100 bg-ivory-50/50 leading-relaxed">
                      {language === 'EN' ? faq.aEn : faq.aMr}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
