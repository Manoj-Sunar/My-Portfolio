import React, { useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Laptop,
  GraduationCap,
  Cpu,
  Award,
  ArrowRight,
  PlusCircle,
  FileSpreadsheet,
  Settings,
  History,
} from 'lucide-react';
import { Card, Button, Heading, Paragraph, Span } from '../../components/common/UI';

interface DashboardData {
  totalProjects: number;
  totalEducation: number;
  totalSkills: number;
  totalCertificates?: number;
  recentActivity: string[];
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const { data: stats, isLoading, refetch, isFetching } = useQuery<DashboardData>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/dashboard');
      return res.data;
    },
    staleTime: 1000 * 30, // 30 seconds stale time for dashboard metrics
  });

  // Memoized greeting based on hour
  const greeting = useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const handleRefresh = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <LoadingSpinner size="lg" />
        <Paragraph className="text-xs font-semibold text-slate-405 animate-pulse bg-transparent">Retrieving administrator telemetry...</Paragraph>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in text-left">
      {/* Welcome header card */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="text-left space-y-3.5 z-10">
          <Span className="px-3.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-500/30">
            Secure Admin Access Gate
          </Span>
          <Heading level={1} className="text-white pt-1">
            {greeting}, {user?.name || 'Administrator'}!
          </Heading>
          <Paragraph className="text-slate-400 text-xs sm:text-sm max-w-xl font-medium leading-relaxed">
            Welcome to your master Portfolio Maker control center. Modify templates, update your skills, and manage files dynamically.
          </Paragraph>
        </div>
      </div>

      {/* Analytics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-300">
          <div className="space-y-2 text-left">
            <Paragraph className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Total Projects</Paragraph>
            <Paragraph className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{stats?.totalProjects || 0}</Paragraph>
            <Link to="/admin/projects" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 inline-flex items-center group">
              <Span>Manage Items</Span>
              <ArrowRight size={12} className="ml-1 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Laptop size={24} />
          </div>
        </Card>

        <Card className="p-6 flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-300">
          <div className="space-y-2 text-left">
            <Paragraph className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Education items</Paragraph>
            <Paragraph className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{stats?.totalEducation || 0}</Paragraph>
            <Link to="/admin/education" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 inline-flex items-center group">
              <Span>Manage Education</Span>
              <ArrowRight size={12} className="ml-1 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <GraduationCap size={24} />
          </div>
        </Card>

        <Card className="p-6 flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-300">
          <div className="space-y-2 text-left">
            <Paragraph className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Certificates</Paragraph>
            <Paragraph className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{stats?.totalCertificates || 0}</Paragraph>
            <Link to="/admin/certificates" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 inline-flex items-center group">
              <Span>Manage Certs</Span>
              <ArrowRight size={12} className="ml-1 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-2xl">
            <Award size={24} />
          </div>
        </Card>

        <Card className="p-6 flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-300">
          <div className="space-y-2 text-left">
            <Paragraph className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Skills rated</Paragraph>
            <Paragraph className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{stats?.totalSkills || 0}</Paragraph>
            <Link to="/admin/about" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 inline-flex items-center group">
              <Span>Manage Skills</Span>
              <ArrowRight size={12} className="ml-1 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <Cpu size={24} />
          </div>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Actions panel */}
        <Card className="lg:col-span-5 p-6 space-y-4 text-left shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <Heading level={2} className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Quick Shortcuts</Heading>
            <Paragraph className="text-xs text-slate-400 dark:text-slate-500 leading-normal">Accelerate updates by accessing direct form models.</Paragraph>
          </div>
          
          <div className="grid grid-cols-1 gap-3 pt-4 flex-1">
            <Link
              to="/admin/projects"
              className="group flex items-center justify-between p-3.5 border border-slate-100 dark:border-slate-800 hover:border-blue-250 hover:bg-blue-50/20 dark:hover:bg-blue-955/10 rounded-xl transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg group-hover:scale-105 transition-transform duration-200">
                  <PlusCircle size={15} />
                </div>
                <Span className="text-xs font-bold text-slate-700 dark:text-slate-350">Add New Project</Span>
              </div>
              <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              to="/admin/education"
              className="group flex items-center justify-between p-3.5 border border-slate-100 dark:border-slate-800 hover:border-indigo-255 hover:bg-indigo-50/20 dark:hover:bg-indigo-955/10 rounded-xl transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg group-hover:scale-105 transition-transform duration-200">
                  <PlusCircle size={15} />
                </div>
                <Span className="text-xs font-bold text-slate-700 dark:text-slate-355">Add Education Entry</Span>
              </div>
              <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              to="/admin/cv"
              className="group flex items-center justify-between p-3.5 border border-slate-100 dark:border-slate-800 hover:border-purple-200 hover:bg-purple-50/20 dark:hover:bg-purple-955/10 rounded-xl transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-lg group-hover:scale-105 transition-transform duration-200">
                  <FileSpreadsheet size={15} />
                </div>
                <Span className="text-xs font-bold text-slate-700 dark:text-slate-350">Edit Main CV Resume</Span>
              </div>
              <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              to="/admin/settings"
              className="group flex items-center justify-between p-3.5 border border-slate-100 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-900 text-slate-500 rounded-lg group-hover:scale-105 transition-transform duration-200">
                  <Settings size={15} />
                </div>
                <Span className="text-xs font-bold text-slate-700 dark:text-slate-350">Adjust Settings Profile</Span>
              </div>
              <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>
        </Card>

        {/* Recent activities terminal logs panel */}
        <Card className="lg:col-span-7 p-6 space-y-4 text-left shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Heading level={2} className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center">
                <History size={18} className="text-slate-400 mr-2" />
                Recent Actions Audit Logs
              </Heading>
              <Paragraph className="text-xs text-slate-400">Tracking adjustments made across administrative interfaces.</Paragraph>
            </div>
            {isFetching && (
              <Span className="text-[10px] bg-slate-100 dark:bg-slate-805 text-slate-501 dark:text-slate-400 px-2 py-0.5 rounded animate-pulse font-mono font-bold">Syncing...</Span>
            )}
          </div>

          <div className="flex-1 bg-slate-950 font-mono text-[11px] text-slate-300 rounded-xl p-4 min-h-[220px] max-h-[300px] overflow-y-auto space-y-2 mt-2 leading-relaxed border border-slate-900 shadow-inner">
            {stats && stats.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((log, index) => (
                <div key={index} className="flex space-x-2 py-0.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <Span className="text-blue-400 font-bold select-none">&bull;</Span>
                  <Paragraph className="text-left select-all font-mono text-[11px] text-slate-350">{log}</Paragraph>
                </div>
              ))
            ) : (
              <Paragraph className="text-slate-500 text-xs">No recent actions logged in audit tracker.</Paragraph>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleRefresh}
              className="text-xs font-bold text-slate-550 hover:text-slate-855 dark:text-slate-400 dark:hover:text-white inline-flex items-center space-x-1.5 hover:underline focus:outline-none transition cursor-pointer"
            >
              <PlusCircle size={13} className="rotate-45" />
              <Span>Refresh logs</Span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
