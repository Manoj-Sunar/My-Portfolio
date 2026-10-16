"use client";
import { useQuery } from "@tanstack/react-query";

import type { PortfolioData } from "@/types";
import { api } from "@/lib/apiClient";

export function usePortfolio() {
  return useQuery({
    queryKey: ["portfolio"],
    queryFn: () => api<PortfolioData>("/portfolio"),
  });
}