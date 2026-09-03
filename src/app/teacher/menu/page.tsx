import Link from "next/link";
import { requireRole } from "@/lib/require-role";
import { signOut } from "@/auth";
import { BottomNav } from "@/components/marketing/bottom-nav";

const icons = {
  trophy: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 21h8M12 17v4M7 4h10v3a5 5 0 01-10 0V4zM7 5H4v1a3 3 0 003 3M17 5h3v1a3 3 0 01-3 3" />
  ),
  graduation: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3L2 8l10 5 10-5-10-5zM6 12.18v3.6c0 .27.14.52.37.65C7.5 17.1 9.6 18 12 18s4.5-.9 5.63-1.57c.23-.13.37-.38.37-.65v-3.6" />
  ),
  calendarPlus: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a1 1 0 001-1V7a1 1 0 00-1-1H5a1 1 0 00-1 1v13a1 1 0 001 1zm7-8v6m-3-3h6" />
  ),
  people: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-6a4 4 0 100 8 4 4 0 000-8z" />
  ),
  calendarCheck: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a1 1 0 001-1V7a1 1 0 00-1-1H5a1 1 0 00-1 1v13a1 1 0 001 1zm3.5-6.5l1.5 1.5 3-3" />
  ),
  idCard: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1zm3 5a2 2 0 100-4 2 2 0 000 4zm-3 5c.5-2 2.5-3 3-3s2.5 1 3 3m5-6h6m-6 3h4" />
  ),
  clock: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
  document: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1zM14 3v5h5" />
  ),
  help: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.5 9a2.5 2.5 0 115 0c0 1.5-2.5 1.75-2.5 3.5M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
  logout: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m4 8H5a2 2 0 01-2-2V6a2 2 0 012-2h6" />
  ),
};

function MenuRow({
  icon,
  title,
  subtitle,
  href,
  comingSoon,
  tone,
}: {
  icon: keyof typeof icons;
  title: string;
  subtitle: string;
  href?: string;
  comingSoon?: boolean;
  tone?: "danger";
}) {
  const content = (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          tone === "danger"
            ? "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
            : "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400"
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
          {icons[icon]}
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-semibold ${
            tone === "danger" ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-slate-50"
          }`}
        >
          {title}
        </p>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
      {comingSoon ? (
        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          Tez orada
        </span>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 shrink-0 text-slate-400">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6l6 6-6 6" />
        </svg>
      )}
    </div>
  );

  if (comingSoon || !href) {
    return <div className="opacity-90">{content}</div>;
  }

  return <Link href={href}>{content}</Link>;
}

export default async function TeacherMenuPage() {
  const user = await requireRole("TEACHER");

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950 lg:pb-6">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <Link
          href="/teacher"
          aria-label="Orqaga"
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-base font-semibold text-slate-900 dark:text-slate-50">
          Profil menyusi
        </h1>
      </header>

      <main className="mx-auto max-w-lg space-y-3 px-6 py-6">
        <MenuRow icon="trophy" title="Yutuqlarim" subtitle="Yakunlagan kurslaringiz" href="/teacher/yutuqlarim" />
        <MenuRow icon="graduation" title="Kurslarim" subtitle="Tanlangan va yakunlangan kurslarim" href="/teacher#tarix" />
        <MenuRow icon="calendarPlus" title="Kursga yozilish" subtitle="Malaka oshirish kursi oyini tanlang" href="/teacher/book" />
        <MenuRow icon="people" title="Guruhim" subtitle="Rivojlantiruvchi yoki Yuksaltiruvchi guruhim" href="/teacher#guruh" />
        <MenuRow icon="calendarCheck" title="Bandlovlarim" subtitle="Band qilgan kurs oyi va holatlari" href="/teacher#tarix" />
        <MenuRow icon="idCard" title="Pedagogik ma'lumotlar" subtitle="Maktab, fan, toifa va boshqa ma'lumotlar" href="/teacher#pedagogik-malumotlar" />
        <MenuRow icon="clock" title="Kurs tarixi" subtitle="Oldingi malaka oshirish kurslari" href="/teacher#tarix" />
        <MenuRow icon="document" title="Hujjatlarim" subtitle="Yuklangan hujjatlar va sertifikatlar" comingSoon />
        <MenuRow icon="document" title="Arizalarim" subtitle="Yuborilgan arizalar va ularning holati" comingSoon />
        <MenuRow icon="help" title="Yordam" subtitle="Yordam va qo'llab-quvvatlash" href="/teacher/yordam" />

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button type="submit" className="w-full text-left">
            <MenuRow icon="logout" title="Tizimdan chiqish" subtitle="Hisobingizdan chiqish" tone="danger" />
          </button>
        </form>

        <p className="pt-2 text-center text-xs text-slate-400">{user.name}</p>
      </main>

      <BottomNav />
    </div>
  );
}
