"use client";

import { useState, type ReactNode } from "react";

export function LoginTabs({ adminPanel, teacherPanel }: { adminPanel: ReactNode; teacherPanel: ReactNode }) {
  const [tab, setTab] = useState<"teacher" | "admin">("teacher");

  return (
    <div>
      <div className="mb-5 flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
        <button
          type="button"
          onClick={() => setTab("teacher")}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
            tab === "teacher"
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-50"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          O&apos;qituvchi
        </button>
        <button
          type="button"
          onClick={() => setTab("admin")}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
            tab === "admin"
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-50"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          Admin / Direktor
        </button>
      </div>

      {tab === "teacher" ? teacherPanel : adminPanel}
    </div>
  );
}
