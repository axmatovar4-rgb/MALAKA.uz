"use server";

import { prisma } from "@/lib/prisma";
import { createOtp, checkOtp } from "@/lib/otp";
import { signIn } from "@/auth";
import type { QualificationCategory } from "@prisma/client";

function normalizePhone(phone: string): string {
  return phone.trim();
}

export async function requestOtp(phoneRaw: string) {
  const phone = normalizePhone(phoneRaw);
  if (!/^\+998\d{9}$/.test(phone)) {
    throw new Error("Telefon raqamini +998XXXXXXXXX formatida kiriting");
  }
  const { devCode } = await createOtp(phone);
  return { devCode };
}

export async function checkPhoneStatus(phoneRaw: string) {
  const phone = normalizePhone(phoneRaw);
  const user = await prisma.user.findUnique({ where: { phone }, select: { id: true } });
  return { registered: Boolean(user) };
}

export async function verifyCodeOnly(phoneRaw: string, code: string) {
  const phone = normalizePhone(phoneRaw);
  const valid = await checkOtp(phone, code);
  return { valid };
}

export async function loginWithPhone(phoneRaw: string, code: string) {
  const phone = normalizePhone(phoneRaw);
  try {
    await signIn("phone-otp", { phone, code, redirect: false });
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "Kod noto'g'ri yoki muddati o'tgan" };
  }
}

export async function registerTeacher(input: {
  phone: string;
  code: string;
  name: string;
  districtId: string;
  institutionId?: string;
  institutionName?: string;
  subjectId: string;
  qualificationCategory: QualificationCategory;
}) {
  const phone = normalizePhone(input.phone);
  const name = input.name.trim();
  const institutionName = input.institutionName?.trim();

  if (
    !name ||
    !input.districtId ||
    (!input.institutionId && !institutionName) ||
    !input.subjectId ||
    !input.qualificationCategory
  ) {
    throw new Error("Barcha maydonlarni to'ldiring");
  }

  const stillValid = await checkOtp(phone, input.code);
  if (!stillValid) {
    throw new Error("Kod muddati o'tgan, qaytadan yuboring");
  }

  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    throw new Error("Bu telefon raqami bilan hisob allaqachon ro'yxatdan o'tgan");
  }

  let institutionId = input.institutionId;
  if (!institutionId && institutionName) {
    const existingInstitution = await prisma.institution.findFirst({
      where: { districtId: input.districtId, name: { equals: institutionName, mode: "insensitive" } },
    });
    institutionId = existingInstitution
      ? existingInstitution.id
      : (await prisma.institution.create({ data: { name: institutionName, districtId: input.districtId } })).id;
  }

  await prisma.user.create({
    data: {
      name,
      phone,
      phoneVerifiedAt: new Date(),
      role: "TEACHER",
      institutionId,
      subjectId: input.subjectId,
      qualificationCategory: input.qualificationCategory,
    },
  });

  try {
    await signIn("phone-otp", { phone, code: input.code, redirect: false });
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "Ro'yxatdan o'tildi, lekin kirishda xatolik. Qaytadan kiring." };
  }
}
