import mongoose, { Schema, Document } from 'mongoose';

export interface IProfileView extends Document {
  viewerId: mongoose.Types.ObjectId;
  profileOwnerId: mongoose.Types.ObjectId;
  viewedAt: Date;
}

const ProfileViewSchema: Schema = new Schema(
  {
    viewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    profileOwnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    viewedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ProfileViewSchema.index({ viewerId: 1, profileOwnerId: 1, viewedAt: -1 });

export default mongoose.model<IProfileView>('ProfileView', ProfileViewSchema);
