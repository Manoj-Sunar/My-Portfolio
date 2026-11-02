"use client";

import { AdminSidebar } from "@/components/admin/Sidebar";
import { useAuth } from "@/hook/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { QueryProvider } from "@/providers/query-provider";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
    <QueryProvider> {/* 👈 wrap here */}
      <div className="flex min-h-screen bg-background">
        <AdminSidebar admin={admin} />
        <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">{children}</main>
      </div>
    </QueryProvider>
  );
}