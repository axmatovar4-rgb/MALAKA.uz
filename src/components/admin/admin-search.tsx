"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import Link from "next/link";
import { searchAdmin } from "@/app/admin/actions";

const roleLabels: Record<string, string> = {
  ADMIN: "Admin",
  DIRECTOR: "Direktor",
  TEACHER: "O'qituvchi",
};

type Result = Awaited<ReturnType<typeof searchAdmin>>;

export function AdminSearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    setOpen(true);
    if (value.trim().length < 2) {
      setResult(null);
      return;
    }
    startTransition(async () => {
      const r = await searchAdmin(value);
      setResult(r);
    });
  }

  const hasResults = result && (result.users.length > 0 || result.institutions.length > 0);

  return (
    <div ref={containerRef} className="relative flex-1 max-w-sm">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      >
        <circle cx="11" cy="11" r="7" strokeWidth={1.5} />
        <path strokeLinecap="round" strokeWidth={1.5} d="M21 21l-4.3-4.3" />
      </svg>
      <input
        type="search"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder="Qidirish (ism, telefon, muassasa)..."
        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:focus:bg-slate-900"
      />

      {open && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 z-30 mt-2 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {isPending && <p className="px-3 py-2 text-sm text-slate-400">Qidirilmoqda...</p>}

          {!isPending && !hasResults && (
            <p className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">Hech narsa topilmadi</p>
          )}

          {!isPending && result && result.users.length > 0 && (
            <div className="mb-1">
              <p className="px-3 py-1 text-[11px] font-medium uppercase text-slate-400">Foydalanuvchilar</p>
              {result.users.map((u) => (
                <Link
                  key={u.id}
                  href={`/admin/users?q=${encodeURIComponent(u.name)}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <span className="font-medium text-slate-800 dark:text-slate-200">{u.name}</span>
                  <span className="ml-2 text-xs text-slate-400">
                    {roleLabels[u.role]} · {u.phone ?? u.email ?? ""}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {!isPending && result && result.institutions.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[11px] font-medium uppercase text-slate-400">Muassasalar</p>
              {result.institutions.map((i) => (
                <Link
                  key={i.id}
                  href={`/admin/institutions/${i.id}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <span className="font-medium text-slate-800 dark:text-slate-200">{i.name}</span>
                  <span className="ml-2 text-xs text-slate-400">{i.district.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
