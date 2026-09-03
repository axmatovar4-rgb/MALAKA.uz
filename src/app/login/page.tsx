import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { LogoMark } from "@/components/marketing/logo-mark";

async function login(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=1");
    }
    throw error;
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <form
        action={login}
        className="w-full max-w-sm space-y-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-center gap-3">
          <LogoMark className="h-11 w-11" />
          <div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              Malaka.uz
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Tizimga kirish</p>
          </div>
        </div>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">
            Email yoki parol noto&apos;g&apos;ri.
          </p>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
            Parol
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-teal-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
        >
          Kirish
        </button>
      </form>
    </div>
  );
}
