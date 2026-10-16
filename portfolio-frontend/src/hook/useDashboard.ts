"use client";
import { useQuery } from "@tanstack/react-query";

import type { DashboardStats } from "@/types";
import { api } from "@/lib/apiClient";

export function useDashboardStats() {
  return useQuery({ queryKey: ["dashboard", "stats"], queryFn: () => api<DashboardStats>("/dashboard/stats") });
}