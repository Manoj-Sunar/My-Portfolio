"use client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import type { ImageAsset, SkillItem, AchievementItem } from "@/types";
import { useAbout, useUpdateAbout } from "@/hook/useAbout";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function AdminAboutPage() {
  const { data, isLoading } = useAbout();
  const update = useUpdateAbout();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<ImageAsset>({ url: "", publicId: "" });
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setContent(data.content);
      setImage(data.image || { url: "", publicId: "" });
      setSkills(data.skills || []);
      setAchievements(data.achievements || []);
    }
  }, [data]);

  if (isLoading) return <p>Loading...</p>;

  const save = () => {
    update.mutate(
      { title, content, image, skills, achievements },
      { onSuccess: () => toast.success("About updated"), onError: (e) => toast.error(e.message) }
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="font-display text-3xl font-bold">About Section</h1>

      <Card className="glass border-border/40">
        <CardContent className="p-6 space-y-5">
          <ImageUpload value={image} onChange={setImage} label="Hero / About Image" />

          <div>
            <label className="text-sm font-medium block mb-1.5">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Content</label>
            <Textarea rows={6} value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-border/40">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Skills</h2>
            <Button size="sm" variant="outline" onClick={() => setSkills([...skills, { name: "", level: 80 }])}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Skill
            </Button>
          </div>

          <div className="space-y-3">
            {skills.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  placeholder="Skill name"
                  value={s.name}
                  onChange={(e) => setSkills(skills.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                />
                <Input
                  type="number" min={0} max={100} className="w-24"
                  value={s.level}
                  onChange={(e) => setSkills(skills.map((x, j) => j === i ? { ...x, level: Number(e.target.value) } : x))}
                />
                <Button variant="ghost" size="icon" onClick={() => setSkills(skills.filter((_, j) => j !== i))}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-border/40">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Achievements</h2>
            <Button size="sm" variant="outline" onClick={() => setAchievements([...achievements, { title: "", description: "" }])}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add
            </Button>
          </div>
          {achievements.map((a, i) => (
            <div key={i} className="space-y-2 border-b border-border/30 pb-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Title"
                  value={a.title}
                  onChange={(e) => setAchievements(achievements.map((x, j) => j === i ? { ...x, title: e.target.value } : x))}
                />
                <Button variant="ghost" size="icon" onClick={() => setAchievements(achievements.filter((_, j) => j !== i))}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <Textarea
                placeholder="Description" rows={2}
                value={a.description}
                onChange={(e) => setAchievements(achievements.map((x, j) => j === i ? { ...x, description: e.target.value } : x))}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button onClick={save} disabled={update.isPending} className="glow">
        {update.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}