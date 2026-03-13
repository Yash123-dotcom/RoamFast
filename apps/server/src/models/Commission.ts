import mongoose, { Document, Schema } from 'mongoose';

export interface ICommission extends Document {
    bookingId: string;
    commissionRate: number;
    commissionAmount: number;
    platformFee: number;
    hotelPayout: number;
    status: string;
    paidAt?: Date;
    createdAt: Date;
}

const CommissionSchema = new Schema<ICommission>(
    {
        bookingId: { type: String, required: true, unique: true, index: true },
        commissionRate: { type: Number, required: true },
        commissionAmount: { type: Number, required: true },
        platformFee: { type: Number, required: true },
        hotelPayout: { type: Number, required: true },
        status: { type: String, default: 'PENDING', index: true }, // PENDING, PAID, FAILED
        paidAt: { type: Date },
        createdAt: { type: Date, default: Date.now },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

export const Commission = mongoose.models.Commission || mongoose.model<ICommission>('Commission', CommissionSchema);
