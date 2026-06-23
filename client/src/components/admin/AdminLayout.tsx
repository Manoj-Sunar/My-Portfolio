import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getOptimizedAvatarUrl } from '../../utils/imageUtils';
import {
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  Award,
  User,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Manage Projects', path: '/admin/projects', icon: Briefcase },
    { label: 'Manage Education', path: '/admin/education', icon: GraduationCap },
    { label: 'Manage Certificates', path: '/admin/certificates', icon: Award },
    { label: 'Manage About', path: '/admin/about', icon: User },
    { label: 'Manage Resume CV', path: '/admin/cv', icon: FileText },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* 1. Mobile top-bar (hides on desktop) */}
      <header className="flex md:hidden items-center justify-between px-6 h-16 bg-slate-900 text-white w-full border-b border-slate-800 z-50">
        <Link to="/admin/dashboard" className="text-md font-bold tracking-tight">
          Manoj<span className="text-blue-500">.</span>Admin
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg transition"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* 2. Admin Sidebar (Desktop sidebar / mobile navigation slide-in overlay) */}
      <aside
        className={`fixed inset-y-0 left-0 bg-slate-950 text-slate-400 w-64 p-6 flex flex-col justify-between border-r border-slate-900 z-40 transition-all duration-300 md:translate-x-0 md:relative ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-8">
          {/* Brand header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-900/60">
            <Link to="/" className="text-lg font-bold text-white tracking-widest uppercase">
              MANOJ<span className="text-blue-500">.</span>CMS
            </Link>
          </div>

          {/* User profile capsule card */}
          {user && (
            <div className="flex items-center space-x-3 bg-slate-900/65 border border-slate-850/60 p-3 rounded-xl">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-800 flex-shrink-0">
                {user.profileImage?.url ? (
                  <img src={getOptimizedAvatarUrl(user.profileImage.url, 100)} referrerPolicy="no-referrer" alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">
                    <User size={16} />
                  </div>
                )}
              </div>
              <div className="text-left overflow-hidden min-w-0">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 truncate font-semibold">{user.email}</p>
              </div>
            </div>
          )}

          {/* Sidebar Nav anchors */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight size={12} className="opacity-40" />
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout action */}
        <div className="pt-6 border-t border-slate-905">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/10 w-full transition cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* 3. Main Dashboard Outlet container */}
      <main className="flex-1 overflow-y-auto px-6 py-8 md:p-10 text-left">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
