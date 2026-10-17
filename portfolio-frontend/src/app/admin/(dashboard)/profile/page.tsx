"use client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";
import type { ImageAsset } from "@/types";
import { useAuth, useUpdateProfile } from "@/hook/useAuth";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function AdminProfilePage() {
  const { data: admin } = useAuth();
  const update = useUpdateProfile();

  const [form, setForm] = useState({
    name: "", email: "", bio: "", title: "",
    github: "", linkedin: "", twitter: "", instagram: "",
  });
  const [image, setImage] = useState<ImageAsset>({ url: "", publicId: "" });

  useEffect(() => {
    if (admin) {
      setForm({
        name: admin.name, email: admin.email, bio: admin.bio, title: admin.title,
        github: admin.socialLinks?.github ?? "",
        linkedin: admin.socialLinks?.linkedin ?? "",
        twitter: admin.socialLinks?.twitter ?? "",
        instagram: admin.socialLinks?.instagram ?? "",
      });
      setImage(admin.profileImage ?? { url: "", publicId: "" });
    }
  }, [admin]);

  const save = () => {
    update.mutate({
      name: form.name, email: form.email, bio: form.bio, title: form.title,
      profileImage: image,
      socialLinks: { github: form.github, linkedin: form.linkedin, twitter: form.twitter, instagram: form.instagram },
    }, {
      onSuccess: () => toast.success("Profile updated"),
      onError: (e) => toast.error(e.message),
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-display text-3xl font-bold">Profile</h1>

      <Card className="glass border-border/40">
        <CardContent className="p-6 space-y-5">
          <ImageUpload value={image} onChange={setImage} label="Profile Image" />

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Email</label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Title</label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Bio</label>
            <Textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input placeholder="GitHub URL" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
            <Input placeholder="LinkedIn URL" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
            <Input placeholder="Twitter URL" value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} />
            <Input placeholder="Instagram URL" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
          </div>

          <Button onClick={save} disabled={update.isPending} className="glow">
            {update.isPending ? "Saving..." : "Save Profile"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}