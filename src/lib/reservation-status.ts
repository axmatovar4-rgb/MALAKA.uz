const COURSE_DURATION_DAYS = 31;

export function activeReservationCutoff(now: Date = new Date()): Date {
  return new Date(now.getTime() - COURSE_DURATION_DAYS * 24 * 60 * 60 * 1000);
}

export function isOfferingActive(startDate: Date, now: Date = new Date()): boolean {
  return startDate.getTime() > activeReservationCutoff(now).getTime();
}
