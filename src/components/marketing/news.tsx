const news = [
  {
    tag: "Yangilik",
    title: "Malaka oshirish kurslari haqida yangiliklar",
    description:
      "2026-yil uchun fanlar bo'yicha kurs jadvali va guruhlar bo'yicha umumiy ma'lumot e'lon qilindi.",
  },
  {
    tag: "E'lon",
    title: "Kurs jadvalidagi o'zgarishlar",
    description:
      "Ba'zi fanlar bo'yicha kurs oylari va guruh sig'imi bo'yicha yangilanishlar kiritildi.",
  },
  {
    tag: "Ma'lumot",
    title: "Ro'yxatdan o'tish bo'yicha yangiliklar",
    description:
      "Platformaga yangi ta'lim muassasalari va pedagog xodimlar qo'shildi.",
  },
  {
    tag: "Muhim",
    title: "Pedagoglar uchun muhim e'lonlar",
    description:
      "Malaka oshirish kursini yakunlash va sertifikat olish tartibi bo'yicha eslatmalar.",
  },
];

export function News() {
  return (
    <section id="yangiliklar" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">
        Yangiliklar
      </h2>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {news.map((item) => (
          <div
            key={item.title}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <span className="inline-block w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 dark:bg-teal-950 dark:text-teal-300">
              {item.tag}
            </span>
            <h3 className="mt-4 font-medium text-slate-900 dark:text-slate-50">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
