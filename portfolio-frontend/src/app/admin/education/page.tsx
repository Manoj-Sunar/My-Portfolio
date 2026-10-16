"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import type { EducationType } from "@/types";
import { useCreateEducation, useDeleteEducation, useEducation, useUpdateEducation } from "@/hook/useEducation";

export default function AdminEducationPage() {
  const { data, isLoading } = useEducation();
  const create = useCreateEducation();
  const update = useUpdateEducation();
  const del = useDeleteEducation();

  const [editing, setEditing] = useState<EducationType | null>(null);
  const [showForm, setShowForm] = useState(false);

  const reset = () => { setEditing(null); setShowForm(false); };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      institution: String(fd.get("institution")),
      degree: String(fd.get("degree")),
      field: String(fd.get("field")),
      startDate: String(fd.get("startDate")),
      endDate: String(fd.get("endDate") || ""),
      isCurrent: fd.get("isCurrent") === "on",
      description: String(fd.get("description") || ""),
      grade: String(fd.get("grade") || ""),
    };
    if (editing) {
      update.mutate({ id: editing.id, data: payload }, {
        onSuccess: () => { toast.success("Updated"); reset(); },
      });
    } else {
      create.mutate(payload, { onSuccess: () => { toast.success("Created"); reset(); } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Education</h1>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add
        </Button>
      </div>

      {showForm && (
        <Card className="glass border-border/40">
          <CardContent className="p-6">
            <form onSubmit={submit} className="space-y-4" key={editing?.id ?? "new"}>
              <Input name="institution" placeholder="Institution" defaultValue={editing?.institution} required />
              <div className="grid md:grid-cols-2 gap-4">
                <Input name="degree" placeholder="Degree" defaultValue={editing?.degree} required />
                <Input name="field" placeholder="Field" defaultValue={editing?.field} required />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input name="startDate" placeholder="Start (YYYY-MM-DD)" defaultValue={editing?.startDate} required />
                <Input name="endDate" placeholder="End (YYYY-MM-DD)" defaultValue={editing?.endDate} />
              </div>
              <Input name="grade" placeholder="Grade" defaultValue={editing?.grade} />
              <Textarea name="description" rows={3} placeholder="Description" defaultValue={editing?.description} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="isCurrent" defaultChecked={editing?.isCurrent} />
                Currently studying
              </label>
              <div className="flex gap-2">
                <Button type="submit">{editing ? "Update" : "Create"}</Button>
                <Button type="button" variant="outline" onClick={reset}>
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? <p>Loading...</p> : (
        <div className="space-y-3">
          {data?.map((edu) => (
            <Card key={edu.id} className="glass border-border/40">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <p className="text-sm text-muted-foreground">{edu.institution} · {edu.field}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {edu.startDate} — {edu.isCurrent ? "Present" : edu.endDate}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => { setEditing(edu); setShowForm(true); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => del.mutate(edu.id, { onSuccess: () => toast.success("Deleted") })}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}