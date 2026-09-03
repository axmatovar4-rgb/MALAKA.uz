import { requireRole } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";
import { groupLabels } from "@/lib/qualification";

export default async function AdminCoursesPage() {
  await requireRole("ADMIN");

  const offerings = await prisma.courseOffering.findMany({
    include: { subject: true },
    orderBy: [{ subject: { name: "asc" } }, { startDate: "asc" }],
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          Kurslar ({offerings.length})
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Fan, guruh va oy bo&apos;yicha rejalashtirilgan barcha kurslar
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs text-slate-400 dark:border-slate-800">
              <th className="px-4 py-3 font-medium">Fan</th>
              <th className="px-4 py-3 font-medium">Guruh</th>
              <th className="px-4 py-3 font-medium">Oy</th>
              <th className="px-4 py-3 font-medium">Joylar</th>
              <th className="px-4 py-3 font-medium">Holat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {offerings.map((o) => {
              const full = o.reservedCount >= o.capacity;
              return (
                <tr key={o.id}>
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{o.subject.name}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{groupLabels[o.groupType]}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{o.monthLabel} {o.year}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{o.reservedCount} / {o.capacity}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        full
                          ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          : "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300"
                      }`}
                    >
                      {full ? "To'lgan" : "Faol"}
                    </span>
                  </td>
                </tr>
              );
            })}
            {offerings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">
                  Hozircha kurslar yo&apos;q.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
