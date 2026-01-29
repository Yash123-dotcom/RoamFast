import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'], // Optional: Helps you see SQL logs
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Re-export Prisma types for use in other packages
export * from '@prisma/client';
