import mongoose, { Schema, Document } from 'mongoose';

export interface IBlock extends Document {
  blockerId: mongoose.Types.ObjectId;
  blockedUserId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const BlockSchema: Schema = new Schema(
  {
    blockerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    blockedUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

BlockSchema.index({ blockerId: 1, blockedUserId: 1 }, { unique: true });

export default mongoose.model<IBlock>('Block', BlockSchema);
