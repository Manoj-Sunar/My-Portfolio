"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteProject, useProjects } from "@/hook/useProjects";

export default function AdminProjectsPage() {
  const [search, setSearch] = useState("");
  const { data: projects, isLoading } = useProjects(search);
  const del = useDeleteProject();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">Projects</h1>
          <p className="text-sm text-muted-foreground">
            {projects?.length ?? 0} total
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="glow">
            <Plus className="h-4 w-4 mr-2" /> Add Project
          </Button>
        </Link>
      </div>

      <Input
        placeholder="Search projects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : !projects?.length ? (
        <Card className="glass border-border/40">
          <CardContent className="p-8 text-center text-muted-foreground">
            No projects found. Create your first one.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((p) => (
            <Card key={p.id} className="glass border-border/40">
              <CardContent className="p-4 flex items-center gap-4">
                {p.image?.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image.url}
                    alt={p.title}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold truncate">{p.title}</h3>
                    {p.featured && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {p.category} · {p.technologies?.join(", ")}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg hover:bg-muted"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <Link
                    href={`/admin/projects/${p.id}`}
                    className="p-2 rounded-lg hover:bg-muted"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <button className="p-2 rounded-lg hover:bg-destructive/10 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      }
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete project?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. &quot;{p.title}&quot;
                          will be permanently removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            del.mutate(p.id, {
                              onSuccess: () => toast.success("Project deleted"),
                              onError: (e) => toast.error(e.message),
                            })
                          }
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}