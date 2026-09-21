import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireRole(role: "admin" | "technologist") {
  const session = await getSession();
  if (!session?.user) redirect("/login");
  if (session.user.role !== role) redirect("/login");
  return session;
}
