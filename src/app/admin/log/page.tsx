import { requireRole } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";

type LogEvent = {
  timestamp: Date;
  text: string;
  tone: "neutral" | "positive" | "negative";
};

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("uz-UZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default async function AdminLogPage() {
  await requireRole("ADMIN");

  const [teachers, reservations] = await Promise.all([
    prisma.user.findMany({
      where: { role: "TEACHER" },
      select: { name: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.reservation.findMany({
      select: {
        createdAt: true,
        confirmedAt: true,
        cancelledAt: true,
        teacher: { select: { name: true } },
        offering: { select: { monthLabel: true, year: true, subject: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  const events: LogEvent[] = [];

  for (const t of teachers) {
    events.push({
      timestamp: t.createdAt,
      text: `${t.name} ro'yxatdan o'tdi`,
      tone: "neutral",
    });
  }

  for (const r of reservations) {
    const course = `${r.offering.subject.name} — ${r.offering.monthLabel} ${r.offering.year}`;
    events.push({
      timestamp: r.createdAt,
      text: `${r.teacher.name} "${course}" kursiga joy band qildi (kutilmoqda)`,
      tone: "neutral",
    });
    if (r.confirmedAt) {
      events.push({
        timestamp: r.confirmedAt,
        text: `${r.teacher.name} ning "${course}" bandi tasdiqlandi`,
        tone: "positive",
      });
    }
    if (r.cancelledAt) {
      events.push({
        timestamp: r.cancelledAt,
        text: `${r.teacher.name} ning "${course}" bandi bekor qilindi`,
        tone: "negative",
      });
    }
  }

  events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  const recent = events.slice(0, 150);

  const toneDot: Record<LogEvent["tone"], string> = {
    neutral: "bg-slate-300 dark:bg-slate-600",
    positive: "bg-teal-500",
    negative: "bg-red-500",
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Tizim jurnali</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Ro&apos;yxatdan o&apos;tish va bandlovlar bo&apos;yicha so&apos;nggi harakatlar
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {recent.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Hozircha hech qanday harakat qayd etilmagan.
          </p>
        )}
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {recent.map((e, i) => (
            <li key={i} className="flex items-start gap-3 px-4 py-3">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${toneDot[e.tone]}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-700 dark:text-slate-300">{e.text}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{formatDate(e.timestamp)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
