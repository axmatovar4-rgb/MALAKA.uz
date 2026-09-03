"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "@/components/marketing/logo-mark";

const icons = {
  home: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />,
  users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-6a4 4 0 100 8 4 4 0 000-8zM16 3.13a4 4 0 010 7.75" />,
  book: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V4H6.5A2.5 2.5 0 004 6.5v13z" />,
  groups: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-6a4 4 0 100 8 4 4 0 000-8z" />,
  calendar: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a1 1 0 001-1V7a1 1 0 00-1-1H5a1 1 0 00-1 1v13a1 1 0 001 1z" />,
  school: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3L2 8l10 5 10-5-10-5zM6 12.18v3.6c0 .27.14.52.37.65C7.5 17.1 9.6 18 12 18s4.5-.9 5.63-1.57c.23-.13.37-.38.37-.65v-3.6" />,
  subject: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0v7m-9-5v3.5c0 .34.16.66.44.85C5.06 21.4 8.3 23 12 23s6.94-1.6 8.56-2.65c.28-.19.44-.51.44-.85V14" />,
  chart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3v18h18M8 17V9m4 8V5m4 12v-6" />,
  settings: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 3.5h3l.5 2.3a7 7 0 011.9 1.1l2.2-.8 1.5 2.6-1.8 1.5a7 7 0 010 2.2l1.8 1.5-1.5 2.6-2.2-.8a7 7 0 01-1.9 1.1l-.5 2.3h-3l-.5-2.3a7 7 0 01-1.9-1.1l-2.2.8-1.5-2.6 1.8-1.5a7 7 0 010-2.2L4.4 9.7l1.5-2.6 2.2.8a7 7 0 011.9-1.1l.5-2.3zM12 15a3 3 0 100-6 3 3 0 000 6z" />,
  log: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6M9 8h1M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" />,
} as const;

type NavItem = {
  label: string;
  href?: string;
  icon: keyof typeof icons;
  comingSoon?: boolean;
};

const navItems: NavItem[] = [
  { label: "Bosh sahifa", href: "/admin", icon: "home" },
  { label: "Foydalanuvchilar", href: "/admin/users", icon: "users" },
  { label: "Kurslar", href: "/admin/courses", icon: "book" },
  { label: "Guruhlar", href: "/admin/groups", icon: "groups" },
  { label: "Bandlovlar", href: "/admin/reservations", icon: "calendar" },
  { label: "Maktablar", href: "/admin/schools", icon: "school" },
  { label: "Fanlar", href: "/admin/subjects", icon: "subject" },
  { label: "Statistika", href: "/admin/statistics", icon: "chart" },
  { label: "Sozlamalar", href: "/admin/settings", icon: "settings" },
  { label: "Tizim jurnali", href: "/admin/log", icon: "log" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden shrink-0 flex-col border-r border-slate-200 bg-white transition-all dark:border-slate-800 dark:bg-slate-900 lg:flex ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-5 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-label="Menyuni yig'ish"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {!collapsed && (
          <Link href="/admin" className="flex min-w-0 items-center gap-2">
            <LogoMark className="h-8 w-8 shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
                Malaka.uz
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">Admin panel</p>
            </div>
          </Link>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const active = item.href && (item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href));
          const content = (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 shrink-0">
                {icons[item.icon]}
              </svg>
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.comingSoon && (
                <span className="ml-auto shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  Tez orada
                </span>
              )}
            </>
          );

          if (item.comingSoon || !item.href) {
            return (
              <div
                key={item.label}
                title={collapsed ? item.label : undefined}
                className="flex cursor-default items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 dark:text-slate-600"
              >
                {content}
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                active
                  ? "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {content}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
