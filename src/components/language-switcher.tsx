"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/language-context";

const flags: Record<"uz" | "ru", { label: string; emoji: string }> = {
  uz: { label: "O'zbekcha", emoji: "🇺🇿" },
  ru: { label: "Русский", emoji: "🇷🇺" },
};

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Tilni tanlash"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
      >
        {flags[locale].emoji}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            {(Object.keys(flags) as Array<"uz" | "ru">).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setLocale(code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 ${
                  code === locale
                    ? "font-medium text-teal-600 dark:text-teal-400"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                <span>{flags[code].emoji}</span>
                {flags[code].label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
