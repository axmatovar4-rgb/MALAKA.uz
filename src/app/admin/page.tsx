import Link from "next/link";
import { requireRole } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";
import { LineChart, DonutChart } from "@/components/admin/charts";
import { reservationStatusLabels } from "@/lib/reservation-status-labels";

const MONTH_NAMES = [
  "Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek",
];

function monthsAgo(n: number) {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - n);
  return d;
}

function trendLabel(current: number, previous: number) {
  if (previous === 0) return current > 0 ? { text: "Yangi", positive: true } : null;
  const pct = ((current - previous) / previous) * 100;
  return { text: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`, positive: pct >= 0 };
}

export default async function AdminDashboardPage() {
  await requireRole("ADMIN");

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    teacherCount,
    teacherCountBefore,
    offeringCount,
    activeReservationCount,
    activeReservationCountBefore,
    subjectGroupPairs,
    teacherCreatedDates,
    recentReservations,
    recentTeachers,
    recentReviews,
    statusCounts,
    subjectsWithOfferings,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.user.count({ where: { role: "TEACHER", createdAt: { lt: thirtyDaysAgo } } }),
    prisma.courseOffering.count(),
    prisma.reservation.count({ where: { status: { not: "CANCELLED" } } }),
    prisma.reservation.count({ where: { status: { not: "CANCELLED" }, createdAt: { lt: thirtyDaysAgo } } }),
    prisma.courseOffering.findMany({ select: { subjectId: true, groupType: true }, distinct: ["subjectId", "groupType"] }),
    prisma.user.findMany({ where: { role: "TEACHER" }, select: { createdAt: true } }),
    prisma.reservation.findMany({
      include: { teacher: true, offering: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.user.findMany({
      where: { role: "TEACHER" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, createdAt: true },
    }),
    prisma.review.findMany({
      include: { teacher: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.reservation.groupBy({ by: ["status"], _count: true }),
    prisma.subject.findMany({
      include: {
        offerings: { include: { reservations: { where: { status: { not: "CANCELLED" } } } } },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const teacherTrend = trendLabel(teacherCount, teacherCountBefore);
  const reservationTrend = trendLabel(activeReservationCount, activeReservationCountBefore);

  const growthBuckets = Array.from({ length: 6 }).map((_, i) => {
    const bucketStart = monthsAgo(5 - i);
    const bucketEnd = monthsAgo(4 - i);
    const count = teacherCreatedDates.filter(
      (t) => t.createdAt >= bucketStart && t.createdAt < bucketEnd,
    ).length;
    return { label: MONTH_NAMES[bucketStart.getMonth()], value: count };
  });
  // Cumulative total so the chart reads as growth, not per-month signups.
  let running = teacherCreatedDates.filter((t) => t.createdAt < monthsAgo(5)).length;
  const growthPoints = growthBuckets.map((b) => {
    running += b.value;
    return { label: b.label, value: running };
  });

  const activity = [
    ...recentReservations.map((r) => ({
      key: `res-${r.id}`,
      text: `${r.teacher.name} kursga band qildi: ${r.offering.monthLabel} ${r.offering.year}`,
      date: r.createdAt,
      colorClass: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300",
      icon: "calendar" as const,
    })),
    ...recentTeachers.map((t) => ({
      key: `user-${t.id}`,
      text: `Yangi foydalanuvchi ro'yxatdan o'tdi: ${t.name}`,
      date: t.createdAt,
      colorClass: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
      icon: "user" as const,
    })),
    ...recentReviews.map((r) => ({
      key: `review-${r.id}`,
      text: `${r.teacher.name} platformaga fikr qoldirdi (${r.rating}★)`,
      date: r.createdAt,
      colorClass: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300",
      icon: "star" as const,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 6);

  const statusMap: Record<string, number> = {};
  for (const s of statusCounts) statusMap[s.status] = s._count;

  const courseRows = subjectsWithOfferings
    .map((s) => ({
      id: s.id,
      name: s.name,
      groupCount: new Set(s.offerings.map((o) => o.groupType)).size,
      reservationCount: s.offerings.reduce((sum, o) => sum + o.reservations.length, 0),
    }))
    .sort((a, b) => b.reservationCount - a.reservationCount)
    .slice(0, 5);

  const stats = [
    {
      key: "users",
      label: "Jami foydalanuvchilar",
      value: teacherCount,
      trend: teacherTrend,
      colorClass: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-6a4 4 0 100 8 4 4 0 000-8z" />
      ),
    },
    {
      key: "courses",
      label: "Faol kurslar",
      value: offeringCount,
      trend: null,
      colorClass: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V4H6.5A2.5 2.5 0 004 6.5v13z" />
      ),
    },
    {
      key: "groups",
      label: "Faol guruhlar",
      value: subjectGroupPairs.length,
      trend: null,
      colorClass: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-6a4 4 0 100 8 4 4 0 000-8z" />
      ),
    },
    {
      key: "reservations",
      label: "Faol bandlovlar",
      value: activeReservationCount,
      trend: reservationTrend,
      colorClass: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a1 1 0 001-1V7a1 1 0 00-1-1H5a1 1 0 00-1 1v13a1 1 0 001 1z" />
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Bosh sahifa</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.key} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.colorClass}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                  {s.icon}
                </svg>
              </span>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-50">{s.value.toLocaleString("uz-UZ")}</p>
              </div>
            </div>
            {s.trend && (
              <p className={`mt-3 text-xs font-medium ${s.trend.positive ? "text-teal-600" : "text-red-600"}`}>
                {s.trend.positive ? "↑" : "↓"} {s.trend.text}{" "}
                <span className="font-normal text-slate-400">o&apos;tgan oyga nisbatan</span>
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-50">
            Foydalanuvchilar dinamikasi (so&apos;nggi 6 oy)
          </h2>
          {teacherCount > 0 ? (
            <LineChart points={growthPoints} />
          ) : (
            <p className="py-16 text-center text-sm text-slate-400">
              Hozircha statistika uchun yetarli ma&apos;lumot yo&apos;q.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-50">
            So&apos;nggi faoliyatlar
          </h2>
          {activity.length > 0 ? (
            <ul className="space-y-4">
              {activity.map((a) => (
                <li key={a.key} className="flex items-start gap-3 text-sm">
                  <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${a.colorClass}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-3.5 w-3.5">
                      {a.icon === "calendar" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a1 1 0 001-1V7a1 1 0 00-1-1H5a1 1 0 00-1 1v13a1 1 0 001 1z" />}
                      {a.icon === "user" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14a4 4 0 100-8 4 4 0 000 8zm-7 7a7 7 0 0114 0" />}
                      {a.icon === "star" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l3 6.5 7 .9-5.1 4.9 1.3 7-6.2-3.4-6.2 3.4 1.3-7L2 9.4l7-.9z" />}
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-slate-700 dark:text-slate-300">{a.text}</p>
                    <p className="text-xs text-slate-400">{a.date.toLocaleString("uz-UZ")}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">Hozircha faoliyat yo&apos;q.</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Fanlar bo&apos;yicha bandlovlar
            </h2>
            <Link href="/admin/courses" className="text-xs font-medium text-teal-600 hover:text-teal-700">
              Barcha kurslar →
            </Link>
          </div>
          {courseRows.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs text-slate-400 dark:border-slate-800">
                  <th className="pb-2 font-medium">Fan nomi</th>
                  <th className="pb-2 font-medium">Guruhlar soni</th>
                  <th className="pb-2 font-medium">Bandlovlar soni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {courseRows.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2.5 font-medium text-slate-800 dark:text-slate-200">{c.name}</td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-400">{c.groupCount}</td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-400">{c.reservationCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-slate-400">Hozircha ma&apos;lumot yo&apos;q.</p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-50">
            Bandlovlar holati
          </h2>
          <DonutChart
            centerLabel="Jami"
            centerValue={(statusMap.PENDING ?? 0) + (statusMap.CONFIRMED ?? 0) + (statusMap.CANCELLED ?? 0)}
            segments={[
              { label: reservationStatusLabels.CONFIRMED, value: statusMap.CONFIRMED ?? 0, colorClass: "text-teal-500" },
              { label: reservationStatusLabels.PENDING, value: statusMap.PENDING ?? 0, colorClass: "text-amber-500" },
              { label: reservationStatusLabels.CANCELLED, value: statusMap.CANCELLED ?? 0, colorClass: "text-slate-400" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
