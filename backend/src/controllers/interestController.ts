import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Interest from '../models/Interest';
import Notification from '../models/Notification';
import Conversation from '../models/Conversation';
import User from '../models/User';
import Profile from '../models/Profile';

export const sendInterest = async (req: AuthRequest, res: Response) => {
  try {
    const senderId = req.user?.id;
    const { receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ message: 'Receiver ID is required' });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ message: 'You cannot send interest to yourself' });
    }

    const existing = await Interest.findOne({ senderId, receiverId });
    if (existing) {
      return res.status(400).json({ message: 'Interest already sent to this profile' });
    }

    const interest = await Interest.create({
      senderId,
      receiverId,
      status: 'pending',
    });

    const senderUser = await User.findById(senderId);
    const senderProfile = await Profile.findOne({ user: senderId });

    // Send Notification to Receiver
    await Notification.create({
      userId: receiverId,
      type: 'INTEREST_RECEIVED',
      titleEn: '💖 New Interest Received',
      titleMr: '💖 नवीन आवड (Interest) प्राप्त झाली',
      messageEn: `${senderUser?.fullName} expressed interest in your profile.`,
      messageMr: `${senderUser?.fullName} यांनी तुमच्या प्रोफाईलमध्ये रस दाखवला आहे.`,
      senderId,
      targetProfileId: senderProfile?.profileId,
    });

    return res.status(201).json({ message: 'Interest sent successfully', interest });
  } catch (error: any) {
    console.error('Error sending interest:', error);
    return res.status(500).json({ message: 'Error sending interest' });
  }
};

export const respondInterest = async (req: AuthRequest, res: Response) => {
  try {
    const receiverId = req.user?.id;
    const { interestId, action } = req.body; // action: 'accept' | 'reject'

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Action must be accept or reject' });
    }

    const interest = await Interest.findOne({ _id: interestId, receiverId });
    if (!interest) {
      return res.status(404).json({ message: 'Interest request not found' });
    }

    interest.status = action === 'accept' ? 'accepted' : 'rejected';
    await interest.save();

    const receiverUser = await User.findById(receiverId);
    const receiverProfile = await Profile.findOne({ user: receiverId });

    if (action === 'accept') {
      // Create conversation for chat!
      let conversation = await Conversation.findOne({
        participants: { $all: [interest.senderId, receiverId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [interest.senderId, receiverId],
          lastMessage: 'Mutual connection established. Say Hi!',
          lastMessageAt: new Date(),
        });
      }

      // Notify Sender
      await Notification.create({
        userId: interest.senderId,
        type: 'INTEREST_ACCEPTED',
        titleEn: '🎉 Interest Accepted!',
        titleMr: '🎉 आवड (Interest) स्विकारली!',
        messageEn: `${receiverUser?.fullName} accepted your interest! You can now start chatting.`,
        messageMr: `${receiverUser?.fullName} यांनी तुमची आवड स्वीकारली! आता संभाषण सुरू करू शकता.`,
        senderId: receiverId,
        targetProfileId: receiverProfile?.profileId,
      });
    } else {
      // Notify Sender of rejection
      await Notification.create({
        userId: interest.senderId,
        type: 'INTEREST_REJECTED',
        titleEn: 'Interest Declined',
        titleMr: 'आवड नाकारली',
        messageEn: `${receiverUser?.fullName} declined your interest request.`,
        messageMr: `${receiverUser?.fullName} यांनी तुमची विनंती नाकारली.`,
        senderId: receiverId,
      });
    }

    return res.json({ message: `Interest ${action}ed successfully`, interest });
  } catch (error) {
    return res.status(500).json({ message: 'Error responding to interest' });
  }
};

export const getMyInterests = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const received = await Interest.find({ receiverId: userId })
      .populate('senderId', 'fullName email gender')
      .sort({ createdAt: -1 });

    const sent = await Interest.find({ senderId: userId })
      .populate('receiverId', 'fullName email gender')
      .sort({ createdAt: -1 });

    // Fetch profiles for received and sent
    const receivedUserIds = received.map((i) => i.senderId._id);
    const sentUserIds = sent.map((i) => i.receiverId._id);

    const receivedProfiles = await Profile.find({ user: { $in: receivedUserIds } });
    const sentProfiles = await Profile.find({ user: { $in: sentUserIds } });

    const formatItem = (item: any, userObj: any, profiles: any[]) => {
      const p = profiles.find((prof) => prof.user.toString() === userObj._id.toString());
      return {
        _id: item._id,
        status: item.status,
        createdAt: item.createdAt,
        user: {
          id: userObj._id,
          fullName: userObj.fullName,
          gender: userObj.gender,
          profileId: p?.profileId,
          age: p?.age,
          city: p?.city,
          occupation: p?.occupation,
          primaryPhoto: p?.primaryPhoto,
          education: p?.education,
        },
      };
    };

    return res.json({
      received: received.map((i) => formatItem(i, i.senderId, receivedProfiles)),
      sent: sent.map((i) => formatItem(i, i.receiverId, sentProfiles)),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching interests' });
  }
};
