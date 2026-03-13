import mongoose, { Document, Schema } from 'mongoose';

export interface IFeaturedListing extends Document {
    hotelId: string;
    city: string;
    position: number;
    startDate: Date;
    endDate: Date;
    active: boolean;
    price: number;
    reason: string;
    createdAt: Date;
}

const FeaturedListingSchema = new Schema<IFeaturedListing>(
    {
        hotelId: { type: String, required: true, index: true },
        city: { type: String, required: true },
        position: { type: Number, required: true, index: true }, // 1-5
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        active: { type: Boolean, default: true },
        price: { type: Number, required: true },
        reason: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Compound index for city + active for featured listing queries
FeaturedListingSchema.index({ city: 1, active: 1 });

export const FeaturedListing = mongoose.models.FeaturedListing || mongoose.model<IFeaturedListing>('FeaturedListing', FeaturedListingSchema);
