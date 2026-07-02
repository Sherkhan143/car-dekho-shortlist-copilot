import mongoose, { Schema, Model, Types } from "mongoose";

export interface IShortlist {
  sessionId: string;
  car: Types.ObjectId;
}

const ShortlistSchema = new Schema<IShortlist>(
  {
    sessionId: { type: String, required: true, trim: true, index: true },
    car: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
  },
  { timestamps: true }
);

// A car can only be shortlisted once per session.
ShortlistSchema.index({ sessionId: 1, car: 1 }, { unique: true });

export const Shortlist: Model<IShortlist> =
  mongoose.models.Shortlist ||
  mongoose.model<IShortlist>("Shortlist", ShortlistSchema);

export default Shortlist;
