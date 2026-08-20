import mongoose, { Schema, Document } from 'mongoose';

export interface IShortlist extends Document {
  userId: mongoose.Types.ObjectId;
  targetUserId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ShortlistSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

ShortlistSchema.index({ userId: 1, targetUserId: 1 }, { unique: true });

export default mongoose.model<IShortlist>('Shortlist', ShortlistSchema);
