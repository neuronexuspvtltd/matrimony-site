import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Conversation from '../models/Conversation';
import Message from '../models/Message';
import Interest from '../models/Interest';
import User from '../models/User';
import Profile from '../models/Profile';
import Notification from '../models/Notification';

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'fullName email gender')
      .sort({ updatedAt: -1 });

    const partnerUserIds = conversations
      .map((c) => c.participants.find((p) => p._id.toString() !== userId))
      .filter(Boolean)
      .map((p: any) => p._id);

    const profiles = await Profile.find({ user: { $in: partnerUserIds } });

    const results = conversations.map((conv) => {
      const partner = conv.participants.find((p) => p._id.toString() !== userId) as any;
      const partnerProfile = profiles.find((p) => p.user.toString() === partner?._id.toString());

      return {
        _id: conv._id,
        lastMessage: conv.lastMessage,
        lastMessageAt: conv.lastMessageAt,
        updatedAt: conv.updatedAt,
        partner: partner
          ? {
              id: partner._id,
              fullName: partner.fullName,
              profileId: partnerProfile?.profileId,
              primaryPhoto: partnerProfile?.primaryPhoto,
              city: partnerProfile?.city,
              occupation: partnerProfile?.occupation,
            }
          : null,
      };
    });

    return res.json(results);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching conversations' });
  }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?.id;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found or unauthorized' });
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    // Mark unread messages from partner as read
    await Message.updateMany({ conversationId, senderId: { $ne: userId }, isRead: false }, { isRead: true });

    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching messages' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const senderId = req.user?.id;
    const { conversationId, content } = req.body;

    if (!senderId || !content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: senderId,
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const recipientId = conversation.participants.find((p) => p.toString() !== senderId)?.toString();

    // Check if mutual interest connection exists
    const mutualInterest = await Interest.findOne({
      $or: [
        { senderId, receiverId: recipientId, status: 'accepted' },
        { senderId: recipientId, receiverId: senderId, status: 'accepted' },
      ],
    });

    if (!mutualInterest && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Messaging is allowed only between connected members' });
    }

    const message = await Message.create({
      conversationId,
      senderId,
      content,
    });

    conversation.lastMessage = content;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const senderUser = await User.findById(senderId);
    const senderProfile = await Profile.findOne({ user: senderId });

    if (recipientId) {
      await Notification.create({
        userId: recipientId,
        type: 'MESSAGE',
        titleEn: '💬 New Message',
        titleMr: '💬 नवीन संदेश',
        messageEn: `${senderUser?.fullName} sent you a message: "${content.substring(0, 30)}${content.length > 30 ? '...' : ''}"`,
        messageMr: `${senderUser?.fullName} यांनी तुम्हाला संदेश पाठवला: "${content.substring(0, 30)}${content.length > 30 ? '...' : ''}"`,
        senderId,
        targetProfileId: senderProfile?.profileId,
      });
    }

    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ message: 'Error sending message' });
  }
};
