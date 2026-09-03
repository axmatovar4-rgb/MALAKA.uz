const groups = [
  {
    key: "RIVOJLANTIRUVCHI",
    name: "Rivojlantiruvchi",
    audience: "Mutaxassis va II toifa egalari uchun",
    description:
      "Kasbiy ko'nikmalarni shakllantirish va pedagogik faoliyatning dastlabki bosqichidagi bilimlarni chuqurlashtirishga qaratilgan guruh.",
    accent: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
    dot: "bg-teal-500",
    link: "text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300",
  },
  {
    key: "YUKSALTIRUVCHI",
    name: "Yuksaltiruvchi",
    audience: "I va oliy toifa egalari uchun",
    description:
      "Yuqori malakali pedagoglar uchun ilg'or metodika va zamonaviy pedagogik yondashuvlarni yanada takomillashtiradigan guruh.",
    accent: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    dot: "bg-blue-600",
    link: "text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300",
  },
];

export function Groups() {
  return (
    <section id="guruhlar" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">
        Guruhlar
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        Guruh tizim tomonidan malaka toifangizga qarab avtomatik belgilanadi
        — uni o&apos;zingiz tanlamaysiz.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {groups.map((group) => (
          <div
            key={group.key}
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${group.accent}`}
            >
              <span className={`h-2 w-2 rounded-full ${group.dot}`} />
              {group.audience}
            </span>
            <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-50">
              {group.name}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {group.description}
            </p>
            <a
              href="#joy-band-qilish"
              className={`mt-6 inline-flex items-center text-sm font-medium ${group.link}`}
            >
              Guruh haqida →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
