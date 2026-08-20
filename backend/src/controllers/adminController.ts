import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Profile from '../models/Profile';
import ProfileView from '../models/ProfileView';
import Interest from '../models/Interest';
import Report from '../models/Report';
import Notification from '../models/Notification';

export const getAdminStats = async (_req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ role: 'user', status: 'active' });
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const totalViews = await ProfileView.countDocuments();
    const totalInterests = await Interest.countDocuments();
    const totalConnections = await Interest.countDocuments({ status: 'accepted' });
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    return res.json({
      totalUsers,
      activeUsers,
      verifiedUsers,
      totalViews,
      totalInterests,
      totalConnections,
      pendingReports,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving admin statistics' });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { search, status, verified, page = 1, limit = 20 } = req.query;

    const query: any = {};
    if (status) query.status = status;
    if (verified !== undefined) query.isVerified = verified === 'true';

    if (search) {
      query.$or = [
        { fullName: { $regex: String(search), $options: 'i' } },
        { email: { $regex: String(search), $options: 'i' } },
        { mobile: { $regex: String(search), $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query).select('-password').skip(skip).limit(Number(limit)).sort({ createdAt: -1 });

    const userIds = users.map((u) => u._id);
    const profiles = await Profile.find({ user: { $in: userIds } });

    const results = users.map((u) => {
      const p = profiles.find((prof) => prof.user.toString() === u._id.toString());
      return {
        _id: u._id,
        fullName: u.fullName,
        email: u.email,
        mobile: u.mobile,
        gender: u.gender,
        role: u.role,
        isVerified: u.isVerified,
        status: u.status,
        createdAt: u.createdAt,
        profileId: p?.profileId,
        city: p?.city,
        occupation: p?.occupation,
        completionPercentage: p?.completionPercentage || 0,
      };
    });

    return res.json({ total, page: Number(page), users: results });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving users' });
  }
};

export const toggleUserVerification = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isVerified = !user.isVerified;
    await user.save();

    await Profile.updateOne({ user: user._id }, { isVerified: user.isVerified });

    return res.json({ message: `User verification updated to ${user.isVerified}`, isVerified: user.isVerified });
  } catch (error) {
    return res.status(500).json({ message: 'Error toggling verification' });
  }
};

export const toggleUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { status } = req.body; // 'active' | 'suspended'

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.status = status;
    await user.save();

    return res.json({ message: `User status changed to ${status}`, status: user.status });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating user status' });
  }
};

export const getReports = async (_req: AuthRequest, res: Response) => {
  try {
    const reports = await Report.find()
      .populate('reporterId', 'fullName email')
      .populate('reportedUserId', 'fullName email')
      .sort({ createdAt: -1 });

    return res.json(reports);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching reports' });
  }
};

export const updateReportStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.status = status;
    await report.save();

    return res.json({ message: 'Report status updated', report });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating report status' });
  }
};

export const sendSystemAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { titleEn, titleMr, messageEn, messageMr } = req.body;

    if (!titleEn || !titleMr || !messageEn || !messageMr) {
      return res.status(400).json({ message: 'All title and message fields required' });
    }

    const users = await User.find({ role: 'user' }).select('_id');
    const notifications = users.map((u) => ({
      userId: u._id,
      type: 'SYSTEM',
      titleEn,
      titleMr,
      messageEn,
      messageMr,
    }));

    await Notification.insertMany(notifications);

    return res.json({ message: `System announcement sent to ${users.length} members` });
  } catch (error) {
    return res.status(500).json({ message: 'Error broadcasting announcement' });
  }
};
