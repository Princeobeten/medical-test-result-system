import { requireRole } from "@/lib/session";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { AccountForm } from "@/components/account/account-form";

export default async function TechnologistAccountPage() {
  const session = await requireRole("technologist");

  await connectDB();
  const user = await User.findById(session.user.id).lean();

  return (
    <AccountForm
      name={user?.name ?? ""}
      email={user?.email ?? ""}
      phone={user?.phone ?? ""}
    />
  );
}
