"use client";

import { useState, useTransition } from "react";
import { bulkImportInstitutions } from "@/app/admin/actions";

export function BulkImportInstitutionsForm() {
  const [isPending, startTransition] = useTransition();
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ created: number; skipped: number; notFound: string[] } | null>(null);

  function handleImport() {
    setResult(null);
    startTransition(async () => {
      const res = await bulkImportInstitutions(text);
      setResult(res);
      if (res.created > 0) setText("");
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Har bir qatorda: <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">Tuman nomi, Muassasa nomi</code>{" "}
        (masalan: <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">Chilonzor, 45-maktab</code>).
        Direktor keyinroq alohida tayinlanadi.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        placeholder={"Chilonzor, 45-maktab\nYunusobod, 12-maktab\nSamarqand, 3-maktab"}
        className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm dark:border-slate-700 dark:bg-slate-800"
      />
      <button
        type="button"
        onClick={handleImport}
        disabled={isPending || !text.trim()}
        className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-40"
      >
        {isPending ? "Import qilinmoqda..." : "Import qilish"}
      </button>

      {result && (
        <div className="rounded-md bg-slate-50 p-4 text-sm dark:bg-slate-800">
          <p className="text-teal-700 dark:text-teal-400">
            ✓ {result.created} ta yaratildi
          </p>
          {result.skipped > 0 && (
            <p className="text-slate-500 dark:text-slate-400">
              {result.skipped} ta allaqachon mavjud edi (o&apos;tkazib yuborildi)
            </p>
          )}
          {result.notFound.length > 0 && (
            <div className="mt-2">
              <p className="text-red-600 dark:text-red-400">
                {result.notFound.length} ta qator tuman topilmadi yoki format xato:
              </p>
              <ul className="mt-1 list-disc pl-5 text-xs text-slate-500 dark:text-slate-400">
                {result.notFound.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
