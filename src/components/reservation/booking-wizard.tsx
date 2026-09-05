"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getOfferings, createReservation } from "@/lib/reservation-actions";
import { ReservationError } from "@/lib/reservation-errors";
import { categoryLabels, groupLabels } from "@/lib/qualification";
import type { GroupType, QualificationCategory } from "@prisma/client";

type Offering = {
  id: string;
  monthLabel: string;
  year: number;
  startDate: string;
  capacity: number;
  reservedCount: number;
  available: number;
};

export function BookingWizard({
  teacherName,
  districtName,
  institutionName,
  subjectId,
  subjectName,
  qualificationCategory,
  groupType,
}: {
  teacherName: string;
  districtName: string;
  institutionName: string;
  subjectId: string;
  subjectName: string;
  qualificationCategory: QualificationCategory;
  groupType: GroupType;
}) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [selectedOfferingId, setSelectedOfferingId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    startTransition(async () => {
      const data = await getOfferings(subjectId, groupType);
      setOfferings(data);
    });
  }, [subjectId, groupType]);

  const selectedOffering = offerings.find((o) => o.id === selectedOfferingId) ?? null;

  function submit() {
    if (!selectedOfferingId) return;
    setError(null);
    startTransition(async () => {
      try {
        await createReservation(selectedOfferingId);
        setSubmitted(true);
        setStep(3);
      } catch (e) {
        if (e instanceof ReservationError) {
          setError(e.message);
        } else {
          setError("Kutilmagan xatolik yuz berdi. Qaytadan urinib ko'ring.");
        }
      }
    });
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Bo&apos;sh kurs oylari
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Har bir oyda maksimal 25 nafar o&apos;qituvchi tasdiqlanishi mumkin. Har bir
              hududdan faqat 3 tadan o&apos;qituvchi band qilishi mumkin.
            </p>
            <div className="space-y-3">
              {offerings.map((offering) => {
                const full = offering.available <= 0;
                const selected = offering.id === selectedOfferingId;
                return (
                  <button
                    key={offering.id}
                    type="button"
                    disabled={full}
                    onClick={() => setSelectedOfferingId(offering.id)}
                    className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                      full
                        ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60 dark:border-slate-800 dark:bg-slate-800"
                        : selected
                          ? "border-teal-500 bg-teal-50 ring-2 ring-teal-100 dark:bg-teal-950/40"
                          : "border-slate-200 bg-white hover:border-teal-300 dark:border-slate-700 dark:bg-slate-900"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        full ? "bg-slate-200 text-slate-500" : "bg-teal-500 text-white"
                      }`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a1 1 0 001-1V7a1 1 0 00-1-1H5a1 1 0 00-1 1v13a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-slate-50">
                        {offering.monthLabel} {offering.year}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {offering.reservedCount} / {offering.capacity} ta joy tasdiqlangan
                      </p>
                      <p className={`mt-0.5 text-xs font-medium ${full ? "text-red-600" : "text-teal-600"}`}>
                        {full ? "Joylar to'lgan" : `${offering.available} ta bo'sh joy`}
                      </p>
                    </div>
                    {!full && <span className="shrink-0 text-sm font-medium text-teal-600">Tanlash →</span>}
                  </button>
                );
              })}
              {offerings.length === 0 && !isPending && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Hozircha bu guruh bo&apos;yicha rejalashtirilgan kurs oyi yo&apos;q.
                </p>
              )}
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!selectedOfferingId || isPending}
                className="rounded-full bg-teal-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-40"
              >
                Davom etish →
              </button>
            </div>
          </div>
        )}

        {step === 2 && selectedOffering && (
          <div className="space-y-6">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Joy band qilishni tasdiqlang
            </p>
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                ["F.I.Sh.", teacherName],
                ["Tuman", districtName],
                ["Maktab/kollej", institutionName],
                ["Fan", subjectName],
                ["Malaka toifasi", categoryLabels[qualificationCategory]],
                ["Guruh", groupLabels[groupType]],
                ["Kurs oyi", `${selectedOffering.monthLabel} ${selectedOffering.year}`],
                ["Boshlanish sanasi", `1-${selectedOffering.monthLabel}, ${selectedOffering.year}`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                  <dt className="text-xs text-slate-500 dark:text-slate-400">{label}</dt>
                  <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              So&apos;rovingiz yuborilgandan so&apos;ng &quot;Kutilmoqda&quot; holatida
              bo&apos;ladi va admin tomonidan ko&apos;rib chiqiladi.
            </p>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isPending}
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                ← Orqaga
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={isPending}
                className="rounded-full bg-teal-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-40"
              >
                {isPending ? "Yuborilmoqda..." : "So'rovni yuborish →"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && submitted && (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl dark:bg-amber-950">
              ⏳
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                So&apos;rovingiz qabul qilindi!
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Bandlovingiz &quot;Kutilmoqda&quot; holatida. Admin tasdiqlagach,
                joyingiz rasman band qilinadi.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/teacher")}
              className="rounded-full bg-teal-600 px-6 py-3 text-sm font-medium text-white hover:bg-teal-700"
            >
              Profilimga qaytish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
