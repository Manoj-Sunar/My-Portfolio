"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { CVType } from "@/types";
import { api } from "@/lib/apiClient";

export function useCV() {
  return useQuery({ queryKey: ["cv"], queryFn: () => api<CVType>("/cv") });
}

export function useUpdateCV() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: Partial<CVType>) =>
      api<{ cv: CVType }>("/cv", { method: "PATCH", body: JSON.stringify(d) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cv"] });
      qc.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });
}