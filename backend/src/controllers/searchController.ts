import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Profile from '../models/Profile';
import User from '../models/User';
import Shortlist from '../models/Shortlist';
import Interest from '../models/Interest';
import { calculateMatchPercentage } from '../services/matchService';

export const searchProfiles = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      gender,
      minAge,
      maxAge,
      city,
      state,
      education,
      occupation,
      religion,
      caste,
      motherTongue,
      maritalStatus,
      page = 1,
      limit = 20,
    } = req.query;

    const query: any = {};

    // Don't show current logged-in user's own profile in search results
    if (req.user?.id) {
      query.user = { $ne: req.user.id };
    }

    // Default to opposite gender if logged in user gender is known
    if (gender) {
      query.gender = gender;
    } else if (req.user?.id) {
      const myUser = await User.findById(req.user.id);
      if (myUser) {
        query.gender = myUser.gender === 'male' ? 'female' : 'male';
      }
    }

    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = Number(minAge);
      if (maxAge) query.age.$lte = Number(maxAge);
    }

    if (city) query.city = { $regex: String(city), $options: 'i' };
    if (state) query.state = { $regex: String(state), $options: 'i' };
    if (education) query.education = { $regex: String(education), $options: 'i' };
    if (occupation) query.occupation = { $regex: String(occupation), $options: 'i' };
    if (religion) query.religion = { $regex: String(religion), $options: 'i' };
    if (caste) query.caste = { $regex: String(caste), $options: 'i' };
    if (motherTongue) query.motherTongue = { $regex: String(motherTongue), $options: 'i' };
    if (maritalStatus) query.maritalStatus = maritalStatus;

    // Search by Name
    if (name) {
      const matchingUsers = await User.find({
        fullName: { $regex: String(name), $options: 'i' },
      }).select('_id');
      const userIds = matchingUsers.map((u) => u._id);
      query.user = { ...query.user, $in: userIds };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const totalCount = await Profile.countDocuments(query);

    const profiles = await Profile.find(query)
      .populate('user', 'fullName email mobile gender isVerified status')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    // Fetch user's myProfile for match percentage calculation
    let myProfile: any = null;
    let shortlistedIds: string[] = [];
    let sentInterestIds: string[] = [];

    if (req.user?.id) {
      myProfile = await Profile.findOne({ user: req.user.id });
      const shortlists = await Shortlist.find({ userId: req.user.id });
      shortlistedIds = shortlists.map((s) => s.targetUserId.toString());

      const interests = await Interest.find({ senderId: req.user.id });
      sentInterestIds = interests.map((i) => i.receiverId.toString());
    }

    const results = profiles.map((p) => {
      const matchScore = calculateMatchPercentage(myProfile, p);
      const targetUserId = p.user._id.toString();
      return {
        _id: p._id,
        user: p.user,
        profileId: p.profileId,
        age: p.age,
        gender: p.gender,
        height: p.height,
        maritalStatus: p.maritalStatus,
        religion: p.religion,
        caste: p.caste,
        motherTongue: p.motherTongue,
        city: p.city,
        state: p.state,
        education: p.education,
        occupation: p.occupation,
        income: p.income,
        aboutMe: p.aboutMe,
        primaryPhoto: p.primaryPhoto,
        photosCount: p.photos.length,
        hasBiodata: !!p.biodataUrl,
        biodataVisibility: p.biodataVisibility,
        photoVisibility: p.photoVisibility,
        isVerified: p.isVerified,
        matchPercentage: matchScore,
        isShortlisted: shortlistedIds.includes(targetUserId),
        interestSent: sentInterestIds.includes(targetUserId),
      };
    });

    return res.json({
      total: totalCount,
      page: Number(page),
      totalPages: Math.ceil(totalCount / Number(limit)),
      profiles: results,
    });
  } catch (error: any) {
    console.error('Search profiles error:', error);
    return res.status(500).json({ message: 'Error searching profiles' });
  }
};

export const getFeaturedProfiles = async (req: Request, res: Response) => {
  try {
    const featured = await Profile.find()
      .populate('user', 'fullName gender isVerified')
      .limit(6)
      .sort({ completionPercentage: -1 });

    const results = featured.map((p) => ({
      _id: p._id,
      user: p.user,
      profileId: p.profileId,
      age: p.age,
      gender: p.gender,
      city: p.city,
      state: p.state,
      education: p.education,
      occupation: p.occupation,
      primaryPhoto: p.primaryPhoto,
      isVerified: p.isVerified,
      matchPercentage: 88,
    }));

    return res.json(results);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching featured profiles' });
  }
};
