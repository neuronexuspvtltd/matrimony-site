import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  user: mongoose.Types.ObjectId;
  profileId: string;
  age: number; // Computed helper or stored for indexing
  gender: 'male' | 'female';
  height: string; // e.g. "5 ft 8 in"
  maritalStatus: string; // "never_married", "divorced", "widowed", etc.
  religion: string;
  caste: string;
  subCaste?: string;
  motherTongue: string;
  city: string;
  state: string;
  country: string;
  education: string;
  college?: string;
  occupation: string;
  company?: string;
  income?: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  brothers?: number;
  sisters?: number;
  familyType?: string;
  familyValues?: string;
  aboutMe?: string;
  partnerPreferences?: {
    minAge?: number;
    maxAge?: number;
    minHeight?: string;
    maxHeight?: string;
    education?: string;
    occupation?: string;
    location?: string;
    religion?: string;
    caste?: string;
  };
  biodataUrl?: string;
  biodataFileName?: string;
  biodataUploadedAt?: Date;
  biodataVisibility: 'public' | 'connections_only' | 'private';
  primaryPhoto?: string;
  photos: string[];
  photoVisibility: 'public' | 'connections_only' | 'private';
  completionPercentage: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    profileId: { type: String, required: true, unique: true },
    age: { type: Number, required: true, index: true },
    gender: { type: String, enum: ['male', 'female'], required: true, index: true },
    height: { type: String, default: "5'6\"" },
    maritalStatus: { type: String, default: 'never_married', index: true },
    religion: { type: String, required: true, index: true },
    caste: { type: String, required: true, index: true },
    subCaste: { type: String, default: '' },
    motherTongue: { type: String, required: true, index: true },
    city: { type: String, required: true, index: true },
    state: { type: String, required: true, index: true },
    country: { type: String, default: 'India' },
    education: { type: String, required: true, index: true },
    college: { type: String, default: '' },
    occupation: { type: String, required: true, index: true },
    company: { type: String, default: '' },
    income: { type: String, default: '' },
    fatherOccupation: { type: String, default: '' },
    motherOccupation: { type: String, default: '' },
    brothers: { type: Number, default: 0 },
    sisters: { type: Number, default: 0 },
    familyType: { type: String, default: 'nuclear' },
    familyValues: { type: String, default: 'moderate' },
    aboutMe: { type: String, default: '' },
    partnerPreferences: {
      minAge: { type: Number, default: 21 },
      maxAge: { type: Number, default: 35 },
      minHeight: { type: String, default: "5'0\"" },
      maxHeight: { type: String, default: "6'2\"" },
      education: { type: String, default: 'Any' },
      occupation: { type: String, default: 'Any' },
      location: { type: String, default: 'Any' },
      religion: { type: String, default: 'Any' },
      caste: { type: String, default: 'Any' },
    },
    biodataUrl: { type: String, default: '' },
    biodataFileName: { type: String, default: '' },
    biodataUploadedAt: { type: Date },
    biodataVisibility: {
      type: String,
      enum: ['public', 'connections_only', 'private'],
      default: 'connections_only',
    },
    primaryPhoto: { type: String, default: '' },
    photos: [{ type: String }],
    photoVisibility: {
      type: String,
      enum: ['public', 'connections_only', 'private'],
      default: 'public',
    },
    completionPercentage: { type: Number, default: 60 },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProfileSchema.index({ city: 1, age: 1, religion: 1, caste: 1 });

export default mongoose.model<IProfile>('Profile', ProfileSchema);
