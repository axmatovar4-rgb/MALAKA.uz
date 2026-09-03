import { signOut } from "@/auth";

export function TopBar({
  title,
  userName,
}: {
  title: string;
  userName: string;
}) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{userName}</p>
      </div>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button
          type="submit"
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Chiqish
        </button>
      </form>
    </header>
  );
}
