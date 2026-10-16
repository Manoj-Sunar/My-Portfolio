"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { AboutType } from "@/types";
import { api } from "@/lib/apiClient";

export function useAbout() {
  return useQuery({ queryKey: ["about"], queryFn: () => api<AboutType>("/about") });
}

export function useUpdateAbout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: Partial<AboutType>) =>
      api<{ about: AboutType }>("/about", { method: "PATCH", body: JSON.stringify(d) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["about"] });
      qc.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });
}