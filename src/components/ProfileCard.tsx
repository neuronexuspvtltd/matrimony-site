import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../services/api';
import { Heart, Star, MapPin, GraduationCap, Briefcase, ShieldCheck, FileText } from 'lucide-react';

interface ProfileCardProps {
  profile: {
    _id: string;
    profileId: string;
    user?: {
      _id: string;
      fullName: string;
    };
    age: number;
    gender: string;
    city: string;
    state: string;
    education: string;
    occupation: string;
    primaryPhoto?: string;
    matchPercentage?: number;
    isVerified?: boolean;
    isShortlisted?: boolean;
    interestSent?: boolean;
    hasBiodata?: boolean;
  };
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isShortlisted, setIsShortlisted] = useState(profile.isShortlisted || false);
  const [interestSent, setInterestSent] = useState(profile.interestSent || false);
  const [loading, setLoading] = useState(false);

  const fullName = profile.user?.fullName || 'Profile Member';
  const targetUserId = profile.user?._id || profile._id;

  const handleToggleShortlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetchApi('/shortlists/toggle', {
        method: 'POST',
        body: JSON.stringify({ targetUserId }),
      });
      setIsShortlisted(res.shortlisted);
    } catch (error) {
      console.error('Error toggling shortlist:', error);
    }
  };

  const handleSendInterest = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    if (interestSent) return;

    setLoading(true);
    try {
      await fetchApi('/interests/send', {
        method: 'POST',
        body: JSON.stringify({ receiverId: targetUserId }),
      });
      setInterestSent(true);
    } catch (error: any) {
      alert(error.message || 'Could not send interest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-ivory-300 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col justify-between">
      
      {/* Top Image Section */}
      <div className="relative aspect-[4/3] bg-ivory-200 overflow-hidden">
        {profile.primaryPhoto ? (
          <img
            src={profile.primaryPhoto}
            alt={fullName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-ivory-200 to-ivory-300 text-brand-900">
            <div className="w-16 h-16 rounded-full bg-brand-900/10 flex items-center justify-center font-serif text-2xl font-bold text-brand-900 mb-1">
              {fullName.charAt(0)}
            </div>
            <span className="text-xs text-gray-500 font-medium">Photo Protected</span>
          </div>
        )}

        {/* Top Badges overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          
          {/* Match Score */}
          {profile.matchPercentage && (
            <span className="bg-brand-900/90 text-gold-300 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm border border-gold-400/30">
              {profile.matchPercentage}% {t('matchScore')}
            </span>
          )}

          {/* Shortlist Star Button */}
          <button
            onClick={handleToggleShortlist}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md shadow-md transition-all cursor-pointer ${
              isShortlisted
                ? 'bg-gold-400 text-brand-950 scale-110'
                : 'bg-white/80 text-gray-700 hover:bg-white hover:text-gold-600'
            }`}
            title={isShortlisted ? t('shortlisted') : t('shortlist')}
          >
            <Star className={`w-4 h-4 ${isShortlisted ? 'fill-brand-950' : ''}`} />
          </button>
        </div>

        {/* Verified Badge */}
        {profile.isVerified && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200 shadow-xs">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>{t('verifiedBadge')}</span>
          </div>
        )}

        {/* Has Biodata Indicator */}
        {profile.hasBiodata && (
          <div className="absolute bottom-3 right-3 bg-brand-950/80 backdrop-blur-md text-gold-300 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
            <FileText className="w-3 h-3 text-gold-400" />
            <span>PDF</span>
          </div>
        )}
      </div>

      {/* Details Content */}
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="font-serif text-lg font-bold text-brand-950 truncate group-hover:text-brand-700 transition-colors">
              {fullName}, <span className="text-gray-600 font-sans text-base font-normal">{profile.age}</span>
            </h3>
            <span className="text-[10px] font-mono text-gold-700 bg-gold-50 border border-gold-200 px-1.5 py-0.5 rounded">
              {profile.profileId}
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-gray-600 pt-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
              <span className="truncate">{profile.city}, {profile.state}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-gold-600 shrink-0" />
              <span className="truncate">{profile.education}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-gold-600 shrink-0" />
              <span className="truncate">{profile.occupation}</span>
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
          <Link
            to={`/profile/${profile.profileId}`}
            className="flex-1 text-center py-2 px-3 rounded-xl border border-brand-900 text-brand-900 hover:bg-brand-50 text-xs font-semibold transition-colors"
          >
            {t('viewProfile')}
          </Link>

          <button
            onClick={handleSendInterest}
            disabled={interestSent || loading}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              interestSent
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'bg-brand-900 hover:bg-brand-950 text-gold-300 shadow-sm'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${interestSent ? 'fill-emerald-600 stroke-none' : 'fill-gold-300/30'}`} />
            <span>{interestSent ? t('interestSent') : t('sendInterest')}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
