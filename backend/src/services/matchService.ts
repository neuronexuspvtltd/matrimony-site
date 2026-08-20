// Simple platform-based compatibility calculation
export const calculateMatchPercentage = (userProfile: any, targetProfile: any): number => {
  if (!userProfile || !targetProfile) return 75;

  let score = 50; // base score

  // Opposite gender check
  if (userProfile.gender === targetProfile.gender) {
    return 0;
  }

  // Religion match
  if (userProfile.religion === targetProfile.religion) {
    score += 15;
  }

  // Caste match
  if (userProfile.caste === targetProfile.caste) {
    score += 10;
  }

  // Mother Tongue match
  if (userProfile.motherTongue === targetProfile.motherTongue) {
    score += 10;
  }

  // State / City match
  if (userProfile.state === targetProfile.state) {
    score += 8;
  }
  if (userProfile.city === targetProfile.city) {
    score += 7;
  }

  // Preferred age range check
  const prefs = userProfile.partnerPreferences || {};
  const targetAge = targetProfile.age || 25;
  if (prefs.minAge && prefs.maxAge) {
    if (targetAge >= prefs.minAge && targetAge <= prefs.maxAge) {
      score += 10;
    }
  }

  // Cap between 65% and 98% for realistic natural feel
  const finalScore = Math.max(65, Math.min(98, score));
  return finalScore;
};
