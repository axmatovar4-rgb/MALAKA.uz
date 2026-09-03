"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/require-role";

export async function confirmReservation(formData: FormData) {
  await requireRole("ADMIN");
  const reservationId = formData.get("reservationId") as string;

  await prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.findUniqueOrThrow({
      where: { id: reservationId },
      include: { offering: true },
    });
    if (reservation.status !== "PENDING") {
      throw new Error("Bu so'rov allaqachon ko'rib chiqilgan");
    }

    const updated = await tx.courseOffering.updateMany({
      where: { id: reservation.offeringId, reservedCount: { lt: reservation.offering.capacity } },
      data: { reservedCount: { increment: 1 } },
    });
    if (updated.count === 0) {
      throw new Error("Bu oyda bo'sh joy qolmadi");
    }

    await tx.reservation.update({
      where: { id: reservationId },
      data: { status: "CONFIRMED", confirmedAt: new Date() },
    });
  }, { timeout: 15000, maxWait: 10000 });

  revalidatePath("/admin/reservations");
}

export async function cancelReservation(formData: FormData) {
  await requireRole("ADMIN");
  const reservationId = formData.get("reservationId") as string;

  await prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.findUniqueOrThrow({
      where: { id: reservationId },
    });
    if (reservation.status === "CANCELLED") return;

    if (reservation.status === "CONFIRMED") {
      await tx.courseOffering.update({
        where: { id: reservation.offeringId },
        data: { reservedCount: { decrement: 1 } },
      });
    }

    await tx.reservation.update({
      where: { id: reservationId },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    });
  }, { timeout: 15000, maxWait: 10000 });

  revalidatePath("/admin/reservations");
}
