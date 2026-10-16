"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { ProjectType } from "@/types";
import { api } from "@/lib/apiClient";

export function useProjects(search?: string, category?: string) {
  const p = new URLSearchParams();
  if (search) p.set("search", search);
  if (category) p.set("category", category);
  return useQuery({
    queryKey: ["projects", { search, category }],
    queryFn: () => api<ProjectType[]>(`/projects?${p.toString()}`),
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => api<ProjectType>(`/projects/${id}`),
    enabled: !!id,
  });
}

function invalidate(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ["projects"] });
  qc.invalidateQueries({ queryKey: ["portfolio"] });
  qc.invalidateQueries({ queryKey: ["dashboard"] });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: Partial<ProjectType>) =>
      api<ProjectType>("/projects", { method: "POST", body: JSON.stringify(d) }),
    onSuccess: () => invalidate(qc),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectType> }) =>
      api<ProjectType>(`/projects/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => invalidate(qc),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<{ message: string }>(`/projects/${id}`, { method: "DELETE" }),
    onSuccess: () => invalidate(qc),
  });
}

export function useReorderProjects() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) =>
      api<{ message: string }>("/projects/reorder", { method: "POST", body: JSON.stringify({ ids }) }),
    onSuccess: () => invalidate(qc),
  });
}