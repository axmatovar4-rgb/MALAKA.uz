"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/i18n/language-context";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-6xl px-6 pt-6 sm:pt-10">
      <div className="relative min-h-[440px] w-full overflow-hidden rounded-3xl shadow-sm sm:aspect-[16/9] sm:min-h-0">
        <Image
          src="/hero.webp"
          alt="Pedagog kompyuterda ishlamoqda"
          fill
          priority
          className="object-cover"
          sizes="(min-width: 1024px) 1152px, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-10">
          <h1 className="max-w-lg text-2xl font-bold leading-tight text-white sm:text-5xl">
            {t.hero.title}
          </h1>
          <p className="mt-2 max-w-md text-xs leading-relaxed text-white/90 sm:mt-4 sm:text-base">
            {t.hero.subtitle}
          </p>
          <a
            href="#joy-band-qilish"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-teal-500 px-5 py-2.5 text-xs font-semibold text-white hover:bg-teal-600 sm:mt-6 sm:px-6 sm:py-3 sm:text-sm"
          >
            {t.hero.cta}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
