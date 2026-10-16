"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import type { ImageAsset } from "@/types";
import { useUpload } from "@/hook/useUpload";

interface Props {
  value?: ImageAsset;
  onChange: (asset: ImageAsset) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "Image" }: Props) {
  const upload = useUpload();
  const [preview, setPreview] = useState(value?.url);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    upload.mutate(file, {
      onSuccess: (d) => {
        onChange({ url: d.url, publicId: d.publicId });
        toast.success("Image uploaded");
      },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div>
      <label className="text-sm font-medium block mb-2">{label}</label>
      <div className="flex items-start gap-4">
        {preview ? (
          <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-border group">
            <img src={preview} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => { setPreview(undefined); onChange({ url: "", publicId: "" }); }}
              className="absolute top-1 right-1 p-1 rounded bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <label className="w-32 h-32 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition">
            <Upload className="h-5 w-5 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">
              {upload.isPending ? "Uploading..." : "Upload"}
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
        )}
      </div>
    </div>
  );
}