import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Report from '../models/Report';
import Block from '../models/Block';

export const reportProfile = async (req: AuthRequest, res: Response) => {
  try {
    const reporterId = req.user?.id;
    const { reportedUserId, reason, details } = req.body;

    if (!reporterId || !reportedUserId || !reason) {
      return res.status(400).json({ message: 'Reported user ID and reason are required' });
    }

    const report = await Report.create({
      reporterId,
      reportedUserId,
      reason,
      details: details || '',
    });

    return res.status(201).json({ message: 'Profile reported successfully. Our team will review it.', report });
  } catch (error) {
    return res.status(500).json({ message: 'Error reporting profile' });
  }
};

export const toggleBlockUser = async (req: AuthRequest, res: Response) => {
  try {
    const blockerId = req.user?.id;
    const { blockedUserId } = req.body;

    if (!blockerId || !blockedUserId) {
      return res.status(400).json({ message: 'Blocked user ID is required' });
    }

    const existing = await Block.findOne({ blockerId, blockedUserId });
    if (existing) {
      await Block.deleteOne({ _id: existing._id });
      return res.json({ message: 'User unblocked', isBlocked: false });
    } else {
      await Block.create({ blockerId, blockedUserId });
      return res.json({ message: 'User blocked successfully', isBlocked: true });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error updating block status' });
  }
};
