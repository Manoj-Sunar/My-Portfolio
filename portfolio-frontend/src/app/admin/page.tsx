"use client";

import { StatCard } from "@/components/admin/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats } from "@/hook/useDashboard";
import { Folder, GraduationCap, Award, Activity, Sparkles } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return <div className="text-muted-foreground">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your portfolio content.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Projects" value={stats?.totalProjects ?? 0} icon={Folder} />
        <StatCard title="Education" value={stats?.totalEducation ?? 0} icon={GraduationCap} />
        <StatCard title="Certificates" value={stats?.totalCertificates ?? 0} icon={Award} />
        <StatCard title="Skills" value={stats?.totalSkills ?? 0} icon={Sparkles} />
      </div>

      <Card className="glass border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" /> Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentActivity?.length ? (
            <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {stats.recentActivity.map((a:any, i:any) => (
                <li key={i} className="text-sm text-muted-foreground py-2 border-b border-border/30 last:border-0">
                  {a}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}