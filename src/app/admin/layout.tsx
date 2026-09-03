import { requireRole } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopBar } from "@/components/admin/admin-topbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("ADMIN");
  const pendingCount = await prisma.reservation.count({ where: { status: "PENDING" } });

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopBar name={user.name} role="Super administrator" pendingCount={pendingCount} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
