"use client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { CVType } from "@/types";
import { useCV, useUpdateCV } from "@/hook/useCV";

export default function AdminCVPage() {
  const { data, isLoading } = useCV();
  const update = useUpdateCV();
  const [cv, setCv] = useState<CVType | null>(null);

  useEffect(() => { if (data) setCv(data); }, [data]);

  if (isLoading || !cv) return <p>Loading...</p>;

  const updateInfo = (field: keyof CVType["personalInfo"], value: string) =>
    setCv({ ...cv, personalInfo: { ...cv.personalInfo, [field]: value } });

  const save = () => {
    update.mutate(cv, {
      onSuccess: () => toast.success("CV updated"),
      onError: (e) => toast.error(e.message),
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">CV / Resume</h1>
        <Button onClick={save} disabled={update.isPending} className="glow">
          {update.isPending ? "Saving..." : "Save CV"}
        </Button>
      </div>

      <Card className="glass border-border/40">
        <CardHeader><CardTitle>Personal Info</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input placeholder="Name" value={cv.personalInfo.name} onChange={(e) => updateInfo("name", e.target.value)} />
            <Input placeholder="Email" value={cv.personalInfo.email} onChange={(e) => updateInfo("email", e.target.value)} />
            <Input placeholder="Phone" value={cv.personalInfo.phone} onChange={(e) => updateInfo("phone", e.target.value)} />
            <Input placeholder="Address" value={cv.personalInfo.address} onChange={(e) => updateInfo("address", e.target.value)} />
            <Input placeholder="Website" value={cv.personalInfo.website ?? ""} onChange={(e) => updateInfo("website", e.target.value)} />
            <Input placeholder="Title" value={cv.personalInfo.title} onChange={(e) => updateInfo("title", e.target.value)} />
          </div>
          <Textarea
            placeholder="Summary" rows={4}
            value={cv.personalInfo.summary}
            onChange={(e) => updateInfo("summary", e.target.value)}
          />
        </CardContent>
      </Card>

      <Card className="glass border-border/40">
        <CardHeader><CardTitle>Template</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {(["modern", "classic", "creative"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setCv({ ...cv, template: t })}
                className={`px-4 py-2 rounded-lg text-sm capitalize ${
                  cv.template === t ? "bg-primary text-primary-foreground" : "glass"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}