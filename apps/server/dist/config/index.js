import { z } from 'zod';
import 'dotenv/config';
// Environment variable validation schema
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('3001'),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
    STRIPE_WEBHOOK_SECRET: z.string().optional(), // Optional for local development
    CORS_ORIGIN: z.string().default('http://localhost:3000'),
});
// Validate and parse environment variables
function validateEnv() {
    try {
        return envSchema.parse(process.env);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            console.error('❌ Invalid environment variables:');
            error.issues.forEach((err) => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
        }
        process.exit(1);
    }
}
export const env = validateEnv();
// Application configuration
export const config = {
    env: env.NODE_ENV,
    port: parseInt(env.PORT, 10),
    database: {
        url: env.DATABASE_URL,
    },
    stripe: {
        secretKey: env.STRIPE_SECRET_KEY,
    },
    cors: {
        origin: env.CORS_ORIGIN,
    },
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
};
