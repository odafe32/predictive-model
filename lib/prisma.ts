import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Retry wrapper for Prisma queries — Neon serverless databases suspend when idle,
 * causing the first connection to fail. This retries up to 3 times with a delay.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      // Only retry on connection errors
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.includes("Can't reach database server") || msg.includes("Closed") || msg.includes("Connection")) {
        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
          continue;
        }
      }
      throw error;
    }
  }
  throw lastError;
}
