"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { AdminProfile } from "@/types";
import { api } from "@/lib/apiClient";

export function useAuth() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => api<AdminProfile>("/auth/me"),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (c: { email: string; password: string }) =>
      api<{ success: boolean; admin: AdminProfile }>("/auth/login", {
        method: "POST", body: JSON.stringify(c),
      }),
    onSuccess: (d) => qc.setQueryData(["auth", "me"], d.admin),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api<{ success: boolean }>("/auth/logout", { method: "POST" }),
    onSuccess: () => qc.clear(),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: Partial<AdminProfile>) =>
      api<{ admin: AdminProfile }>("/auth/profile", { method: "PATCH", body: JSON.stringify(d) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auth", "me"] });
      qc.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (d: { currentPassword: string; newPassword: string }) =>
      api<{ message: string }>("/auth/change-password", { method: "PATCH", body: JSON.stringify(d) }),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) =>
      api<{ success: boolean; message: string }>("/auth/forgot-password", {
        method: "POST", body: JSON.stringify({ email }),
      }),
  });
}

export function useVerifyOTP() {
  return useMutation({
    mutationFn: (d: { email: string; otp: string }) =>
      api<{ token: string }>("/auth/verify-otp", { method: "POST", body: JSON.stringify(d) }),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (d: { token: string; password: string }) =>
      api<{ message: string }>("/auth/reset-password", { method: "POST", body: JSON.stringify(d) }),
  });
}