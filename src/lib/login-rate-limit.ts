import { prisma } from "@/lib/prisma";

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

export async function isLoginLocked(identifier: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);
  const count = await prisma.loginAttempt.count({
    where: { identifier, createdAt: { gt: windowStart } },
  });
  return count >= MAX_ATTEMPTS;
}

export async function recordFailedLogin(identifier: string): Promise<void> {
  await prisma.loginAttempt.create({ data: { identifier } });
}
