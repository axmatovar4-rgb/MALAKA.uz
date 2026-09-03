import Link from "next/link";
import { LogoMark } from "./logo-mark";

export function SiteFooter() {
  return (
    <footer id="aloqa" className="border-t border-slate-800 bg-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark />
              <p className="text-sm font-semibold text-white">Malaka.uz</p>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Pedagoglar malakasini oshirish va kurslarga joy band qilish
              platformasi.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Menyu</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-white">
                  Bosh sahifa
                </Link>
              </li>
              <li>
                <a href="#joy-band-qilish" className="hover:text-white">
                  Joy band qilish
                </a>
              </li>
              <li>
                <Link href="/teacher" className="hover:text-white">
                  Mening bandlovlarim
                </Link>
              </li>
              <li>
                <a href="#guruhlar" className="hover:text-white">
                  Guruhlar
                </a>
              </li>
              <li>
                <a href="#yangiliklar" className="hover:text-white">
                  Yangiliklar
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white">
                  Savol-javob
                </a>
              </li>
              <li>
                <a href="#biz-haqimizda" className="hover:text-white">
                  Biz haqimizda
                </a>
              </li>
              <li>
                <a href="#aloqa" className="hover:text-white">
                  Aloqa
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Dasturlar</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>
                <span className="cursor-default">Foydalanish shartlari</span>
              </li>
              <li>
                <span className="cursor-default">Maxfiylik siyosati</span>
              </li>
              <li>
                <Link href="/teacher/yordam" className="hover:text-white">
                  Yordam
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white">
                  Tizimga kirish
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Biz bilan bog&apos;lanish
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>Telefon: +998 71 000 00 00</li>
              <li>Email: info@malaka.uz</li>
              <li>Manzil: Toshkent shahar, O&apos;zbekiston</li>
            </ul>

            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://t.me/malaka_uz_MMA"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-teal-600 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M21.05 3.16 2.7 10.32c-1.25.5-1.24 1.2-.23 1.51l4.7 1.47 1.8 5.54c.22.6.37.84.77.84.37 0 .54-.17.75-.38l1.8-1.75 4.75 3.5c.87.48 1.5.23 1.72-.8l3.12-14.7c.32-1.28-.48-1.85-1.63-1.4Zm-11.4 10.98-1.16 4-.85-2.99 7.4-6.68c.34-.3-.07-.46-.5-.19l-9.1 5.73-1.9-.62 13.02-4.85-6.9 5.6Z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/robiya_khurshidovnaa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-teal-600 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                  <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth={1.5} />
                  <circle cx="12" cy="12" r="4" strokeWidth={1.5} />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@robiyaaxmatova-f1e"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-teal-600 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M23 12s0-3.6-.46-5.3a2.9 2.9 0 0 0-2-2C18.9 4.2 12 4.2 12 4.2s-6.9 0-8.54.5a2.9 2.9 0 0 0-2 2C1 8.4 1 12 1 12s0 3.6.46 5.3a2.9 2.9 0 0 0 2 2c1.64.5 8.54.5 8.54.5s6.9 0 8.54-.5a2.9 2.9 0 0 0 2-2C23 15.6 23 12 23 12ZM9.7 15.5V8.5l6.3 3.5-6.3 3.5Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-sm text-slate-500">
          © {new Date().getFullYear()} Malaka.uz. Barcha huquqlar
          himoyalangan.
        </div>
      </div>
    </footer>
  );
}
