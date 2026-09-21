"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  LayoutDashboard,
  Users,
  FlaskConical,
  PlusCircle,
  UserCog,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const NAV_ITEMS: Record<"admin" | "technologist", NavItem[]> = {
  admin: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/staff", label: "Staff", icon: Users },
    { href: "/admin/tests", label: "Tests", icon: FlaskConical },
  ],
  technologist: [
    { href: "/technologist", label: "Dashboard", icon: LayoutDashboard },
    { href: "/technologist/tests", label: "My Tests", icon: FlaskConical },
    { href: "/technologist/tests/new", label: "Conduct Test", icon: PlusCircle },
    { href: "/technologist/account", label: "My Account", icon: UserCog },
  ],
};

export function DashboardShell({
  role,
  userName,
  roleLabel,
  children,
}: {
  role: "admin" | "technologist";
  userName: string;
  roleLabel: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const navItems = NAV_ITEMS[role];

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r bg-muted/30 p-4 print:hidden md:flex md:flex-col">
        <div className="mb-6 px-2">
          <p className="font-semibold leading-tight">Medical Test Result System</p>
          <p className="text-xs text-muted-foreground">CRUTECH (UNICROSS)</p>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-6 border-t pt-4">
          <p className="px-2 text-sm font-medium">{userName}</p>
          <p className="px-2 text-xs text-muted-foreground">{roleLabel}</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full justify-start gap-2"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
