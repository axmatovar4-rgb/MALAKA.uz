"use client";

import { useState, useTransition } from "react";
import { getDistricts } from "@/lib/reservation-actions";
import { createInstitution } from "@/app/admin/actions";

type Option = { id: string; name: string };

export function CreateInstitutionForm({ regions }: { regions: Option[] }) {
  const [isPending, startTransition] = useTransition();
  const [regionId, setRegionId] = useState("");
  const [districts, setDistricts] = useState<Option[]>([]);

  const inputClass =
    "w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800";

  function handleRegionChange(id: string) {
    setRegionId(id);
    setDistricts([]);
    if (!id) return;
    startTransition(async () => {
      const data = await getDistricts(id);
      setDistricts(data);
    });
  }

  return (
    <form action={createInstitution} className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Muassasa nomi
        </label>
        <input name="institutionName" required className={inputClass} />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Viloyat
        </label>
        <select
          value={regionId}
          onChange={(e) => handleRegionChange(e.target.value)}
          className={inputClass}
        >
          <option value="">Viloyatni tanlang</option>
          {regions.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-2 space-y-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Tuman
        </label>
        <select
          name="districtId"
          required
          disabled={!regionId}
          className={inputClass}
        >
          <option value="">
            {isPending ? "Yuklanmoqda..." : "Tumanni tanlang"}
          </option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Direktor ismi
        </label>
        <input name="directorName" required className={inputClass} />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Direktor emaili
        </label>
        <input name="directorEmail" type="email" required className={inputClass} />
      </div>
      <div className="col-span-2 space-y-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Direktor uchun vaqtinchalik parol
        </label>
        <input name="directorPassword" type="text" required minLength={6} className={inputClass} />
      </div>
      <div className="col-span-2">
        <button
          type="submit"
          className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          Muassasa yaratish
        </button>
      </div>
    </form>
  );
}
