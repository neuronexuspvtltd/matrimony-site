import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'PROFILE_VIEW' | 'INTEREST_RECEIVED' | 'INTEREST_ACCEPTED' | 'INTEREST_REJECTED' | 'NEW_MATCH' | 'MESSAGE' | 'SYSTEM';
  titleEn: string;
  titleMr: string;
  messageEn: string;
  messageMr: string;
  senderId?: mongoose.Types.ObjectId;
  targetProfileId?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['PROFILE_VIEW', 'INTEREST_RECEIVED', 'INTEREST_ACCEPTED', 'INTEREST_REJECTED', 'NEW_MATCH', 'MESSAGE', 'SYSTEM'],
      required: true,
    },
    titleEn: { type: String, required: true },
    titleMr: { type: String, required: true },
    messageEn: { type: String, required: true },
    messageMr: { type: String, required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    targetProfileId: { type: String, default: '' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);
