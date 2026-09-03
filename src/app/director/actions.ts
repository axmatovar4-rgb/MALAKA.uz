"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/require-role";
import type { QualificationCategory } from "@prisma/client";

export async function addTeacher(formData: FormData) {
  const director = await requireRole("DIRECTOR");

  const institution = await prisma.institution.findUnique({
    where: { directorId: director.id },
  });
  if (!institution) throw new Error("Sizga muassasa biriktirilmagan");

  const name = (formData.get("name") as string).trim();
  const email = (formData.get("email") as string).trim().toLowerCase();
  const password = formData.get("password") as string;
  const phone = (formData.get("phone") as string).trim();
  const subjectId = formData.get("subjectId") as string;
  const qualificationCategory = formData.get("qualificationCategory") as QualificationCategory;
  const workExperienceYearsRaw = (formData.get("workExperienceYears") as string).trim();
  const categoryAwardedDateRaw = (formData.get("categoryAwardedDate") as string).trim();
  const nextAttestationDateRaw = (formData.get("nextAttestationDate") as string).trim();

  if (!name || !email || !password || !phone || !subjectId || !qualificationCategory) {
    throw new Error("Barcha maydonlarni to'ldiring");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "TEACHER",
        phone,
        subjectId,
        qualificationCategory,
        institutionId: institution.id,
        workExperienceYears: workExperienceYearsRaw ? Number(workExperienceYearsRaw) : null,
        categoryAwardedDate: categoryAwardedDateRaw ? new Date(categoryAwardedDateRaw) : null,
        nextAttestationDate: nextAttestationDateRaw ? new Date(nextAttestationDateRaw) : null,
      },
    });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      throw new Error("Bu email yoki telefon raqami bilan hisob allaqachon mavjud");
    }
    throw error;
  }

  revalidatePath("/director");
}
