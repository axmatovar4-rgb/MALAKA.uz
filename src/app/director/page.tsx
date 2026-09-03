import { requireRole } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";
import { TopBar } from "@/components/top-bar";
import { categoryLabels } from "@/lib/qualification";
import { addTeacher } from "./actions";

export default async function DirectorPage() {
  const user = await requireRole("DIRECTOR");

  const [institution, subjects] = await Promise.all([
    prisma.institution.findUnique({
      where: { directorId: user.id },
      include: {
        teachers: { include: { subject: true }, orderBy: { createdAt: "desc" } },
      },
    }),
    prisma.subject.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TopBar title={institution?.name ?? "Muassasa"} userName={user.name} />

      <main className="mx-auto max-w-3xl space-y-8 px-6 py-8">
        {!institution ? (
          <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            Sizga hali muassasa biriktirilmagan. Admin bilan bog&apos;laning.
          </p>
        ) : (
          <>
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-50">
                O&apos;qituvchi qo&apos;shish
              </h2>
              <form action={addTeacher} className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Ism</label>
                  <input
                    name="name"
                    required
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Telefon raqami
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="+998 90 123 45 67"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Fan</label>
                  <select
                    name="subjectId"
                    required
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="">Fanni tanlang</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Malaka toifasi
                  </label>
                  <select
                    name="qualificationCategory"
                    required
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="">Toifani tanlang</option>
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Ish staji (yil) — ixtiyoriy
                  </label>
                  <input
                    name="workExperienceYears"
                    type="number"
                    min={0}
                    max={60}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Toifa olingan sana — ixtiyoriy
                  </label>
                  <input
                    name="categoryAwardedDate"
                    type="date"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Keyingi attestatsiya sanasi — ixtiyoriy
                  </label>
                  <input
                    name="nextAttestationDate"
                    type="date"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Vaqtinchalik parol
                  </label>
                  <input
                    name="password"
                    type="text"
                    required
                    minLength={6}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="col-span-2">
                  <button
                    type="submit"
                    className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                  >
                    Qo&apos;shish
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
          </>
        )}
      </main>
    </div>
  );
}
