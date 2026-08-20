import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Shortlist from '../models/Shortlist';
import Profile from '../models/Profile';

export const toggleShortlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { targetUserId } = req.body;

    if (!userId || !targetUserId) {
      return res.status(400).json({ message: 'Target user ID required' });
    }

    if (userId === targetUserId) {
      return res.status(400).json({ message: 'You cannot shortlist yourself' });
    }

    const existing = await Shortlist.findOne({ userId, targetUserId });
    if (existing) {
      await Shortlist.deleteOne({ _id: existing._id });
      return res.json({ message: 'Removed from shortlist', shortlisted: false });
    } else {
      await Shortlist.create({ userId, targetUserId });
      return res.json({ message: 'Added to shortlist', shortlisted: true });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error updating shortlist' });
  }
};

export const getMyShortlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const items = await Shortlist.find({ userId }).populate('targetUserId', 'fullName email gender');
    const targetUserIds = items.map((i) => i.targetUserId._id);

    const profiles = await Profile.find({ user: { $in: targetUserIds } });

    const formatted = items.map((item) => {
      const p = profiles.find((prof) => prof.user.toString() === item.targetUserId._id.toString());
      return {
        _id: item._id,
        shortlistedAt: item.createdAt,
        profile: {
          id: p?.user,
          profileId: p?.profileId,
          fullName: (item.targetUserId as any).fullName,
          gender: (item.targetUserId as any).gender,
          age: p?.age,
          height: p?.height,
          city: p?.city,
          state: p?.state,
          education: p?.education,
          occupation: p?.occupation,
          primaryPhoto: p?.primaryPhoto,
        },
      };
    });

    return res.json(formatted);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching shortlist' });
  }
};
