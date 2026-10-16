"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { EducationType } from "@/types";
import { api } from "@/lib/apiClient";

/**
 * Fetch all education records (public + admin).
 */
export function useEducation() {
  return useQuery({
    queryKey: ["education"],
    queryFn: () => api<EducationType[]>("/education"),
  });
}

/**
 * Fetch a single education record by ID.
 */
export function useEducationById(id: string) {
  return useQuery({
    queryKey: ["education", id],
    queryFn: () => api<EducationType>(`/education/${id}`),
    enabled: !!id,
  });
}

/**
 * Shared cache invalidation after any mutation.
 */
function invalidateAll(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ["education"] });
  qc.invalidateQueries({ queryKey: ["portfolio"] });
  qc.invalidateQueries({ queryKey: ["dashboard"] });
}

/**
 * Create a new education record.
 */
export function useCreateEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<EducationType>) =>
      api<EducationType>("/education", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => invalidateAll(qc),
  });
}

/**
 * Update an existing education record.
 */
export function useUpdateEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<EducationType>;
    }) =>
      api<EducationType>(`/education/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => invalidateAll(qc),
  });
}

/**
 * Delete an education record.
 */
export function useDeleteEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<{ message: string }>(`/education/${id}`, { method: "DELETE" }),
    onSuccess: () => invalidateAll(qc),
  });
}