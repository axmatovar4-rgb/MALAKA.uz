"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/require-role";

export async function submitReview(formData: FormData) {
  const teacher = await requireRole("TEACHER");

  const rating = Number(formData.get("rating"));
  const comment = (formData.get("comment") as string).trim();

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Baho 1 dan 5 gacha bo'lishi kerak");
  }
  if (!comment) {
    throw new Error("Fikringizni yozing");
  }

  await prisma.review.create({
    data: { teacherId: teacher.id, rating, comment },
  });

  revalidatePath("/teacher");
  revalidatePath("/");
}
