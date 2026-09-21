import { requireRole } from "@/lib/session";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function TechnologistLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole("technologist");

  return (
    <DashboardShell role="technologist" userName={session.user.name ?? ""} roleLabel="Technologist">
      {children}
    </DashboardShell>
  );
}
