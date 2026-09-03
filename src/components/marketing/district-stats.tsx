import { prisma } from "@/lib/prisma";

// Positions are a simplified, schematic layout of the districts (not
// geographically precise coordinates) — just enough to render a map-like
// cluster of dots.
const LAYOUT: Record<string, { x: number; y: number }> = {
  Yunusobod: { x: 55, y: 15 },
  "Mirzo Ulug'bek": { x: 75, y: 25 },
  Olmazor: { x: 25, y: 25 },
  Shayxontohur: { x: 40, y: 35 },
  Chilonzor: { x: 25, y: 50 },
  Yakkasaroy: { x: 45, y: 50 },
  Mirobod: { x: 62, y: 45 },
  Yashnobod: { x: 78, y: 50 },
  Uchtepa: { x: 15, y: 65 },
  Sergeli: { x: 35, y: 75 },
  Bektemir: { x: 65, y: 78 },
  Yangihayot: { x: 20, y: 85 },
};

export async function DistrictStats() {
  const districts = await prisma.district.findMany({
    select: {
      id: true,
      name: true,
      institutions: {
        select: {
          teachers: {
            select: { reservations: { select: { id: true } } },
          },
        },
      },
    },
  });

  const counts = districts
    .map((d) => ({
      id: d.id,
      name: d.name,
      count: d.institutions.reduce(
        (sum, inst) =>
          sum + inst.teachers.reduce((s, t) => s + t.reservations.length, 0),
        0,
      ),
    }))
    .sort((a, b) => b.count - a.count);

  const total = counts.reduce((sum, d) => sum + d.count, 0);
  const maxCount = Math.max(1, ...counts.map((d) => d.count));

  return (
    <section className="mx-auto max-w-6xl px-6 py-10 sm:py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Statistika
        </h2>
        <span className="rounded-full bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700 dark:bg-teal-950 dark:text-teal-300">
          Barchasini ko&apos;rish
        </span>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Tumanlar bo&apos;yicha barcha murojaatlar soni
          </p>
          <div className="relative mx-auto mt-4 aspect-square max-w-xs overflow-hidden rounded-[40%] bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-950/40 dark:to-blue-950/40">
            {counts.map((d) => {
              const pos = LAYOUT[d.name] ?? { x: 50, y: 50 };
              const intensity = d.count / maxCount;
              const size = 10 + intensity * 14;
              return (
                <div
                  key={d.id}
                  title={`${d.name}: ${d.count}`}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-teal-500 text-[9px] font-semibold text-white shadow-sm"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    width: size,
                    height: size,
                    opacity: d.count > 0 ? 0.55 + intensity * 0.45 : 0.35,
                  }}
                >
                  {d.count > 0 ? d.count : ""}
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-center text-3xl font-bold text-slate-900 dark:text-slate-50">
            {total}
          </p>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Jami murojaatlar soni
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            Tumanlar kesimida barcha murojaatlar soni
          </p>
          <ol className="space-y-3">
            {counts.slice(0, 8).map((d, index) => (
              <li key={d.id} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {index + 1}
                  </span>
                  {d.name}
                </span>
                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                  {d.count}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
