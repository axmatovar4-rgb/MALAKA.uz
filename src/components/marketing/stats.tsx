import type { ReactNode } from "react";
import { prisma } from "@/lib/prisma";

const icons: Record<string, ReactNode> = {
  teachers: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 14a4 4 0 100-8 4 4 0 000 8zm-7 7a7 7 0 0114 0"
    />
  ),
  capacity: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-6a4 4 0 100 8 4 4 0 000-8z"
    />
  ),
  months: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a1 1 0 001-1V7a1 1 0 00-1-1H5a1 1 0 00-1 1v13a1 1 0 001 1z"
    />
  ),
  cycle: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4 4v5h5M20 20v-5h-5M4 9a8 8 0 0114-4.9M20 15a8 8 0 01-14 4.9"
    />
  ),
};

export async function Stats() {
  const teacherCount = await prisma.user.count({ where: { role: "TEACHER" } });
  const formattedTeacherCount =
    teacherCount >= 1000 ? `${Math.floor(teacherCount / 1000)} 000+` : `${teacherCount}`;

  const stats = [
    { key: "teachers", value: formattedTeacherCount, label: "Ro'yxatdan o'tgan pedagoglar" },
    { key: "capacity", value: "25", label: "Har bir guruhdagi maksimal o'qituvchi" },
    { key: "months", value: "12", label: "Kurs oylari" },
    { key: "cycle", value: "5 yil", label: "Malaka oshirish davri" },
  ];

  return (
    <section className="bg-teal-700 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.key} className="flex flex-col items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {icons[stat.key]}
                </svg>
              </div>
              <p className="text-3xl font-semibold text-white">{stat.value}</p>
              <p className="text-sm text-teal-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
