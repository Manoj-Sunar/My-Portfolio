import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

const Footer: React.FC = () => {
  const { cv } = usePortfolio();
  
  const socialData = cv?.personalInfo;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-12 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 text-center md:text-left">
          {/* Brand */}
          <div className="space-y-2">
            <Link to="/" className="text-lg font-bold text-slate-900 dark:text-white">
              Manoj<span className="text-blue-600">.</span>Ai<span className="text-blue-600">.</span>Dev
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              Modular full-stack professional portfolio & resume builder. Hand-crafted layouts with Tailwind CMS.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-slate-100 dark:border-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-250 dark:hover:border-slate-705 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <Github size={18} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-slate-100 dark:border-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-250 dark:hover:border-slate-705 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-slate-100 dark:border-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-250 dark:hover:border-slate-705 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <Twitter size={18} />
            </a>
            {socialData?.email && (
              <a
                href={`mailto:${socialData.email}`}
                className="p-2 border border-slate-100 dark:border-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-250 dark:hover:border-slate-705 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <Mail size={18} />
              </a>
            )}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <p>&copy; {currentYear} Manoj Ai Dev. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/login" className="hover:text-slate-800 dark:hover:text-slate-200 transition">
              Administrator Access
            </Link>
            <a href="https://ais-dev-rh4i3bmcykzklgv376fvx2-824326841130.asia-southeast1.run.app" className="hover:text-slate-800 dark:hover:text-slate-200 transition">
              App Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
