import { requireRole } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";
import { TeacherHeader } from "@/components/teacher/teacher-header";
import { BottomNav } from "@/components/marketing/bottom-nav";
import { HashScroll } from "@/components/teacher/hash-scroll";
import { categoryLabels, groupDescriptions, groupForCategory, groupLabels } from "@/lib/qualification";
import { isOfferingActive } from "@/lib/reservation-status";
import { reservationStatusLabels, reservationStatusStyles } from "@/lib/reservation-status-labels";
import { submitReview } from "./actions";
import Link from "next/link";
import { redirect } from "next/navigation";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(date: Date) {
  return date.toLocaleDateString("uz-UZ", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function TeacherPage() {
  const user = await requireRole("TEACHER");

  const teacher = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      institution: { include: { district: true } },
      subject: true,
      reservations: {
        include: { offering: true },
        orderBy: { offering: { startDate: "desc" } },
      },
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!teacher) redirect("/api/force-logout");

  const activeReservation = teacher.reservations.find(
    (r) => r.status !== "CANCELLED" && isOfferingActive(r.offering.startDate),
  );
  const group = teacher.qualificationCategory
    ? groupForCategory(teacher.qualificationCategory)
    : null;

  // Reservation status changes (admin confirm/cancel) double as the
  // teacher's notification feed — no separate Notification table needed.
  // Older than this window just falls out of the list; the full history is
  // still visible in "Malaka oshirish tarixi" below.
  const NOTIFICATION_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
  const notificationCutoff = Date.now() - NOTIFICATION_WINDOW_MS;
  const subjectName = teacher.subject?.name ?? "Kurs";
  const notifications = teacher.reservations
    .flatMap((r) => {
      const course = `${subjectName} — ${r.offering.monthLabel} ${r.offering.year}`;
      if (r.status === "CONFIRMED" && r.confirmedAt && r.confirmedAt.getTime() > notificationCutoff) {
        return [
          {
            id: r.id,
            type: "confirmed" as const,
            text: `"${course}" kursiga joy band qilish so'rovingiz tasdiqlandi.`,
            date: r.confirmedAt.toISOString(),
          },
        ];
      }
      if (r.status === "CANCELLED" && r.cancelledAt && r.cancelledAt.getTime() > notificationCutoff) {
        return [
          {
            id: r.id,
            type: "cancelled" as const,
            text: `"${course}" kursiga bandlovingiz bekor qilindi.`,
            date: r.cancelledAt.toISOString(),
          },
        ];
      }
      return [];
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950 lg:pb-0">
      <HashScroll />
      <TeacherHeader userName={teacher.name} notifications={notifications} />

      <main className="mx-auto max-w-2xl space-y-5 px-6 py-6">
        {/* Profile header card */}
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-teal-400 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20 text-xl font-semibold backdrop-blur">
              {initials(teacher.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-bold uppercase tracking-wide">
                {teacher.name}
              </p>
              <p className="text-sm text-white/80">Pedagog</p>
              {teacher.phone && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-white/90">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5.5C3 4.67 3.67 4 4.5 4h2.09c.5 0 .93.34 1.06.83l.9 3.34c.11.42-.03.87-.36 1.15l-1.3 1.1a12.7 12.7 0 006.15 6.15l1.1-1.3c.28-.33.73-.47 1.15-.36l3.34.9c.49.13.83.56.83 1.06V19.5c0 .83-.67 1.5-1.5 1.5C10.5 21 3 13.5 3 5.5z" />
                  </svg>
                  {teacher.phone}
                </p>
              )}
            </div>
          </div>
          <Link
            href="/teacher/menu"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-white/90"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.86 4.49a1.5 1.5 0 012.12 2.12L7.5 18.09l-3 .75.75-3 11.6-11.35z" />
            </svg>
            Profilni tahrirlash
          </Link>
        </section>

        {/* Pedagogik ma'lumotlar */}
        <section id="pedagogik-malumotlar" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-blue-500">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0v7m-9-5v3.5c0 .34.16.66.44.85C5.06 21.4 8.3 23 12 23s6.94-1.6 8.56-2.65c.28-.19.44-.51.44-.85V14" />
            </svg>
            Pedagogik ma&apos;lumotlar
          </h2>
          <dl className="space-y-3 text-sm">
            {[
              ["Lavozimi", teacher.subject ? `${teacher.subject.name} o'qituvchisi` : "—"],
              ["Ta'lim muassasasi", teacher.institution?.name ?? "—"],
              ["Tuman", teacher.institution?.district.name ?? "—"],
              ["Ish staji", teacher.workExperienceYears != null ? `${teacher.workExperienceYears} yil` : "—"],
              ["Malaka toifasi", teacher.qualificationCategory ? categoryLabels[teacher.qualificationCategory] : "—"],
              ["Toifa olingan sana", teacher.categoryAwardedDate ? formatDate(teacher.categoryAwardedDate) : "—"],
              ["Keyingi attestatsiya", teacher.nextAttestationDate ? formatDate(teacher.nextAttestationDate) : "—"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Sizning guruhingiz */}
        {group && (
          <section
            id="guruh"
            className={`scroll-mt-24 rounded-3xl border p-6 ${
              group === "RIVOJLANTIRUVCHI"
                ? "border-teal-100 bg-teal-50 dark:border-teal-900 dark:bg-teal-950/40"
                : "border-blue-100 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Sizning guruhingiz
                </p>
                <p
                  className={`mt-1 text-xl font-bold ${
                    group === "RIVOJLANTIRUVCHI"
                      ? "text-teal-700 dark:text-teal-300"
                      : "text-blue-700 dark:text-blue-300"
                  }`}
                >
                  {groupLabels[group]}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {groupDescriptions[group]}
                </p>
              </div>
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                  group === "RIVOJLANTIRUVCHI" ? "bg-teal-100 dark:bg-teal-900" : "bg-blue-100 dark:bg-blue-900"
                }`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={group === "RIVOJLANTIRUVCHI" ? "h-6 w-6 text-teal-600 dark:text-teal-300" : "h-6 w-6 text-blue-600 dark:text-blue-300"}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-6a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              </div>
            </div>
            {activeReservation && activeReservation.status === "CONFIRMED" && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                Guruhda tasdiqlangan joylar: {activeReservation.offering.reservedCount} / {activeReservation.offering.capacity}
              </p>
            )}
          </section>
        )}

        {/* Faol bandlovingiz */}
        {activeReservation ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-50">
              Faol bandlovingiz
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Fan</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">{teacher.subject?.name ?? "—"}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Guruh</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">{group ? groupLabels[group] : "—"}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Kurs oyi</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">
                  {activeReservation.offering.monthLabel} {activeReservation.offering.year}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Boshlanish sanasi</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">
                  1-{activeReservation.offering.monthLabel}, {activeReservation.offering.year}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Holat</dt>
                <dd>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${reservationStatusStyles[activeReservation.status]}`}
                  >
                    {reservationStatusLabels[activeReservation.status]}
                  </span>
                </dd>
              </div>
            </dl>
          </section>
        ) : (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
              Tezkor amal
            </h2>
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              Malaka oshirish kursi uchun joyingizni hali band qilmagansiz.
            </p>
            <Link
              href="/teacher/book"
              className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
            >
              Joy band qilish
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </section>
        )}

        {/* Aloqa ma'lumotlari */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-50">
            Aloqa ma&apos;lumotlari
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Telefon raqami</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">{teacher.phone ?? "—"}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Email</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">{teacher.email}</dd>
            </div>
          </dl>
        </section>

        {/* Malaka oshirish tarixi */}
        <section id="tarix" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-50">
            Malaka oshirish tarixi
          </h2>
          {teacher.reservations.length > 0 ? (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {teacher.reservations.map((reservation) => (
                <li key={reservation.id} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-slate-700 dark:text-slate-300">
                    {reservation.offering.monthLabel} {reservation.offering.year}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${reservationStatusStyles[reservation.status]}`}
                  >
                    {reservationStatusLabels[reservation.status]}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Hozircha malaka oshirish tarixingiz yo&apos;q.
            </p>
          )}
        </section>

        {/* Review */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-50">
            Platforma haqida fikringiz
          </h2>
          <form action={submitReview} className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Baho</label>
              <select
                name="rating"
                required
                defaultValue=""
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="" disabled>
                  Bahoni tanlang
                </option>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {"★".repeat(n)}
                    {"☆".repeat(5 - n)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Fikringiz</label>
              <textarea
                name="comment"
                required
                rows={3}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
            <button
              type="submit"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
            >
              Yuborish
            </button>
          </form>

          {teacher.reviews.length > 0 && (
            <div className="mt-6 space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Sizning oldingi fikrlaringiz
              </p>
              {teacher.reviews.map((review) => (
                <div key={review.id} className="rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-800">
                  <p className="text-amber-500">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </p>
                  <p className="mt-1 text-slate-600 dark:text-slate-300">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
