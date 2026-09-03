import Link from "next/link";
import { requireRole } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";
import { CreateInstitutionForm } from "@/components/admin/create-institution-form";
import { BulkImportInstitutionsForm } from "@/components/admin/bulk-import-institutions-form";

export default async function AdminSchoolsPage() {
  await requireRole("ADMIN");

  const [institutions, regions] = await Promise.all([
    prisma.institution.findMany({
      include: { director: true, teachers: true, district: { include: { region: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.region.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-6 py-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Maktablar</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Ta&apos;lim muassasalarini va direktorlarini boshqaring
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-50">
          Yangi ta&apos;lim muassasasi yaratish
        </h2>
        <CreateInstitutionForm regions={regions} />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-50">
          Ommaviy import
        </h2>
        <BulkImportInstitutionsForm />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-50">
          Ta&apos;lim muassasalari ({institutions.length})
        </h2>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {institutions.map((institution) => (
            <li key={institution.id} className="flex items-center justify-between py-3">
              <div>
                <Link
                  href={`/admin/institutions/${institution.id}`}
                  className="font-medium text-slate-900 hover:underline dark:text-slate-50"
                >
                  {institution.name}
                </Link>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {institution.district.name}
                  {institution.district.region ? ` (${institution.district.region.name})` : ""} · Direktor:{" "}
                  {institution.director?.name ?? "tayinlanmagan"} ·{" "}
                  {institution.teachers.length} o&apos;qituvchi
                </p>
              </div>
            </li>
          ))}
          {institutions.length === 0 && (
            <p className="py-4 text-sm text-slate-500 dark:text-slate-400">
              Hozircha muassasalar yo&apos;q.
            </p>
          )}
        </ul>
      </section>
    </div>
  );
}
