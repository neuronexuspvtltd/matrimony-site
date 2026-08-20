import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Profile from '../models/Profile';
import User from '../models/User';
import { trackProfileView } from './viewController';

// Calculate completion percentage based on filled fields
const calculateCompletion = (profile: any): number => {
  let score = 30; // base registration
  if (profile.aboutMe && profile.aboutMe.length > 10) score += 10;
  if (profile.primaryPhoto) score += 20;
  if (profile.biodataUrl) score += 15;
  if (profile.education && profile.occupation) score += 10;
  if (profile.fatherOccupation || profile.motherOccupation) score += 5;
  if (profile.partnerPreferences && profile.partnerPreferences.education) score += 10;
  return Math.min(100, score);
};

export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await Profile.findOne({ user: req.user?.id }).populate('user', 'fullName email mobile gender isVerified status');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    return res.json(profile);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving profile' });
  }
};

export const getProfileById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // Can be Mongo _id or profileId (e.g. PB-10024)
    let profile = await Profile.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { profileId: id }],
    }).populate('user', 'fullName email mobile gender isVerified status');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Trigger profile view tracking if viewer is logged in & not viewing own profile!
    if (req.user && req.user.id !== profile.user._id.toString()) {
      await trackProfileView(req.user.id, profile.user._id.toString(), profile.profileId);
    }

    return res.json(profile);
  } catch (error: any) {
    console.error('Error in getProfileById:', error);
    return res.status(500).json({ message: 'Error retrieving profile' });
  }
};

export const updateMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await Profile.findOne({ user: req.user?.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const fieldsToUpdate = [
      'height', 'maritalStatus', 'religion', 'caste', 'subCaste', 'motherTongue',
      'city', 'state', 'country', 'education', 'college', 'occupation', 'company',
      'income', 'fatherOccupation', 'motherOccupation', 'brothers', 'sisters',
      'familyType', 'familyValues', 'aboutMe', 'partnerPreferences',
      'biodataVisibility', 'photoVisibility'
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        (profile as any)[field] = req.body[field];
      }
    });

    profile.completionPercentage = calculateCompletion(profile);
    await profile.save();

    return res.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating profile' });
  }
};

export const uploadBiodataPdf = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a valid PDF file (max 5MB)' });
    }

    const fileUrl = `/uploads/biodata/${req.file.filename}`;
    const profile = await Profile.findOne({ user: req.user?.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.biodataUrl = fileUrl;
    profile.biodataFileName = req.file.originalname;
    profile.biodataUploadedAt = new Date();
    profile.completionPercentage = calculateCompletion(profile);

    await profile.save();

    return res.json({
      message: 'Biodata PDF uploaded successfully',
      biodataUrl: fileUrl,
      biodataFileName: req.file.originalname,
      profile,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error uploading biodata PDF' });
  }
};

export const uploadPhoto = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a valid image file (JPEG, PNG, WebP)' });
    }

    const photoUrl = `/uploads/photos/${req.file.filename}`;
    const profile = await Profile.findOne({ user: req.user?.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (!profile.primaryPhoto) {
      profile.primaryPhoto = photoUrl;
    }
    profile.photos.push(photoUrl);
    profile.completionPercentage = calculateCompletion(profile);

    await profile.save();

    return res.json({
      message: 'Photo uploaded successfully',
      photoUrl,
      primaryPhoto: profile.primaryPhoto,
      photos: profile.photos,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error uploading photo' });
  }
};

export const setPrimaryPhoto = async (req: AuthRequest, res: Response) => {
  try {
    const { photoUrl } = req.body;
    const profile = await Profile.findOne({ user: req.user?.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (profile.photos.includes(photoUrl)) {
      profile.primaryPhoto = photoUrl;
      await profile.save();
      return res.json({ message: 'Primary photo updated', profile });
    } else {
      return res.status(400).json({ message: 'Photo not found in gallery' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error setting primary photo' });
  }
};

export const deletePhoto = async (req: AuthRequest, res: Response) => {
  try {
    const { photoUrl } = req.body;
    const profile = await Profile.findOne({ user: req.user?.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.photos = profile.photos.filter((p) => p !== photoUrl);
    if (profile.primaryPhoto === photoUrl) {
      profile.primaryPhoto = profile.photos.length > 0 ? profile.photos[0] : '';
    }
    profile.completionPercentage = calculateCompletion(profile);

    await profile.save();

    return res.json({ message: 'Photo deleted', profile });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting photo' });
  }
};

export const deleteBiodata = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await Profile.findOne({ user: req.user?.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.biodataUrl = '';
    profile.biodataFileName = '';
    profile.biodataUploadedAt = undefined;
    profile.completionPercentage = calculateCompletion(profile);

    await profile.save();

    return res.json({ message: 'Biodata deleted', profile });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting biodata' });
  }
};
