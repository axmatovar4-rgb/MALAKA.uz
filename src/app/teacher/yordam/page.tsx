import Link from "next/link";
import { requireRole } from "@/lib/require-role";
import { BottomNav } from "@/components/marketing/bottom-nav";

export default async function YordamPage() {
  await requireRole("TEACHER");

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950 lg:pb-6">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <Link
          href="/teacher/menu"
          aria-label="Orqaga"
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-base font-semibold text-slate-900 dark:text-slate-50">Yordam</h1>
      </header>

      <main className="mx-auto max-w-lg space-y-4 px-6 py-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Savolingiz bormi?
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Joy band qilish, guruh yoki hisobingiz bo&apos;yicha savollaringiz
            bo&apos;lsa, quyidagi aloqa vositalari orqali murojaat qiling.
          </p>
        </section>

        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3 text-sm">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5.5C3 4.67 3.67 4 4.5 4h2.09c.5 0 .93.34 1.06.83l.9 3.34c.11.42-.03.87-.36 1.15l-1.3 1.1a12.7 12.7 0 006.15 6.15l1.1-1.3c.28-.33.73-.47 1.15-.36l3.34.9c.49.13.83.56.83 1.06V19.5c0 .83-.67 1.5-1.5 1.5C10.5 21 3 13.5 3 5.5z" />
              </svg>
            </span>
            <span className="text-slate-700 dark:text-slate-300">+998 71 000 00 00</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l9 6 9-6M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z" />
              </svg>
            </span>
            <span className="text-slate-700 dark:text-slate-300">info@malaka.uz</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21s7-6.5 7-11a7 7 0 10-14 0c0 4.5 7 11 7 11zm0-9a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </span>
            <span className="text-slate-700 dark:text-slate-300">
              Toshkent shahar, O&apos;zbekiston
            </span>
          </div>
        </section>

        <a
          href="#faq"
          className="block rounded-2xl border border-slate-200 bg-white p-5 text-sm font-medium text-teal-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-teal-400 dark:hover:bg-slate-800"
        >
          Ko&apos;p so&apos;raladigan savollarni ko&apos;rish →
        </a>
      </main>

      <BottomNav />
    </div>
  );
}
