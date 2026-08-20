import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { fetchApi } from '../services/api';
import { FileText, Download, Eye, Upload, Trash2, Lock, Shield, Check, X } from 'lucide-react';

interface BiodataPdfViewerProps {
  biodataUrl?: string;
  biodataFileName?: string;
  visibility?: 'public' | 'connections_only' | 'private';
  isOwnProfile?: boolean;
  onUpdate?: () => void;
}

export const BiodataPdfViewer: React.FC<BiodataPdfViewerProps> = ({
  biodataUrl,
  biodataFileName,
  visibility = 'connections_only',
  isOwnProfile = false,
  onUpdate,
}) => {
  const { t, language } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentVisibility, setCurrentVisibility] = useState(visibility);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert(language === 'EN' ? 'Please upload a PDF file only.' : 'कृपया फक्त PDF फाईल अपलोड करा.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(language === 'EN' ? 'File size must be under 5MB.' : 'फाईलचा आकार ५ MB पेक्षा लहान असावा.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('biodata', file);

      await fetchApi('/profiles/upload-biodata', {
        method: 'POST',
        body: formData,
      });

      if (onUpdate) onUpdate();
    } catch (error: any) {
      alert(error.message || 'Failed to upload PDF biodata');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteBiodata = async () => {
    if (!confirm(language === 'EN' ? 'Are you sure you want to delete your PDF biodata?' : 'तुम्हाला खरोखर PDF बायोडाटा काढून टाकायचा आहे का?')) {
      return;
    }

    try {
      await fetchApi('/profiles/delete-biodata', { method: 'POST' });
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting biodata:', error);
    }
  };

  const handleVisibilityChange = async (newVis: 'public' | 'connections_only' | 'private') => {
    try {
      await fetchApi('/profiles/me', {
        method: 'PUT',
        body: JSON.stringify({ biodataVisibility: newVis }),
      });
      setCurrentVisibility(newVis);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating visibility:', error);
    }
  };

  return (
    <div className="bg-ivory-50 rounded-2xl border border-ivory-300 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-900/10 text-brand-900 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-gray-900">
              {language === 'EN' ? 'Matrimonial PDF Biodata' : 'विवाह बायोडाटा (PDF)'}
            </h3>
            <p className="text-xs text-gray-500">
              {biodataUrl ? biodataFileName || 'Biodata.pdf' : (language === 'EN' ? 'No PDF uploaded yet' : 'अद्याप PDF अपलोड केली नाही')}
            </p>
          </div>
        </div>

        {/* Visibility Badge */}
        <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-white px-3 py-1.5 rounded-full border border-ivory-300 shadow-2xs">
          <Lock className="w-3.5 h-3.5 text-gold-600" />
          <span className="font-medium capitalize">
            {currentVisibility === 'public'
              ? (language === 'EN' ? 'Visible to All' : 'सर्व सदस्यांना दृश्यमान')
              : currentVisibility === 'connections_only'
              ? (language === 'EN' ? 'Connections Only' : 'केवळ स्वीकारलेल्या सदस्यांना')
              : (language === 'EN' ? 'Private' : 'खासगी (Private)')}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {biodataUrl ? (
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-900 text-gold-300 hover:bg-brand-950 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>{t('viewBiodata')}</span>
          </button>

          <a
            href={biodataUrl}
            download={biodataFileName || 'Biodata.pdf'}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 border border-brand-900 text-brand-900 hover:bg-brand-50 rounded-xl text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{t('downloadBiodata')}</span>
          </a>

          {isOwnProfile && (
            <label className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl text-xs font-semibold cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-gold-600" />
              <span>{language === 'EN' ? 'Replace PDF' : 'PDF बदला'}</span>
              <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
            </label>
          )}

          {isOwnProfile && (
            <button
              onClick={handleDeleteBiodata}
              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              title="Delete Biodata"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        isOwnProfile && (
          <div className="pt-2">
            <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-900 text-gold-300 hover:bg-brand-950 rounded-xl text-xs font-semibold shadow-sm cursor-pointer transition-all">
              <Upload className="w-4 h-4" />
              <span>{uploading ? (language === 'EN' ? 'Uploading...' : 'अपलोड करत आहे...') : t('uploadBiodata')}</span>
              <input type="file" accept="application/pdf" onChange={handleFileUpload} disabled={uploading} className="hidden" />
            </label>
          </div>
        )
      )}

      {/* Visibility Settings for Own Profile */}
      {isOwnProfile && biodataUrl && (
        <div className="pt-3 border-t border-ivory-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">
            {language === 'EN' ? 'PDF Biodata Privacy Setting:' : 'PDF बायोडाटा गोपनीयता सेटिंग:'}
          </p>
          <div className="flex items-center gap-2">
            {(['public', 'connections_only', 'private'] as const).map((vis) => (
              <button
                key={vis}
                onClick={() => handleVisibilityChange(vis)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  currentVisibility === vis
                    ? 'bg-brand-900 text-gold-300 border-brand-900 font-semibold'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {vis === 'public'
                  ? (language === 'EN' ? 'Public' : 'सर्व')
                  : vis === 'connections_only'
                  ? (language === 'EN' ? 'Connections Only (Recommended)' : 'केवळ जोडलेले सदस्य (शिफारस)')
                  : (language === 'EN' ? 'Private' : 'खासगी')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PDF View Modal */}
      {modalOpen && biodataUrl && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-ivory-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-900" />
                <h3 className="font-serif font-bold text-gray-900">
                  {biodataFileName || 'Matrimonial Biodata'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 bg-gray-100 p-2">
              <iframe src={biodataUrl} title="Biodata PDF" className="w-full h-full rounded-xl border-none" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
