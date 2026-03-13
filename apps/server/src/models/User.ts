import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name?: string;
    email?: string;
    emailVerified?: Date;
    image?: string;
    role: string;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String },
        email: { type: String, unique: true, sparse: true },
        emailVerified: { type: Date },
        image: { type: String },
        role: { type: String, default: 'USER' }, // USER, ADMIN, OWNER
        createdAt: { type: Date, default: Date.now },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
