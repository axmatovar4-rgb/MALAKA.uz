import type { ReservationStatus } from "@prisma/client";

export const reservationStatusLabels: Record<ReservationStatus, string> = {
  PENDING: "Kutilmoqda",
  CONFIRMED: "Tasdiqlangan",
  CANCELLED: "Bekor qilingan",
};

export const reservationStatusStyles: Record<ReservationStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  CONFIRMED: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  CANCELLED: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
};
