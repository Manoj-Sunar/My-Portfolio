import React, { useState, useMemo, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectsSkeleton } from '../components/common/Skeleton';
import { Laptop, Search, ExternalLink, Github, Filter, Database, Cpu, Wifi, WifiOff, X } from 'lucide-react';
import { getOptimizedProjectUrl } from '../utils/imageUtils';
import api from '../services/api';
import { ProjectType } from '../types';

const Projects: React.FC = () => {
  const { projects, isLoading } = usePortfolio();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Search execution mode: 'server' | 'client'
  // Configured to follow production standards of enterprise applications
  const [searchMode, setSearchMode] = useState<'server' | 'client'>('server');
  const [serverProjects, setServerProjects] = useState<ProjectType[]>([]);
  const [isServerSearching, setIsServerSearching] = useState<boolean>(false);
  const [dbStateInfo, setDbStateInfo] = useState<string>('');

  // Extract unique categories dynamically from initial project catalogs
  const categories = useMemo(() => {
    const list = new Set<string>();
    list.add('All');
    projects.forEach((p) => {
      if (p.category) {
        list.add(p.category);
      }
    });
    return Array.from(list);
  }, [projects]);

  // Combined search and category filtering for in-memory client execution
  const localFilteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        activeCategory === 'All' || project.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [projects, searchTerm, activeCategory]);

  // Sync server list with primary pool once loaded/updated
  useEffect(() => {
    if (projects.length > 0 && !searchTerm && activeCategory === 'All') {
      setServerProjects(projects);
    }
  }, [projects]);

  // Debounced server-side query processing effect
  useEffect(() => {
    if (searchMode === 'client') {
      return;
    }

    const triggerSearch = async () => {
      setIsServerSearching(true);
      try {
        const res = await api.get('/projects', {
          params: {
            search: searchTerm,
            category: activeCategory
          }
        });
        setServerProjects(res.data || []);
        setDbStateInfo(`Synced: found ${res.data ? res.data.length : 0} projects.`);
      } catch (err) {
        console.error('[Database Search Exception] Failed retrieving records:', err);
        setDbStateInfo('API Error: loaded local database content instead.');
        // Fallback gracefully on query error
        setServerProjects(localFilteredProjects);
      } finally {
        setIsServerSearching(false);
      }
    };

    const delayHandler = setTimeout(() => {
      triggerSearch();
    }, 400); // 400ms professional debounce to prevent unnecessary network load

    return () => clearTimeout(delayHandler);
  }, [searchTerm, activeCategory, searchMode]);

  // Display based on active mode
  const displayedProjects = searchMode === 'server' ? serverProjects : localFilteredProjects;

  if (isLoading) {
    return <ProjectsSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* 1. Header & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-8 gap-6 text-left">
        <div className="space-y-2 flex-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Selected Work
          </h1>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            A comprehensive list of web templates, APIs, and microservices
          </p>
        </div>

        {/* Search Bar Block */}
        <div className="flex flex-col xs:flex-row gap-3 w-full md:w-auto items-stretch xs:items-center shrink-0">
          <div className="relative flex-1 xs:w-80">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search projects, technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-650 dark:hover:text-slate-300 transition"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Interactive Engine Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl gap-4 text-left">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl ${searchMode === 'server' ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
            {searchMode === 'server' ? <Wifi size={18} /> : <WifiOff size={18} />}
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Search Mode:</span>
              <span className={`text-xs px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                searchMode === 'server' ? 'bg-blue-100 dark:bg-blue-950 text-blue-750 dark:text-blue-300' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {searchMode === 'server' ? 'Server API' : 'Local Cache'}
              </span>
            </p>
            <p className="text-xs text-slate-550 dark:text-slate-400 font-medium">
              {searchMode === 'server' 
                ? 'Queries live database tables using debounced client-to-server endpoints.'
                : 'Scans previously loaded projects instantly in local context memory.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto select-none shrink-0 border-t sm:border-0 border-slate-200 dark:border-slate-850 pt-3 sm:pt-0">
          <button
            type="button"
            onClick={() => setSearchMode('server')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 border ${
              searchMode === 'server'
                ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-705 text-slate-900 dark:text-white shadow-xs'
                : 'bg-transparent border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Database size={13} className="text-slate-450 dark:text-slate-400" />
            <span>Database Mode</span>
          </button>
          <button
            type="button"
            onClick={() => setSearchMode('client')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 border ${
              searchMode === 'client'
                ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-705 text-slate-900 dark:text-white shadow-xs'
                : 'bg-transparent border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Cpu size={13} className="text-slate-450 dark:text-slate-400" />
            <span>Client Memory</span>
          </button>
        </div>
      </div>

      {/* 3. Category Filter Pills */}
      {categories.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-105 dark:border-slate-805 pb-5">
          <div className="flex items-center space-x-1 px-3 py-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-md text-xs font-bold uppercase mr-2 shrink-0">
            <Filter size={11} className="mr-0.5" />
            <span>Group</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap focus:outline-none ${
                activeCategory === cat
                  ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-300 hover:bg-slate-150 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Database/API Status Line */}
      {dbStateInfo && (
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-left pb-1">
          {dbStateInfo}
        </p>
      )}

      {/* 4. Results List with Skeletons */}
      {isServerSearching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs p-6 space-y-4">
              <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
              <div className="space-y-4 text-left">
                <div className="space-y-2">
                  <div className="h-4.5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="h-3.5 w-5/6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                </div>
                <div className="flex gap-2 pt-2">
                  <div className="h-5.5 w-12 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="h-5.5 w-14 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : displayedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project) => (
            <div
              key={project.id}
              className="group flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition duration-300"
            >
              {/* Image Banner */}
              <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden border-b border-slate-100 dark:border-slate-800 shrink-0">
                {project.image?.url ? (
                  <img
                    src={getOptimizedProjectUrl(project.image.url, 600, 338)}
                    referrerPolicy="no-referrer"
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                    <Laptop size={32} />
                  </div>
                )}
                {project.featured && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-blue-600/95 dark:bg-blue-500/95 backdrop-blur-md rounded-full text-[10px] font-bold tracking-wider text-white uppercase shadow-xs">
                    ★ Featured
                  </span>
                )}
                <span className="absolute top-3 right-3 px-2 py-0.5 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-md rounded-md text-[10px] font-bold text-white tracking-widest uppercase">
                  {project.category}
                </span>
              </div>

              {/* Information Body */}
              <div className="flex-1 p-6 flex flex-col justify-between space-y-4 text-left">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Technologies Tags list */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 bg-slate-105 dark:bg-slate-800 border border-slate-200/40 dark:border-slate-705 rounded-md text-[10px] text-slate-600 dark:text-slate-350 font-bold uppercase tracking-wide"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Handles */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                      >
                        Deployment
                        <ExternalLink size={12} className="ml-1" />
                      </a>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 cursor-not-allowed">Internal App</span>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-slate-650 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white transition"
                      >
                        <Github size={12} className="mr-1" />
                        Code Repository
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 border border-dashed border-slate-205 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/30 space-y-2">
          <p className="text-slate-500 dark:text-slate-400 font-bold">No projects matched your search criteria.</p>
          <p className="text-xs text-slate-400 dark:text-slate-550">Try adjusting your active group filters, keywords, or switch execution engine.</p>
          {(searchTerm || activeCategory !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('All');
              }}
              className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-extrabold hover:underline"
            >
              Reset All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;
