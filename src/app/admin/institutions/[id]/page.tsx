import { notFound } from "next/navigation";
import { requireRole } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";
import { categoryLabels } from "@/lib/qualification";
import { reassignDirector } from "../../actions";

export default async function InstitutionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN");
  const { id } = await params;

  const institution = await prisma.institution.findUnique({
    where: { id },
    include: {
      director: true,
      district: true,
      teachers: { include: { subject: true }, orderBy: { name: "asc" } },
    },
  });

  if (!institution) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-8">
      <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">{institution.name}</h1>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-2 text-base font-semibold text-slate-900 dark:text-slate-50">
          Tuman
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">{institution.district.name}</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-2 text-base font-semibold text-slate-900 dark:text-slate-50">
          Joriy direktor
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {institution.director
            ? `${institution.director.name} (${institution.director.email})`
            : "Tayinlanmagan"}
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-50">
          Direktorni almashtirish
        </h2>
        <form action={reassignDirector} className="grid grid-cols-2 gap-4">
          <input type="hidden" name="institutionId" value={institution.id} />
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Ism</label>
            <input
              name="directorName"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input
              name="directorEmail"
              type="email"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <div className="col-span-2 space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Vaqtinchalik parol
            </label>
            <input
              name="directorPassword"
              type="text"
              required
              minLength={6}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              Tayinlash
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-50">
          O&apos;qituvchilar ({institution.teachers.length})
        </h2>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {institution.teachers.map((teacher) => (
            <li key={teacher.id} className="py-2 text-sm text-slate-700 dark:text-slate-300">
              {teacher.name} · {teacher.subject?.name ?? "fan belgilanmagan"} ·{" "}
              {teacher.qualificationCategory
                ? categoryLabels[teacher.qualificationCategory]
                : "toifa belgilanmagan"}
            </li>
          ))}
          {institution.teachers.length === 0 && (
            <p className="py-4 text-sm text-slate-500 dark:text-slate-400">
              Hozircha o&apos;qituvchilar yo&apos;q.
            </p>
          )}
        </ul>
      </section>
    </div>
  );
}
