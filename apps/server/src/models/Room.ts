import mongoose, { Document, Schema } from 'mongoose';

export interface IRoom extends Document {
    type: string;
    price: number;
    capacity: number;
    hotelId: string;
    createdAt: Date;
}

const RoomSchema = new Schema<IRoom>(
    {
        type: { type: String, required: true },
        price: { type: Number, required: true },
        capacity: { type: Number, default: 2 },
        hotelId: { type: String, required: true, index: true },
        createdAt: { type: Date, default: Date.now },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

export const Room = mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);
