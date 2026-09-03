import { requireRole } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";
import { groupLabels, groupDescriptions, groupForCategory, categoryLabels } from "@/lib/qualification";
import type { GroupType } from "@prisma/client";

export default async function AdminGroupsPage() {
  await requireRole("ADMIN");

  const teachers = await prisma.user.findMany({
    where: { role: "TEACHER" },
    select: { id: true, name: true, qualificationCategory: true, subject: { select: { name: true } } },
  });

  const offerings = await prisma.courseOffering.findMany({
    select: { groupType: true, capacity: true, reservedCount: true },
  });

  const buckets: Record<GroupType, typeof teachers> = {
    RIVOJLANTIRUVCHI: [],
    YUKSALTIRUVCHI: [],
  };
  const unassigned: typeof teachers = [];

  for (const t of teachers) {
    if (!t.qualificationCategory) {
      unassigned.push(t);
      continue;
    }
    buckets[groupForCategory(t.qualificationCategory)].push(t);
  }

  const groupTypes: GroupType[] = ["RIVOJLANTIRUVCHI", "YUKSALTIRUVCHI"];

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Guruhlar</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          O&apos;qituvchilar malaka toifasiga qarab avtomatik ikki guruhga taqsimlanadi.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {groupTypes.map((g) => {
          const members = buckets[g];
          const groupOfferings = offerings.filter((o) => o.groupType === g);
          const capacity = groupOfferings.reduce((s, o) => s + o.capacity, 0);
          const reserved = groupOfferings.reduce((s, o) => s + o.reservedCount, 0);

          return (
            <div
              key={g}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                {groupLabels[g]}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{groupDescriptions[g]}</p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{members.length}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Ro&apos;yxatdagi o&apos;qituvchi</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                    {reserved} / {capacity}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Band qilingan joy</p>
                </div>
              </div>

              <div className="mt-4 max-h-64 space-y-1 overflow-y-auto">
                {members.length === 0 && (
                  <p className="text-sm text-slate-400 dark:text-slate-500">Hozircha o&apos;qituvchi yo&apos;q.</p>
                )}
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <span className="text-slate-700 dark:text-slate-300">{m.name}</span>
                    <span className="text-xs text-slate-400">
                      {m.subject?.name ?? "—"} · {m.qualificationCategory ? categoryLabels[m.qualificationCategory] : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {unassigned.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
          {unassigned.length} ta o&apos;qituvchining malaka toifasi belgilanmagan, shuning uchun guruhga
          taqsimlanmagan.
        </div>
      )}
    </div>
  );
}
