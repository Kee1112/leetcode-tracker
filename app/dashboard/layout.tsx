"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAcceptedInvitesSync } from "@/hooks/useAcceptedInvitesSync";
import { LogOut, LayoutDashboard, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userDoc, signOut, refreshUserDoc } = useAuth();

  useAcceptedInvitesSync(
    user?.uid ?? null,
    !!userDoc?.partnerId,
    refreshUserDoc
  );

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  const nav = [
    { href: "/dashboard", label: "Today", icon: LayoutDashboard },
    { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <nav className="flex items-center gap-1">
              {nav.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-1" />
              Sign out
            </Button>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      </div>
    </AuthGuard>
  );
}
