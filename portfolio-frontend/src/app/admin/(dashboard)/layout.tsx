"use client";

import { AdminSidebar } from "@/components/admin/Sidebar";
import { useAuth } from "@/hook/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { QueryProvider } from "@/providers/query-provider"; // 👈 1. Import Provider

// 👈 2. Tell Next.js to skip static generation for all dashboard pages
export const dynamic = "force-dynamic";

// 👈 3. Rename the original component to a wrapper
export default function AdminDashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </QueryProvider>
  );
}

// 👈 4. Keep your original logic here (no changes needed inside)
function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: admin, isLoading, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (error || !admin)) {
      router.replace("/admin/login");
    }
  }, [admin, isLoading, error, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }
  if (!admin) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar admin={admin} />
      <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">{children}</main>
    </div>
  );
}