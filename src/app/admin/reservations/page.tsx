import { requireRole } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";
import { categoryLabels, groupForCategory, groupLabels } from "@/lib/qualification";
import { reservationStatusLabels, reservationStatusStyles } from "@/lib/reservation-status-labels";
import { confirmReservation, cancelReservation } from "../reservation-actions";

export default async function AdminReservationsPage() {
  await requireRole("ADMIN");

  const reservations = await prisma.reservation.findMany({
    include: {
      teacher: { include: { institution: { include: { district: true } }, subject: true } },
      offering: true,
    },
    orderBy: [{ status: "asc" }, { createdAt: "asc" }],
  });

  const pending = reservations.filter((r) => r.status === "PENDING");
  const resolved = reservations.filter((r) => r.status !== "PENDING");

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Bandlovlar</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          O&apos;qituvchilarning joy band qilish so&apos;rovlarini ko&apos;rib chiqing
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-50">
          Kutilayotgan so&apos;rovlar ({pending.length})
        </h2>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {pending.map((r) => {
            const group = r.teacher.qualificationCategory
              ? groupForCategory(r.teacher.qualificationCategory)
              : null;
            return (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">{r.teacher.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {r.teacher.subject?.name ?? "—"} ·{" "}
                    {r.teacher.qualificationCategory ? categoryLabels[r.teacher.qualificationCategory] : "—"} ·{" "}
                    {group ? groupLabels[group] : "—"}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {r.teacher.institution?.name ?? "—"} ({r.teacher.institution?.district.name ?? "—"}) ·{" "}
                    {r.offering.monthLabel} {r.offering.year} ({r.offering.reservedCount}/{r.offering.capacity})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <form action={confirmReservation}>
                    <input type="hidden" name="reservationId" value={r.id} />
                    <button
                      type="submit"
                      className="rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                    >
                      Tasdiqlash
                    </button>
                  </form>
                  <form action={cancelReservation}>
                    <input type="hidden" name="reservationId" value={r.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Bekor qilish
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
          {pending.length === 0 && (
            <p className="py-4 text-sm text-slate-500 dark:text-slate-400">Hozircha kutilayotgan so&apos;rovlar yo&apos;q.</p>
          )}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-50">
          Ko&apos;rib chiqilganlar ({resolved.length})
        </h2>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {resolved.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-4 py-3 text-sm">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-50">{r.teacher.name}</p>
                <p className="text-slate-500 dark:text-slate-400">
                  {r.teacher.subject?.name ?? "—"} · {r.offering.monthLabel} {r.offering.year}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${reservationStatusStyles[r.status]}`}>
                {reservationStatusLabels[r.status]}
              </span>
            </li>
          ))}
          {resolved.length === 0 && (
            <p className="py-4 text-sm text-slate-500 dark:text-slate-400">Hozircha ko&apos;rib chiqilgan so&apos;rovlar yo&apos;q.</p>
          )}
        </ul>
      </section>
    </div>
  );
}
