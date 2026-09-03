"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOutAction } from "@/app/admin/actions";

function NotificationsBell({ pendingCount }: { pendingCount: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Bildirishnomalar"
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 8a7.5 7.5 0 0115 0v3.5c0 .9.3 1.78.87 2.48L21 15H3l1.13-1.02A3.98 3.98 0 004.5 11.5V8zM9 18a3 3 0 006 0" />
        </svg>
        {pendingCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {pendingCount}
          </span>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            {pendingCount > 0 ? (
              <Link
                href="/admin/reservations"
                className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {pendingCount} ta bandlov so&apos;rovi kutilmoqda →
              </Link>
            ) : (
              <p className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
                Yangi bildirishnomalar yo&apos;q.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ProfileMenu({ name, role }: { name: string; role: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
          {name.slice(0, 2).toUpperCase()}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-medium text-slate-900 dark:text-slate-50">{name}</span>
          <span className="block text-xs text-slate-500 dark:text-slate-400">{role}</span>
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-slate-400">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <form action={signOutAction}>
              <button
                type="submit"
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                Chiqish
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export function AdminTopBar({
  name,
  role,
  pendingCount,
}: {
  name: string;
  role: string;
  pendingCount: number;
}) {
  return (
    <header className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-3 dark:border-slate-800 dark:bg-slate-900">
      <div className="relative flex-1 max-w-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400">
          <circle cx="11" cy="11" r="7" strokeWidth={1.5} />
          <path strokeLinecap="round" strokeWidth={1.5} d="M21 21l-4.3-4.3" />
        </svg>
        <input
          type="search"
          disabled
          placeholder="Qidirish (tez orada)..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-500 placeholder:text-slate-400 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-2">
        <NotificationsBell pendingCount={pendingCount} />
        <ThemeToggle />
        <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-800" />
        <ProfileMenu name={name} role={role} />
      </div>
    </header>
  );
}
