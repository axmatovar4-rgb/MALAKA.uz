import { requireRole } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";
import { categoryLabels } from "@/lib/qualification";

const roleLabels: Record<string, string> = {
  ADMIN: "Admin",
  DIRECTOR: "Direktor",
  TEACHER: "O'qituvchi",
};

export default async function AdminUsersPage() {
  await requireRole("ADMIN");

  const users = await prisma.user.findMany({
    include: { institution: { include: { district: true } }, subject: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          Foydalanuvchilar ({users.length})
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Tizimdagi barcha hisoblar — admin, direktor va o&apos;qituvchilar
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs text-slate-400 dark:border-slate-800">
              <th className="px-4 py-3 font-medium">Ism</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Muassasa</th>
              <th className="px-4 py-3 font-medium">Fan / Toifa</th>
              <th className="px-4 py-3 font-medium">Aloqa</th>
              <th className="px-4 py-3 font-medium">Ro&apos;yxatdan o&apos;tgan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{u.name}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{roleLabels[u.role]}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                  {u.institution ? `${u.institution.name} (${u.institution.district.name})` : "—"}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                  {u.subject?.name ?? "—"}
                  {u.qualificationCategory ? ` · ${categoryLabels[u.qualificationCategory]}` : ""}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{u.phone ?? u.email ?? "—"}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {u.createdAt.toLocaleDateString("uz-UZ")}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">
                  Hozircha foydalanuvchilar yo&apos;q.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
