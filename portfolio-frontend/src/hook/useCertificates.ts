"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CertificateType } from "@/types";
import { api } from "@/lib/apiClient";

export function useCertificates() {
  return useQuery({ queryKey: ["certificates"], queryFn: () => api<CertificateType[]>("/certificates") });
}

function inv(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ["certificates"] });
  qc.invalidateQueries({ queryKey: ["portfolio"] });
  qc.invalidateQueries({ queryKey: ["dashboard"] });
}

export function useCreateCertificate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: Partial<CertificateType>) =>
      api<CertificateType>("/certificates", { method: "POST", body: JSON.stringify(d) }),
    onSuccess: () => inv(qc),
  });
}

export function useUpdateCertificate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CertificateType> }) =>
      api<CertificateType>(`/certificates/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => inv(qc),
  });
}

export function useDeleteCertificate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<{ message: string }>(`/certificates/${id}`, { method: "DELETE" }),
    onSuccess: () => inv(qc),
  });
}