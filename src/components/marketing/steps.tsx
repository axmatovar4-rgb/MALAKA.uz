const steps = [
  {
    number: "01",
    title: "Ma'lumotlarni tanlash",
    description: "Tuman, maktab/kollej va fanni tanlang.",
  },
  {
    number: "02",
    title: "O'zingizni aniqlash",
    description: "Ro'yxatdan ism-familiyangizni tanlang.",
  },
  {
    number: "03",
    title: "Guruh va oyni aniqlash",
    description:
      "Tizim guruhingizni avtomatik aniqlaydi va bo'sh oylarni ko'rsatadi.",
  },
  {
    number: "04",
    title: "Joyni band qilish",
    description: "O'zingizga qulay oyni tanlab joyingizni band qiling.",
  },
];

export function Steps() {
  return (
    <section id="qanday-ishlaydi" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">
        Joy band qilish qanday amalga oshiriladi?
      </h2>
      <div className="relative mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="pointer-events-none absolute top-6 left-0 right-0 hidden h-px bg-slate-200 dark:bg-slate-800 lg:block" />
        {steps.map((step) => (
          <div key={step.number} className="relative">
            <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">
              {step.number}
            </div>
            <h3 className="font-medium text-slate-900 dark:text-slate-50">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
