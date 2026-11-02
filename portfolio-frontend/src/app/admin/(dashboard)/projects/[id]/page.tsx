"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

import { toast } from "sonner";
import type { ImageAsset } from "@/types";
import { useCreateProject, useProject, useUpdateProject } from "@/hook/useProjects";
import { ImageUpload } from "@/components/admin/ImageUpload";


// ─────────────────────────────────────────────────────────────
// NO .default() here — defaults are provided via useForm.defaultValues
// This keeps z.input and z.output identical, eliminating the RHF type error.
// ─────────────────────────────────────────────────────────────
const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  technologies: z.string(),
  liveUrl: z.string(),
  githubUrl: z.string(),
  featured: z.boolean(),
});

type Form = z.infer<typeof schema>;

export default function ProjectFormPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const isNew = !id || id === "new";
  const router = useRouter();

  const create = useCreateProject();
  const update = useUpdateProject();
  const { data: existing } = useProject(isNew ? "" : id);

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      category: "General",
      technologies: "",
      liveUrl: "",
      githubUrl: "",
      featured: false,
    },
  });

  const [image, setImage] = useState<ImageAsset>({ url: "", publicId: "" });

  useEffect(() => {
    if (existing) {
      form.reset({
        title: existing.title,
        description: existing.description,
        category: existing.category,
        technologies: existing.technologies?.join(", ") ?? "",
        liveUrl: existing.liveUrl ?? "",
        githubUrl: existing.githubUrl ?? "",
        featured: existing.featured ?? false,
      });

      setImage({
        url:image?.url ?? "",
        publicId:image?.publicId??"",
      });
    }
  }, [existing, form]);

  const onSubmit = (data: Form) => {
    const payload = {
      ...data,
      image,
      technologies: data.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (isNew) {
      create.mutate(payload, {
        onSuccess: () => {
          toast.success("Project created");
          router.push("/admin/projects");
        },
        onError: (e) => toast.error(e.message),
      });
    } else {
      update.mutate(
        { id, data: payload },
        {
          onSuccess: () => {
            toast.success("Project updated");
            router.push("/admin/projects");
          },
          onError: (e) => toast.error(e.message),
        }
      );
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-display text-3xl font-bold">
        {isNew ? "New Project" : "Edit Project"}
      </h1>

      <Card className="glass border-border/40">
        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <ImageUpload value={image} onChange={setImage} label="Project Image" />

            <div>
              <label className="text-sm font-medium block mb-1.5">Title *</label>
              <Input {...form.register("title")} />
              {form.formState.errors.title && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">Description *</label>
              <Textarea rows={4} {...form.register("description")} />
              {form.formState.errors.description && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1.5">Category</label>
                <Input {...form.register("category")} />
                {form.formState.errors.category && (
                  <p className="text-xs text-destructive mt-1">
                    {form.formState.errors.category.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">
                  Technologies (comma-separated)
                </label>
                <Input
                  placeholder="React, Node.js, MongoDB"
                  {...form.register("technologies")}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1.5">Live URL</label>
                <Input placeholder="https://..." {...form.register("liveUrl")} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">GitHub URL</label>
                <Input
                  placeholder="https://github.com/..."
                  {...form.register("githubUrl")}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...form.register("featured")} />
              Mark as Featured
            </label>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={create.isPending || update.isPending}
              >
                {create.isPending || update.isPending
                  ? "Saving..."
                  : isNew
                    ? "Create Project"
                    : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}