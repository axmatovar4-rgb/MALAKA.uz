"use server";

import { prisma } from "@/lib/prisma";
import { groupForCategory, groupLabels } from "@/lib/qualification";
import { ReservationError } from "@/lib/reservation-errors";
import { activeReservationCutoff } from "@/lib/reservation-status";
import { requireRole } from "@/lib/require-role";
import type { GroupType } from "@prisma/client";

export async function getRegions() {
  return prisma.region.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function getDistricts(regionId: string) {
  return prisma.district.findMany({
    where: { regionId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function getInstitutions(districtId: string) {
  return prisma.institution.findMany({
    where: { districtId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function getAllSubjects() {
  return prisma.subject.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function getOfferings(subjectId: string, groupType: GroupType) {
  const offerings = await prisma.courseOffering.findMany({
    where: { subjectId, groupType },
    orderBy: { startDate: "asc" },
    take: 6,
  });
  return offerings.map((o) => ({
    id: o.id,
    monthLabel: o.monthLabel,
    year: o.year,
    startDate: o.startDate.toISOString(),
    capacity: o.capacity,
    reservedCount: o.reservedCount,
    available: o.capacity - o.reservedCount,
  }));
}

// Each district gets at most this many accepted/pending seats per course
// offering, so one district can't fill an entire month's capacity and shut
// out teachers from elsewhere.
const MAX_RESERVATIONS_PER_DISTRICT = 3;

// A reservation only occupies a seat once an admin confirms it, so
// reservedCount deliberately does NOT change here — only in
// admin/reservation-actions.ts's confirmReservation.
export async function createReservation(offeringId: string) {
  const user = await requireRole("TEACHER");

  const teacher = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      reservations: {
        where: { status: { not: "CANCELLED" } },
        select: { id: true, offering: { select: { startDate: true } } },
      },
      institution: { select: { districtId: true } },
    },
  });
  if (!teacher) throw new ReservationError("O'qituvchi topilmadi");

  const cutoff = activeReservationCutoff();
  const hasActiveReservation = teacher.reservations.some(
    (r) => r.offering.startDate.getTime() > cutoff.getTime(),
  );
  if (hasActiveReservation) {
    throw new ReservationError("Sizda allaqachon faol bandlov mavjud");
  }

  try {
    const offering = await prisma.courseOffering.findUniqueOrThrow({
      where: { id: offeringId },
    });
    if (offering.reservedCount >= offering.capacity) {
      throw new ReservationError("Bu oyda bo'sh joy qolmadi");
    }

    const districtId = teacher.institution?.districtId;
    if (districtId) {
      const districtCount = await prisma.reservation.count({
        where: {
          offeringId,
          status: { not: "CANCELLED" },
          teacher: { institution: { districtId } },
        },
      });
      if (districtCount >= MAX_RESERVATIONS_PER_DISTRICT) {
        throw new ReservationError(
          `Bu oy uchun tumaningizdan allaqachon ${MAX_RESERVATIONS_PER_DISTRICT} ta o'qituvchi joy band qilgan`,
        );
      }
    }

    const reservation = await prisma.reservation.create({
      data: { teacherId: user.id, offeringId, status: "PENDING", smsSentAt: new Date() },
      include: {
        teacher: {
          include: {
            institution: { include: { district: true } },
            subject: true,
          },
        },
        offering: { include: { subject: true } },
      },
    });

    // No SMS provider is configured yet — this only logs and timestamps the
    // notification instead of dispatching a real text message.
    console.log(
      `[SMS mock] Malaka.uz: Hurmatli ${reservation.teacher.name}, joy band qilish so'rovingiz qabul qilindi. Holati: Kutilmoqda. Guruh: ${
        reservation.teacher.qualificationCategory
          ? groupLabels[groupForCategory(reservation.teacher.qualificationCategory)]
          : ""
      }. Kurs oyi: ${reservation.offering.monthLabel} ${reservation.offering.year}.`,
    );

    return {
      id: reservation.id,
      teacherName: reservation.teacher.name,
      district: reservation.teacher.institution?.district.name ?? "",
      institution: reservation.teacher.institution?.name ?? "",
      subject: reservation.teacher.subject?.name ?? "",
      qualificationCategory: reservation.teacher.qualificationCategory,
      groupType: reservation.teacher.qualificationCategory
        ? groupForCategory(reservation.teacher.qualificationCategory)
        : null,
      monthLabel: reservation.offering.monthLabel,
      year: reservation.offering.year,
      startDate: reservation.offering.startDate.toISOString(),
      status: reservation.status,
    };
  } catch (error) {
    if (error instanceof ReservationError) throw error;
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      throw new ReservationError("Siz ushbu oy uchun allaqachon so'rov yuborgansiz");
    }
    throw error;
  }
}
