import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Notification from '../models/Notification';

export const getMyNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    return res.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching notifications' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?.id;

    await Notification.updateOne({ _id: notificationId, userId }, { isRead: true });

    return res.json({ message: 'Notification marked as read' });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating notification' });
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    return res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating notifications' });
  }
};
