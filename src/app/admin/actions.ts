"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/require-role";
import { signOut } from "@/auth";

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}

export async function createInstitution(formData: FormData) {
  await requireRole("ADMIN");

  const institutionName = (formData.get("institutionName") as string).trim();
  const districtId = formData.get("districtId") as string;
  const directorName = (formData.get("directorName") as string).trim();
  const directorEmail = (formData.get("directorEmail") as string).trim().toLowerCase();
  const directorPassword = formData.get("directorPassword") as string;

  if (!institutionName || !districtId || !directorName || !directorEmail || !directorPassword) {
    throw new Error("Barcha maydonlarni to'ldiring");
  }

  const passwordHash = await bcrypt.hash(directorPassword, 10);

  const director = await prisma.user.create({
    data: {
      name: directorName,
      email: directorEmail,
      passwordHash,
      role: "DIRECTOR",
    },
  });
  await prisma.institution.create({
    data: { name: institutionName, districtId, directorId: director.id },
  });

  revalidatePath("/admin/schools");
}

// Bulk-create institutions from pasted text — one per line, formatted as
// "Tuman nomi, Muassasa nomi". No director is assigned here; admin adds
// directors per-institution afterwards. Institutions already existing
// (same name within the same district) are skipped, not duplicated.
export async function bulkImportInstitutions(text: string) {
  await requireRole("ADMIN");

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let created = 0;
  let skipped = 0;
  const notFound: string[] = [];

  for (const line of lines) {
    const [districtNameRaw, institutionNameRaw] = line.split(",");
    const districtName = districtNameRaw?.trim();
    const institutionName = institutionNameRaw?.trim();
    if (!districtName || !institutionName) {
      notFound.push(line);
      continue;
    }

    const district = await prisma.district.findFirst({
      where: { name: { equals: districtName, mode: "insensitive" } },
    });
    if (!district) {
      notFound.push(line);
      continue;
    }

    const existing = await prisma.institution.findFirst({
      where: {
        districtId: district.id,
        name: { equals: institutionName, mode: "insensitive" },
      },
    });
    if (existing) {
      skipped++;
      continue;
    }

    await prisma.institution.create({
      data: { name: institutionName, districtId: district.id },
    });
    created++;
  }

  revalidatePath("/admin/schools");
  return { created, skipped, notFound };
}

export async function reassignDirector(formData: FormData) {
  await requireRole("ADMIN");

  const institutionId = formData.get("institutionId") as string;
  const directorName = (formData.get("directorName") as string).trim();
  const directorEmail = (formData.get("directorEmail") as string).trim().toLowerCase();
  const directorPassword = formData.get("directorPassword") as string;

  if (!institutionId || !directorName || !directorEmail || !directorPassword) {
    throw new Error("Barcha maydonlarni to'ldiring");
  }

  const passwordHash = await bcrypt.hash(directorPassword, 10);

  const director = await prisma.user.create({
    data: {
      name: directorName,
      email: directorEmail,
      passwordHash,
      role: "DIRECTOR",
    },
  });

  await prisma.institution.update({
    where: { id: institutionId },
    data: { directorId: director.id },
  });

  revalidatePath(`/admin/institutions/${institutionId}`);
  revalidatePath("/admin/schools");
}
