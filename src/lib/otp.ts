import { prisma } from "@/lib/prisma";

const CODE_TTL_MINUTES = 5;
const MAX_SEND_PER_WINDOW = 3;
const SEND_WINDOW_MINUTES = 10;
const MAX_VERIFY_ATTEMPTS = 5;

// No real SMS provider is configured yet (no Eskiz.uz/Play Mobile account).
// This mock generates and stores a real one-time code and "sends" it by
// logging it server-side and returning it to the caller so the UI can show
// it during testing. Swap sendSms's body for a real gateway call once
// credentials are available — everything else (storage, expiry, single-use
// consumption, rate limiting) already works for real use.
function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendSms(phone: string, code: string): Promise<void> {
  console.log(`[SMS mock] ${phone} ga tasdiqlash kodi: ${code}`);
}

export class OtpRateLimitError extends Error {}

export async function createOtp(phone: string): Promise<{ devCode: string }> {
  const windowStart = new Date(Date.now() - SEND_WINDOW_MINUTES * 60 * 1000);
  const recentCount = await prisma.phoneVerification.count({
    where: { phone, createdAt: { gt: windowStart } },
  });
  if (recentCount >= MAX_SEND_PER_WINDOW) {
    throw new OtpRateLimitError(
      `Juda ko'p urinish. ${SEND_WINDOW_MINUTES} daqiqadan so'ng qaytadan urinib ko'ring.`,
    );
  }

  const code = generateCode();
  const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);

  await prisma.phoneVerification.create({
    data: { phone, code, expiresAt },
  });
  await sendSms(phone, code);

  // devCode is only meaningful because no real SMS provider is wired up —
  // remove this from the return value once one is.
  return { devCode: code };
}

// Looks up the latest active code for this phone (by phone alone, not
// phone+code) so a wrong guess can still be counted as a failed attempt
// against it, enabling lockout after MAX_VERIFY_ATTEMPTS.
async function findActiveRecord(phone: string) {
  return prisma.phoneVerification.findFirst({
    where: { phone, consumed: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
}

export async function checkOtp(phone: string, code: string): Promise<boolean> {
  const record = await findActiveRecord(phone);
  if (!record || record.attempts >= MAX_VERIFY_ATTEMPTS) return false;

  if (record.code !== code) {
    await prisma.phoneVerification.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    return false;
  }
  return true;
}

export async function consumeOtp(phone: string, code: string): Promise<boolean> {
  const record = await findActiveRecord(phone);
  if (!record || record.attempts >= MAX_VERIFY_ATTEMPTS) return false;

  if (record.code !== code) {
    await prisma.phoneVerification.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    return false;
  }

  await prisma.phoneVerification.update({
    where: { id: record.id },
    data: { consumed: true },
  });
  return true;
}
