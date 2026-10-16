"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Plus, Trash2, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import type { CertificateType, ImageAsset } from "@/types";
import { useCertificates, useCreateCertificate, useDeleteCertificate, useUpdateCertificate } from "@/hook/useCertificates";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function AdminCertificatesPage() {
  const { data, isLoading } = useCertificates();
  const create = useCreateCertificate();
  const update = useUpdateCertificate();
  const del = useDeleteCertificate();

  const [editing, setEditing] = useState<CertificateType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [image, setImage] = useState<ImageAsset>({ url: "", publicId: "" });

  const reset = () => { setEditing(null); setShowForm(false); setImage({ url: "", publicId: "" }); };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: String(fd.get("title")),
      issuer: String(fd.get("issuer")),
      issueDate: String(fd.get("issueDate")),
      expiryDate: String(fd.get("expiryDate") || ""),
      credentialId: String(fd.get("credentialId") || ""),
      credentialUrl: String(fd.get("credentialUrl") || ""),
      image,
    };
    if (editing) update.mutate({ id: editing.id, data: payload }, { onSuccess: () => { toast.success("Updated"); reset(); } });
    else create.mutate(payload, { onSuccess: () => { toast.success("Created"); reset(); } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Certificates</h1>
        <Button onClick={() => { setEditing(null); setImage({ url: "", publicId: "" }); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add
        </Button>
      </div>

      {showForm && (
        <Card className="glass border-border/40">
          <CardContent className="p-6">
            <form onSubmit={submit} className="space-y-4">
              <ImageUpload value={image} onChange={setImage} label="Certificate Image" />
              <Input name="title" placeholder="Title" defaultValue={editing?.title} required />
              <Input name="issuer" placeholder="Issuer" defaultValue={editing?.issuer} required />
              <div className="grid md:grid-cols-2 gap-4">
                <Input name="issueDate" type="date" defaultValue={editing?.issueDate} required />
                <Input name="expiryDate" type="date" defaultValue={editing?.expiryDate} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input name="credentialId" placeholder="Credential ID" defaultValue={editing?.credentialId} />
                <Input name="credentialUrl" placeholder="Credential URL" defaultValue={editing?.credentialUrl} />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editing ? "Update" : "Create"}</Button>
                <Button type="button" variant="outline" onClick={reset}><X className="h-4 w-4 mr-1" /> Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? <p>Loading...</p> : (
        <div className="grid md:grid-cols-2 gap-4">
          {data?.map((c) => (
            <Card key={c.id} className="glass border-border/40">
              <CardContent className="p-4 flex items-center gap-4">
                {c.image?.url && <img src={c.image.url} alt="" className="w-14 h-14 rounded-lg object-cover" />}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{c.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{c.issuer}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => { setEditing(c); setImage(c.image || { url: "", publicId: "" }); setShowForm(true); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => del.mutate(c.id, { onSuccess: () => toast.success("Deleted") })}>
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