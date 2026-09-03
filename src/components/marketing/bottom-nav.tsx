"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/language-context";

const icons = {
  home: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10"
    />
  ),
  courses: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V4H6.5A2.5 2.5 0 004 6.5v13z"
    />
  ),
  bookings: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12.75l1.5 1.5L14.25 9.75M9 3.75h6a1.5 1.5 0 011.5 1.5v15L12 17.25 6.75 20.25v-15a1.5 1.5 0 011.5-1.5z"
    />
  ),
  profile: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 14a4 4 0 100-8 4 4 0 000 8zm-7 7a7 7 0 0114 0"
    />
  ),
};

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  // The same nav renders on the public homepage and on authenticated
  // /teacher pages. Relative hash links like "#guruhlar" only resolve on
  // the page that actually has that id — on any other route they silently
  // do nothing, and "/#joy-band-qilish" bounces a logged-in teacher right
  // back to /teacher (the "/" route redirects authenticated users away).
  // So every destination is computed from the current route instead.
  const inTeacherArea = pathname.startsWith("/teacher");

  const items = [
    { key: "home", href: "/", label: t.bottomNav.home, icon: icons.home },
    {
      key: "courses",
      href: inTeacherArea ? "/teacher/menu" : "/#guruhlar",
      label: t.bottomNav.courses,
      icon: icons.courses,
    },
    {
      key: "reservations",
      href: inTeacherArea ? "/teacher#tarix" : "/teacher",
      label: t.bottomNav.reservations,
      icon: icons.bookings,
    },
    { key: "profile", href: "/teacher", label: t.bottomNav.profile, icon: icons.profile },
  ];

  const bookHref = inTeacherArea ? "/teacher/book" : "/#joy-band-qilish";

  const isActive = (href: string) => href === "/" && pathname === "/";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 lg:hidden">
      <div className="relative mx-auto flex max-w-md items-center justify-between px-4 py-2">
        {items.slice(0, 2).map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-1 text-[11px] font-medium ${
              isActive(item.href)
                ? "text-teal-600 dark:text-teal-400"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
              {item.icon}
            </svg>
            {item.label}
          </Link>
        ))}

        <Link
          href={bookHref}
          aria-label={t.bottomNav.book}
          className="mx-2 -mt-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-500 text-white shadow-lg shadow-teal-500/30 hover:bg-teal-600"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-7 w-7">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
          </svg>
        </Link>

        {items.slice(2).map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-1 text-[11px] font-medium ${
              isActive(item.href)
                ? "text-teal-600 dark:text-teal-400"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
              {item.icon}
            </svg>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
