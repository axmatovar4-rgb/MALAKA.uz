"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  requestOtp,
  checkPhoneStatus,
  verifyCodeOnly,
  loginWithPhone,
  registerTeacher,
} from "@/lib/phone-auth-actions";
import { getInstitutions, getAllSubjects, getDistricts } from "@/lib/reservation-actions";
import { categoryLabels, groupDescriptions, groupForCategory, groupLabels } from "@/lib/qualification";
import type { QualificationCategory } from "@prisma/client";

type Option = { id: string; name: string };

export function PhoneAuthWizard({ regions }: { regions: Option[] }) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);

  const [phone, setPhone] = useState("+998");
  const [code, setCode] = useState("");

  const [name, setName] = useState("");
  const [regionId, setRegionId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [institutionId, setInstitutionId] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [useCustomInstitution, setUseCustomInstitution] = useState(false);
  const [subjectId, setSubjectId] = useState("");
  const [qualificationCategory, setQualificationCategory] = useState<QualificationCategory | "">("");

  const [districts, setDistricts] = useState<Option[]>([]);
  const [institutions, setInstitutions] = useState<Option[]>([]);
  const [subjects, setSubjects] = useState<Option[]>([]);

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

  function handleSendCode() {
    setError(null);
    startTransition(async () => {
      try {
        const { devCode } = await requestOtp(phone);
        setDevCode(devCode);
        setStep(2);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Xatolik yuz berdi");
      }
    });
  }

  function handleVerifyCode() {
    setError(null);
    startTransition(async () => {
      const { valid } = await verifyCodeOnly(phone, code);
      if (!valid) {
        setError("Kod noto'g'ri yoki muddati o'tgan");
        return;
      }
      const { registered } = await checkPhoneStatus(phone);
      if (registered) {
        const result = await loginWithPhone(phone, code);
        if (result.ok) {
          router.push("/teacher");
        } else {
          setError(result.error ?? "Kirishda xatolik");
        }
        return;
      }
      const subjectData = await getAllSubjects();
      setSubjects(subjectData);
      setStep(3);
    });
  }

  function handleRegionChange(id: string) {
    setRegionId(id);
    setDistrictId("");
    setDistricts([]);
    setInstitutionId("");
    setInstitutionName("");
    setInstitutions([]);
    setUseCustomInstitution(false);
    if (!id) return;
    startTransition(async () => {
      const data = await getDistricts(id);
      setDistricts(data);
    });
  }

  function handleDistrictChange(id: string) {
    setDistrictId(id);
    setInstitutionId("");
    setInstitutionName("");
    setInstitutions([]);
    setUseCustomInstitution(false);
    if (!id) return;
    startTransition(async () => {
      const data = await getInstitutions(id);
      setInstitutions(data);
      if (data.length === 0) setUseCustomInstitution(true);
    });
  }

  function handleRegister() {
    setError(null);
    const hasInstitution = useCustomInstitution ? institutionName.trim().length > 0 : Boolean(institutionId);
    if (!name.trim() || !hasInstitution || !subjectId || !qualificationCategory) {
      setError("Barcha maydonlarni to'ldiring");
      return;
    }
    startTransition(async () => {
      try {
        const result = await registerTeacher({
          phone,
          code,
          name,
          districtId,
          institutionId: useCustomInstitution ? undefined : institutionId,
          institutionName: useCustomInstitution ? institutionName.trim() : undefined,
          subjectId,
          qualificationCategory: qualificationCategory as QualificationCategory,
        });
        if (result.ok) {
          router.push("/teacher");
        } else {
          setError(result.error ?? "Xatolik yuz berdi");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Xatolik yuz berdi");
      }
    });
  }

  const group = qualificationCategory ? groupForCategory(qualificationCategory) : null;

  return (
    <section id="joy-band-qilish" className="bg-slate-50 py-16 dark:bg-slate-950 sm:py-24">
      <div className="mx-auto max-w-xl px-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">
            Joy band qilish
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Malaka oshirish kursiga joy band qilish uchun avval telefon
            raqamingiz orqali ro&apos;yxatdan o&apos;ting yoki kiring.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10">
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Telefon raqamingiz
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998901234567"
                  className={inputClass}
                />
              </div>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={isPending || phone.length < 13}
                className="w-full rounded-full bg-teal-600 px-6 py-3 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-40"
              >
                {isPending ? "Yuborilmoqda..." : "Kod yuborish"}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {devCode && (
                <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  <strong>Test rejimi</strong> — SMS provayder hali ulanmagan.
                  Sizning tasdiqlash kodingiz: <strong>{devCode}</strong>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  SMS orqali yuborilgan kod
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className={inputClass}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  ← Orqaga
                </button>
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={isPending || code.length < 4}
                  className="rounded-full bg-teal-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-40"
                >
                  {isPending ? "Tekshirilmoqda..." : "Tasdiqlash →"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                F.I.Sh. va asosiy ma&apos;lumotlaringizni kiriting
              </p>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  F.I.Sh.
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Viloyat
                </label>
                <select
                  className={inputClass}
                  value={regionId}
                  onChange={(e) => handleRegionChange(e.target.value)}
                >
                  <option value="">Viloyatni tanlang</option>
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tuman
                </label>
                <select
                  className={inputClass}
                  value={districtId}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  disabled={!regionId}
                >
                  <option value="">Tumanni tanlang</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Maktab/kollej
                  </label>
                  {districtId && institutions.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setUseCustomInstitution((v) => !v);
                        setInstitutionId("");
                        setInstitutionName("");
                      }}
                      className="text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400"
                    >
                      {useCustomInstitution ? "Ro'yxatdan tanlash" : "Ro'yxatda yo'qmi? Qo'lda kiriting"}
                    </button>
                  )}
                </div>
                {useCustomInstitution ? (
                  <input
                    type="text"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    disabled={!districtId}
                    placeholder="Muassasa nomini kiriting"
                    className={inputClass}
                  />
                ) : (
                  <select
                    className={inputClass}
                    value={institutionId}
                    onChange={(e) => setInstitutionId(e.target.value)}
                    disabled={!districtId}
                  >
                    <option value="">Muassasani tanlang</option>
                    {institutions.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                )}
                {districtId && institutions.length === 0 && !isPending && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Bu tumanda hali muassasalar ro&apos;yxatga olinmagan — nomini
                    qo&apos;lda kiriting, keyinroq admin tomonidan tasdiqlanadi.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Fan
                </label>
                <select
                  className={inputClass}
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                >
                  <option value="">Fanni tanlang</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Malaka toifasi
                </label>
                <select
                  className={inputClass}
                  value={qualificationCategory}
                  onChange={(e) =>
                    setQualificationCategory(e.target.value as QualificationCategory | "")
                  }
                >
                  <option value="">Toifani tanlang</option>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {group && (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-800">
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    Guruhingiz: {groupLabels[group]}
                  </p>
                  <p className="mt-1 text-slate-500 dark:text-slate-400">
                    {groupDescriptions[group]}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  ← Orqaga
                </button>
                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={isPending}
                  className="rounded-full bg-teal-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-40"
                >
                  {isPending ? "Yuborilmoqda..." : "Ro'yxatdan o'tish →"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
