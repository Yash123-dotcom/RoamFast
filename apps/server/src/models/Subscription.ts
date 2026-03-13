import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
    hotelId: string;
    tier: string;
    startDate: Date;
    endDate: Date;
    active: boolean;
    price: number;
    createdAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
    {
        hotelId: { type: String, required: true, index: true },
        tier: { type: String, default: 'FREE' }, // FREE, SILVER, GOLD, PLATINUM
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        active: { type: Boolean, default: true, index: true },
        price: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

export const Subscription = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
