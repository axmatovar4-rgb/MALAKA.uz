import Link from "next/link";
import { requireRole } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";
import { BottomNav } from "@/components/marketing/bottom-nav";
import { groupLabels } from "@/lib/qualification";
import { reservationStatusLabels, reservationStatusStyles } from "@/lib/reservation-status-labels";

export default async function ArizalarimPage() {
  const user = await requireRole("TEACHER");

  const reservations = await prisma.reservation.findMany({
    where: { teacherId: user.id },
    include: { offering: { include: { subject: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950 lg:pb-6">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <Link
          href="/teacher/menu"
          aria-label="Orqaga"
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-base font-semibold text-slate-900 dark:text-slate-50">Arizalarim</h1>
      </header>

      <main className="mx-auto max-w-lg space-y-4 px-6 py-6">
        {reservations.length > 0 ? (
          reservations.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {r.offering.subject.name} — {groupLabels[r.offering.groupType]}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {r.offering.monthLabel} {r.offering.year}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${reservationStatusStyles[r.status]}`}
              >
                {reservationStatusLabels[r.status]}
              </span>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Hozircha yuborilgan arizangiz yo&apos;q.
            </p>
            <Link
              href="/teacher/book"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-600 dark:text-teal-400"
            >
              Kursga yozilish →
            </Link>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
