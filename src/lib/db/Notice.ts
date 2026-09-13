import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotice extends Document {
  mosqueId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  pinned: boolean;
  publishedAt: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NoticeSchema = new Schema<INotice>(
  {
    mosqueId: {
      type: Schema.Types.ObjectId,
      ref: "Mosque",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    pinned: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

NoticeSchema.index({ mosqueId: 1, pinned: -1, publishedAt: -1 });

export const Notice: Model<INotice> =
  mongoose.models.Notice || mongoose.model<INotice>("Notice", NoticeSchema);
