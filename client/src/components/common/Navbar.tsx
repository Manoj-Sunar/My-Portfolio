import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, User, Briefcase, FileText, GraduationCap, Laptop, Sun, Moon, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isLinkActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { label: 'Home', path: '/', icon: Laptop },
    { label: 'About', path: '/about', icon: User },
    { label: 'Projects', path: '/projects', icon: Briefcase },
    { label: 'Education', path: '/education', icon: GraduationCap },
    { label: 'Certificates', path: '/certificates', icon: Award },
    { label: 'Resume', path: '/cv', icon: FileText },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 hover:text-blue-600 dark:hover:text-blue-400 transition">
              Manoj<span className="text-blue-600">.</span>Ai<span className="text-blue-600">.</span>Dev
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isLinkActive(link.path)
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={16} className="mr-1.5" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Options / Dashboard Switch */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

         
          </div>

          {/* Mobile responsive toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Mobile Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-none"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Links Overlay */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
          <div className="px-2 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg text-base font-semibold transition ${
                    isLinkActive(link.path)
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={18} className="mr-3 text-slate-450 dark:text-slate-400" />
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 px-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-2.5 text-base font-bold text-white bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg hover:bg-slate-800 transition"
                  >
                    <LayoutDashboard size={16} className="mr-2" />
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex justify-center w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 text-base font-bold text-slate-700 dark:text-slate-300 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    Logout Session
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-750 text-base font-bold text-white rounded-lg transition"
                >
                  Admin Login Gate
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
