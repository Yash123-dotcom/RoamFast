import mongoose from 'mongoose';
import { config as dotenvConfig } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load .env from monorepo root (neonstay/.env) regardless of CWD
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenvConfig({ path: resolve(__dirname, '../../../../.env') });
dotenvConfig({ path: resolve(__dirname, '../../../.env'), override: false });

const MONGODB_URI = process.env.MONGODB_URI;


if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
}

let isConnected = false;

export async function connectDB(): Promise<void> {
    if (isConnected) {
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI!, {
            dbName: 'neonstay',
        });
        isConnected = true;
        console.log('✓ MongoDB connected successfully');
    } catch (error) {
        console.error('✗ MongoDB connection error:', error);
        throw error;
    }
}

export { mongoose };
