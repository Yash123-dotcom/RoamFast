import mongoose, { Document, Schema } from 'mongoose';

export interface IHotel extends Document {
    name: string;
    description: string;
    address: string;
    city: string;
    price: number;
    images: string[];
    amenities: string[];
    rating: number;
    qualityScore?: number;
    scoreBreakdown?: string;
    lastScoreUpdate?: Date;
    customBranding?: string;
    brandStory?: string;
    featuredImages?: string[];
    ownerId?: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const HotelSchema = new Schema<IHotel>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true, index: true },
        price: { type: Number, required: true, index: true },
        images: [{ type: String }],
        amenities: [{ type: String }],
        rating: { type: Number, default: 0, index: true },
        qualityScore: { type: Number, default: 0 },
        scoreBreakdown: { type: String },
        lastScoreUpdate: { type: Date },
        customBranding: { type: String },
        brandStory: { type: String },
        featuredImages: [{ type: String }],
        ownerId: { type: String },
        status: { type: String, default: 'PENDING', index: true }, // PENDING, APPROVED, REJECTED
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

export const Hotel = mongoose.models.Hotel || mongoose.model<IHotel>('Hotel', HotelSchema);
