import Link from "next/link";
import { requireRole } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";
import { BottomNav } from "@/components/marketing/bottom-nav";
import { groupLabels } from "@/lib/qualification";
import { isOfferingActive } from "@/lib/reservation-status";

export default async function YutuqlarimPage() {
  const user = await requireRole("TEACHER");

  const teacher = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      subject: true,
      reservations: {
        where: { status: "CONFIRMED" },
        include: { offering: true },
        orderBy: { offering: { startDate: "desc" } },
      },
    },
  });

  const completed = (teacher?.reservations ?? []).filter(
    (r) => !isOfferingActive(r.offering.startDate),
  );

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
        <h1 className="text-base font-semibold text-slate-900 dark:text-slate-50">Yutuqlarim</h1>
      </header>

      <main className="mx-auto max-w-lg space-y-4 px-6 py-6">
        {completed.length > 0 ? (
          completed.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 21h8M12 17v4M7 4h10v3a5 5 0 01-10 0V4zM7 5H4v1a3 3 0 003 3M17 5h3v1a3 3 0 01-3 3" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {teacher?.subject?.name ?? "Malaka oshirish kursi"} — {groupLabels[r.offering.groupType]}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {r.offering.monthLabel} {r.offering.year} yilida yakunlandi
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Hozircha yakunlangan kurslaringiz yo&apos;q. Kurs yakunlangach,
              bu yerda avtomatik ko&apos;rinadi.
            </p>
          </div>
        )}

        <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          Sertifikat yuklab olish funksiyasi hali qo&apos;shilmagan — tez orada.
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
