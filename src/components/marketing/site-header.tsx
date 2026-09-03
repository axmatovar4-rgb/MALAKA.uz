"use client";

import Link from "next/link";
import { LogoMark } from "./logo-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/lib/i18n/language-context";

export function SiteHeader() {
  const { t } = useLanguage();

  const navItems = [
    { href: "/", label: t.header.nav.home },
    { href: "#joy-band-qilish", label: t.header.nav.courses },
    { href: "#guruhlar", label: t.header.nav.groups },
    { href: "#yangiliklar", label: t.header.nav.news },
    { href: "#faq", label: t.header.nav.faq },
    { href: "#biz-haqimizda", label: t.header.nav.about },
    { href: "#aloqa", label: t.header.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <LogoMark />
          <div>
            <p className="text-sm font-semibold leading-tight text-slate-900 dark:text-slate-50">
              Malaka.uz
            </p>
            <p className="text-xs leading-tight text-slate-500 dark:text-slate-400">
              {t.header.tagline}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <Link
            href="/login"
            className="rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white hover:bg-teal-700"
          >
            {t.header.login}
          </Link>
        </div>
      </div>
    </header>
  );
}
