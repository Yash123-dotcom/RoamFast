import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
    userId: string;
    hotelId: string;
    checkIn: Date;
    checkOut: Date;
    totalPrice: number;
    status: string;
    paymentId?: string;
    paymentIntentId?: string;
    paymentStatus: string;
    stripeCustomerId?: string;
    createdAt: Date;
}

const BookingSchema = new Schema<IBooking>(
    {
        userId: { type: String, required: true, index: true },
        hotelId: { type: String, required: true },
        checkIn: { type: Date, required: true },
        checkOut: { type: Date, required: true },
        totalPrice: { type: Number, required: true },
        status: { type: String, default: 'CONFIRMED', index: true }, // PENDING, CONFIRMED, CANCELLED, COMPLETED
        paymentId: { type: String },
        paymentIntentId: { type: String, unique: true, sparse: true, index: true },
        paymentStatus: { type: String, default: 'pending', index: true }, // pending, succeeded, failed, refunded
        stripeCustomerId: { type: String },
        createdAt: { type: Date, default: Date.now },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

export const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
