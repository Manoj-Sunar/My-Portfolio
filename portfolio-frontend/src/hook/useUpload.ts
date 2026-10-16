"use client";
import { useMutation } from "@tanstack/react-query";

import type { UploadResponse } from "@/types";
import { api } from "@/lib/apiClient";

export function useUpload() {
  return useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      return api<UploadResponse>("/upload", { method: "POST", body: fd });
    },
  });
}