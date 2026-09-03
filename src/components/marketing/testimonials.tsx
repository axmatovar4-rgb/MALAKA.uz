import { prisma } from "@/lib/prisma";

function Stars({ rating }: { rating: number }) {
  return (
    <p className="text-amber-500" aria-label={`${rating} / 5`}>
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </p>
  );
}

export async function Testimonials() {
  const reviews = await prisma.review.findMany({
    include: { teacher: { include: { institution: true } } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  if (reviews.length === 0) return null;

  const average =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <section id="fikrlar" className="bg-slate-50 py-16 dark:bg-slate-950 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">
            Foydalanuvchilar fikri
          </h2>
          <div className="flex items-center gap-2">
            <Stars rating={Math.round(average)} />
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {average.toFixed(1)} / 5 ({reviews.length} ta fikr)
            </span>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <Stars rating={review.rating} />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {review.comment}
              </p>
              <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                {review.teacher.name}
                {review.teacher.institution ? ` · ${review.teacher.institution.name}` : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
