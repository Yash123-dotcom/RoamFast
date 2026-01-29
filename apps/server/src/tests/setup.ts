import { beforeAll, afterAll } from 'vitest';

beforeAll(() => {
    // Set test environment
    process.env.NODE_ENV = 'test';
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
});

afterAll(() => {
    // Cleanup if needed
});
