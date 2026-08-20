import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  gender: 'male' | 'female';
  dob: Date;
  role: 'user' | 'admin';
  isVerified: boolean;
  status: 'active' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    dob: { type: Date, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
