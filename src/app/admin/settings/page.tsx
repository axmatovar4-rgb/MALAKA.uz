import { requireRole } from "@/lib/require-role";
import { ChangePasswordForm } from "@/components/admin/change-password-form";

export default async function AdminSettingsPage() {
  const user = await requireRole("ADMIN");

  return (
    <div className="mx-auto max-w-xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Sozlamalar</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Parolni o&apos;zgartirish</h2>
        <p className="mt-1 mb-5 text-sm text-slate-500 dark:text-slate-400">
          Xavfsizlik uchun standart parolni birinchi kirishdan so&apos;ng almashtiring.
        </p>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
