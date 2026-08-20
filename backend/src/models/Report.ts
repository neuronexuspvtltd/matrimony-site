import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  reporterId: mongoose.Types.ObjectId;
  reportedUserId: mongoose.Types.ObjectId;
  reason: string;
  details?: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
  createdAt: Date;
}

const ReportSchema: Schema = new Schema(
  {
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reportedUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    details: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'action_taken', 'dismissed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IReport>('Report', ReportSchema);
