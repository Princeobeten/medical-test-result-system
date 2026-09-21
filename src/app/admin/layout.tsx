import { requireRole } from "@/lib/session";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole("admin");

  return (
    <DashboardShell role="admin" userName={session.user.name ?? ""} roleLabel="Administrator">
      {children}
    </DashboardShell>
  );
}
