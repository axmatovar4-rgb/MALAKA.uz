import { requireRole } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";
import { categoryLabels, groupLabels } from "@/lib/qualification";
import { DonutChart } from "@/components/admin/charts";

export default async function AdminStatisticsPage() {
  await requireRole("ADMIN");

  const reservations = await prisma.reservation.findMany({
    where: { status: { not: "CANCELLED" } },
    include: {
      teacher: { include: { institution: { include: { district: true } } } },
      offering: true,
    },
  });

  const byDistrict = new Map<string, number>();
  const byCategory = new Map<string, number>();
  const byGroup = new Map<string, number>();

  for (const r of reservations) {
    const districtName = r.teacher.institution?.district.name ?? "Noma'lum";
    byDistrict.set(districtName, (byDistrict.get(districtName) ?? 0) + 1);

    const category = r.teacher.qualificationCategory;
    if (category) byCategory.set(category, (byCategory.get(category) ?? 0) + 1);

    byGroup.set(r.offering.groupType, (byGroup.get(r.offering.groupType) ?? 0) + 1);
  }

  const districtRows = Array.from(byDistrict.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Statistika</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Faol bandlovlar ({reservations.length} ta) kesimida real ma&apos;lumotlar
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-50">
            Guruh bo&apos;yicha
          </h2>
          <DonutChart
            centerLabel="Jami"
            centerValue={reservations.length}
            segments={[
              { label: groupLabels.RIVOJLANTIRUVCHI, value: byGroup.get("RIVOJLANTIRUVCHI") ?? 0, colorClass: "text-teal-500" },
              { label: groupLabels.YUKSALTIRUVCHI, value: byGroup.get("YUKSALTIRUVCHI") ?? 0, colorClass: "text-blue-500" },
            ]}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-50">
            Malaka toifasi bo&apos;yicha
          </h2>
          <DonutChart
            centerLabel="Jami"
            centerValue={reservations.length}
            segments={[
              { label: categoryLabels.MUTAXASSIS, value: byCategory.get("MUTAXASSIS") ?? 0, colorClass: "text-teal-500" },
              { label: categoryLabels.IKKINCHI_TOIFA, value: byCategory.get("IKKINCHI_TOIFA") ?? 0, colorClass: "text-emerald-400" },
              { label: categoryLabels.BIRINCHI_TOIFA, value: byCategory.get("BIRINCHI_TOIFA") ?? 0, colorClass: "text-blue-500" },
              { label: categoryLabels.OLIY_TOIFA, value: byCategory.get("OLIY_TOIFA") ?? 0, colorClass: "text-indigo-400" },
            ]}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-50">
          Tumanlar kesimida bandlovlar
        </h2>
        {districtRows.length > 0 ? (
          <ul className="space-y-3">
            {districtRows.map(([name, count]) => (
              <li key={name} className="flex items-center justify-between text-sm">
                <span className="text-slate-700 dark:text-slate-300">{name}</span>
                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                  {count}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-400">Hozircha ma&apos;lumot yo&apos;q.</p>
        )}
      </div>
    </div>
  );
}
