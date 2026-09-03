import { requireRole } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";

export default async function AdminSubjectsPage() {
  await requireRole("ADMIN");

  const subjects = await prisma.subject.findMany({
    include: { _count: { select: { teachers: true, offerings: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          Fanlar ({subjects.length})
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Platformada ro&apos;yxatga olingan barcha fanlar
        </p>
      </div>

      <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white px-6 shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
        {subjects.map((s) => (
          <li key={s.id} className="flex items-center justify-between py-4">
            <span className="font-medium text-slate-800 dark:text-slate-200">{s.name}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {s._count.teachers} o&apos;qituvchi · {s._count.offerings} kurs
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
