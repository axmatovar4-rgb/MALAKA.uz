import Link from "next/link";
import { requireRole } from "@/lib/require-role";
import { BottomNav } from "@/components/marketing/bottom-nav";

const checklist = [
  "Pasport nusxasi",
  "Diplom nusxasi",
  "Joriy malaka toifasi haqidagi guvohnoma (mavjud bo'lsa)",
  "Ish stajini tasdiqlovchi ma'lumotnoma",
  "3x4 o'lchamdagi fotosurat",
];

export default async function HujjatlarimPage() {
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
        <h1 className="text-base font-semibold text-slate-900 dark:text-slate-50">Hujjatlarim</h1>
      </header>

      <main className="mx-auto max-w-lg space-y-4 px-6 py-6">
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          Hujjatlarni saytga yuklab qo&apos;yish funksiyasi hali qo&apos;shilmagan — tez orada.
          Hozircha kursga borishdan oldin quyidagi hujjatlarni o&apos;zingiz bilan olib boring.
          Aniq ro&apos;yxatni muassasangiz ma&apos;muriyatidan tasdiqlab oling.
        </p>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-50">
            Odatda kerak bo&apos;ladigan hujjatlar
          </p>
          <ul className="space-y-2.5">
            {checklist.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="mt-0.5 h-4 w-4 shrink-0 text-teal-500"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
