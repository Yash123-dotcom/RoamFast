import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
    overallRating: number;
    cleanliness: number;
    sleepQuality: number;
    staffExperience: number;
    luxuryValue: number;
    travelerType: string;
    comment?: string;
    verified: boolean;
    userId: string;
    hotelId: string;
    createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
    {
        overallRating: { type: Number, required: true },
        cleanliness: { type: Number, required: true },
        sleepQuality: { type: Number, required: true },
        staffExperience: { type: Number, required: true },
        luxuryValue: { type: Number, required: true },
        travelerType: { type: String, required: true },
        comment: { type: String },
        verified: { type: Boolean, default: false },
        userId: { type: String, required: true },
        hotelId: { type: String, required: true, index: true },
        createdAt: { type: Date, default: Date.now },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
