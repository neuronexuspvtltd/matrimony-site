import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import ProfileView from '../models/ProfileView';
import Notification from '../models/Notification';
import User from '../models/User';
import Profile from '../models/Profile';

export const trackProfileView = async (viewerId: string, profileOwnerId: string, targetProfileId: string) => {
  try {
    if (viewerId === profileOwnerId) return;

    const cooldownHours = parseInt(process.env.VIEW_COOLDOWN_HOURS || '24', 10);
    const cooldownTime = new Date(Date.now() - cooldownHours * 60 * 60 * 1000);

    // Check if view recorded within cooldown
    const recentView = await ProfileView.findOne({
      viewerId,
      profileOwnerId,
      viewedAt: { $gte: cooldownTime },
    });

    if (recentView) {
      // Cooldown active, do not create duplicate view record or notification
      return;
    }

    // Record view in database
    await ProfileView.create({
      viewerId,
      profileOwnerId,
      viewedAt: new Date(),
    });

    // Fetch viewer details for notification
    const viewer = await User.findById(viewerId);
    if (!viewer) return;

    const viewerName = viewer.fullName;

    // Create Notification for Profile Owner (Bilingual)
    await Notification.create({
      userId: profileOwnerId,
      type: 'PROFILE_VIEW',
      titleEn: '🔔 New Profile View',
      titleMr: '🔔 नवीन प्रोफाइल व्ह्यू',
      messageEn: `${viewerName} viewed your profile.`,
      messageMr: `${viewerName} यांनी तुमचे प्रोफाइल पाहिले.`,
      senderId: viewerId,
      targetProfileId,
    });
  } catch (error) {
    console.error('Error tracking profile view:', error);
  }
};

export const getMyProfileViews = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const views = await ProfileView.find({ profileOwnerId: userId })
      .sort({ viewedAt: -1 })
      .limit(20)
      .populate('viewerId', 'fullName email gender');

    const viewerUserIds = views.map((v) => v.viewerId._id);
    const profiles = await Profile.find({ user: { $in: viewerUserIds } });

    const viewMap = views.map((v) => {
      const viewerProf = profiles.find((p) => p.user.toString() === v.viewerId._id.toString());
      return {
        _id: v._id,
        viewedAt: v.viewedAt,
        viewer: {
          id: v.viewerId._id,
          fullName: (v.viewerId as any).fullName,
          gender: (v.viewerId as any).gender,
          profileId: viewerProf?.profileId,
          age: viewerProf?.age,
          city: viewerProf?.city,
          occupation: viewerProf?.occupation,
          primaryPhoto: viewerProf?.primaryPhoto,
        },
      };
    });

    return res.json({
      count: viewMap.length,
      views: viewMap,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving profile views' });
  }
};
