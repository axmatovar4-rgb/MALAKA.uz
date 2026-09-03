"use client";

import { useState } from "react";

const faqItems = [
  {
    question: "Malaka oshirish kursiga necha yilda bir marta boriladi?",
    answer:
      "Har bir pedagog o'z faoliyati davomida 5 yilda bir marta, 1 oylik malaka oshirish kursidan o'tadi.",
  },
  {
    question: "Guruhimni o'zim tanlaymanmi?",
    answer:
      "Yo'q. Guruh tizim tomonidan sizning malaka toifangizga qarab avtomatik aniqlanadi va belgilanadi.",
  },
  {
    question: "Qaysi guruhga tegishli ekanimni qanday bilaman?",
    answer:
      "Mutaxassis va II toifa egalari — Rivojlantiruvchi guruhga, I va oliy toifa egalari — Yuksaltiruvchi guruhga tegishli bo'ladi. Buni tizim joy band qilish jarayonida avtomatik ko'rsatadi.",
  },
  {
    question: "Bir guruhda nechta o'qituvchi bo'lishi mumkin?",
    answer:
      "Har bir guruhda maksimal 25 nafar o'qituvchi bo'lishi mumkin. Bu chegaradan oshishga hech qanday holatda yo'l qo'yilmaydi.",
  },
  {
    question: "Kurs oyini o'zim tanlay olamanmi?",
    answer:
      "Ha. Guruhingiz aniqlangandan so'ng, bo'sh joyi bor kurs oylaridan o'zingizga qulayini tanlaysiz.",
  },
  {
    question: "Joy band qilingandan keyin SMS keladimi?",
    answer:
      "Ha, joyingiz band qilingandan so'ng shaxsiy telefon raqamingizga tasdiqlovchi SMS xabarnoma yuboriladi.",
  },
  {
    question: "Kurs boshlanishidan oldin eslatma yuboriladimi?",
    answer:
      "Ha, kurs boshlanishiga 3 kun qolganda telefon raqamingizga avtomatik eslatma SMS yuboriladi.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-slate-50 py-16 dark:bg-slate-950 sm:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-center text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">
          Ko&apos;p beriladigan savollar
        </h2>

        <div className="mt-10 space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-slate-900 dark:text-slate-50"
                >
                  {item.question}
                  <span className="ml-4 text-slate-400">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
