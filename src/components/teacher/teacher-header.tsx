"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/marketing/logo-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/lib/i18n/language-context";

function NotificationsButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Bildirishnomalar"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.5 8a7.5 7.5 0 0115 0v3.5c0 .9.3 1.78.87 2.48L21 15H3l1.13-1.02A3.98 3.98 0 004.5 11.5V8zM9 18a3 3 0 006 0"
          />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            Hozircha bildirishnomalar yo&apos;q.
          </div>
        </>
      )}
    </div>
  );
}

export function TeacherHeader({ userName }: { userName: string }) {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/teacher" className="flex items-center gap-3">
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

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <NotificationsButton />
        </div>
      </div>
      <span className="sr-only">{userName}</span>
    </header>
  );
}
