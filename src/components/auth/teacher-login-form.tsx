"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { requestOtp, checkPhoneStatus, verifyCodeOnly, loginWithPhone } from "@/lib/phone-auth-actions";

export function TeacherLoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [notRegistered, setNotRegistered] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [phone, setPhone] = useState("+998");
  const [code, setCode] = useState("");

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";

  function handleSendCode() {
    setError(null);
    setNotRegistered(false);
    startTransition(async () => {
      try {
        const { devCode } = await requestOtp(phone);
        setDevCode(devCode);
        // Test mode only (no real SMS provider yet) — the code is shown on
        // screen anyway, so pre-filling it saves the user from retyping it.
        setCode(devCode ?? "");
        setStep(2);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Xatolik yuz berdi");
      }
    });
  }

  function handleVerify() {
    setError(null);
    setNotRegistered(false);
    startTransition(async () => {
      const { valid } = await verifyCodeOnly(phone, code);
      if (!valid) {
        setError("Kod noto'g'ri yoki muddati o'tgan");
        return;
      }
      const { registered } = await checkPhoneStatus(phone);
      if (!registered) {
        setNotRegistered(true);
        return;
      }
      const result = await loginWithPhone(phone, code);
      if (result.ok) {
        router.push("/teacher");
      } else {
        setError(result.error ?? "Kirishda xatolik");
      }
    });
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}
      {notRegistered && (
        <div className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          Bu raqam ro&apos;yxatdan o&apos;tmagan.{" "}
          <Link href="/#joy-band-qilish" className="font-medium underline">
            Ro&apos;yxatdan o&apos;tish
          </Link>{" "}
          uchun bosh sahifadagi &quot;Joy band qilish&quot; bo&apos;limidan foydalaning.
        </div>
      )}

      {step === 1 && (
        <>
          <div className="space-y-1">
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
            className="w-full rounded-lg bg-teal-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-40"
          >
            {isPending ? "Yuborilmoqda..." : "Kod yuborish"}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          {devCode && (
            <div className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              <strong>Test rejimi</strong> — tasdiqlash kodingiz: <strong>{devCode}</strong>
            </div>
          )}
          <div className="space-y-1">
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
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              ← Orqaga
            </button>
            <button
              type="button"
              onClick={handleVerify}
              disabled={isPending || code.length < 4}
              className="flex-1 rounded-lg bg-teal-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-40"
            >
              {isPending ? "Tekshirilmoqda..." : "Kirish"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
