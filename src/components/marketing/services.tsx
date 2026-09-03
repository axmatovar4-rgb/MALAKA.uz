"use client";

import { useLanguage } from "@/lib/i18n/language-context";

const icons = {
  calendar: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a1 1 0 001-1V7a1 1 0 00-1-1H5a1 1 0 00-1 1v13a1 1 0 001 1zm5.5-7.5l1.5 1.5 3-3"
    />
  ),
  people: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-6a4 4 0 100 8 4 4 0 000-8zM16 3.13a4 4 0 010 7.75"
    />
  ),
  bell: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12.75l1.5 1.5L14.25 9.75M4.5 8a7.5 7.5 0 0115 0v3.5c0 .9.3 1.78.87 2.48L21 15H3l1.13-1.02A3.98 3.98 0 004.5 11.5V8z"
    />
  ),
};

const themes = {
  teal: {
    badge: "bg-teal-500 text-white",
    ring: "text-teal-500 dark:text-teal-400",
    button:
      "border-teal-500 text-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-500/10",
  },
  violet: {
    badge: "bg-violet-500 text-white",
    ring: "text-violet-500 dark:text-violet-400",
    button:
      "border-violet-500 text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-500/10",
  },
  blue: {
    badge: "bg-blue-500 text-white",
    ring: "text-blue-500 dark:text-blue-400",
    button:
      "border-blue-500 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10",
  },
} as const;

function ServiceCard({
  icon,
  theme,
  title,
  bullet,
  description,
  cta,
  href,
}: {
  icon: keyof typeof icons;
  theme: keyof typeof themes;
  title: string;
  bullet: string;
  description: string;
  cta: string;
  href: string;
}) {
  const palette = themes[theme];
  return (
    <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="min-w-0 flex-1">
        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${palette.badge}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
            {icons[icon]}
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          {title}
        </h3>
        <p className={`mt-1 flex items-center gap-1.5 text-xs font-medium ${palette.ring}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {bullet}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {description}
        </p>
        <a
          href={href}
          className={`mt-4 inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium ${palette.button}`}
        >
          {cta}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-3.5 w-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </a>
      </div>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className={`hidden h-20 w-20 shrink-0 opacity-15 sm:block ${palette.ring}`}
      >
        {icons[icon]}
      </svg>
    </div>
  );
}

export function Services() {
  const { t } = useLanguage();
  const { items } = t.services;

  return (
    <section id="biz-haqimizda" className="mx-auto max-w-3xl px-6 py-10 sm:py-16">
      <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-50">
        {t.services.title}
      </h2>
      <div className="space-y-5">
        <ServiceCard
          icon="calendar"
          theme="teal"
          title={items.book.title}
          bullet={items.book.bullet}
          description={items.book.description}
          cta={items.book.cta}
          href="#joy-band-qilish"
        />
        <ServiceCard
          icon="people"
          theme="violet"
          title={items.groups.title}
          bullet={items.groups.bullet}
          description={items.groups.description}
          cta={items.groups.cta}
          href="#guruhlar"
        />
        <ServiceCard
          icon="bell"
          theme="blue"
          title={items.myBookings.title}
          bullet={items.myBookings.bullet}
          description={items.myBookings.description}
          cta={items.myBookings.cta}
          href="/teacher"
        />
      </div>
    </section>
  );
}
