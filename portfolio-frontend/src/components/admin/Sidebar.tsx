"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Folder, GraduationCap, Award, Info,
  FileText, User, LogOut, Settings, Home
} from "lucide-react";

import type { AdminProfile } from "@/types";
import { useLogout } from "@/hook/useAuth";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: Folder },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/about", label: "About", icon: Info },
  { href: "/admin/cv", label: "CV / Resume", icon: FileText },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ admin }: { admin: AdminProfile }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, { onSuccess: () => router.push("/admin/login") });
  };

  return (
    <aside className="w-64 shrink-0 glass border-r border-border/40 min-h-screen flex flex-col sticky top-0">
      <div className="p-6 border-b border-border/40">
        <Link href="/admin" className="font-display text-xl font-bold gradient-text">
          MANOJ<span className="text-foreground">.</span>admin
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const active = pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                active
                  ? "bg-primary text-primary-foreground glow"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/40 space-y-3">
        <div className="flex items-center gap-3 px-2">
          {admin.profileImage?.url ? (
            <img src={admin.profileImage.url} alt="" className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
              {admin.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{admin.name}</p>
            <p className="text-xs text-muted-foreground truncate">{admin.email}</p>
          </div>
        </div>

        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition">
          <Home className="h-4 w-4" /> View site
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </aside>
  );
}