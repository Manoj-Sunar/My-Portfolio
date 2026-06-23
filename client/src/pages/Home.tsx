import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Laptop, Award, Briefcase, GraduationCap, User } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useAuth } from '../context/AuthContext';
import { HomeSkeleton } from '../components/common/Skeleton';
import { getOptimizedAvatarUrl, getOptimizedProjectUrl } from '../utils/imageUtils';

const Home: React.FC = () => {
  const { about, projects, education, cv, isLoading } = usePortfolio();
  const { isAuthenticated } = useAuth();

  if (isLoading) {
    return <HomeSkeleton />;
  }

  // Filter for featured projects
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  
  // Base details fallbacks if about or CV are unpopulated
  const name = cv?.personalInfo?.name || 'Sarah Dev';
  const roleTitle = cv?.personalInfo?.title || 'Senior Full-Stack & AI Engineer';
  const summaryText = cv?.personalInfo?.summary || about?.content.substring(0, 180) + '...';

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Block */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900/30 border border-transparent dark:border-slate-800/50 rounded-3xl py-20 lg:py-28 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Headline Details */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold tracking-wider uppercase">
                <Award size={13} />
                <span>Available for elite roles</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Hey, I am <span className="text-blue-600 dark:text-blue-400">{name}</span>
              </h1>
              <p className="text-lg sm:text-xl font-medium text-slate-700 dark:text-slate-200">
                {roleTitle}
              </p>
              <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                {summaryText}
              </p>
              
              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  to="/projects"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 hover:shadow transition"
                >
                  Browse Projects
                  <ArrowRight size={16} className="ml-2" />
                </Link>
                <Link
                  to="/cv"
                  className="inline-flex items-center px-6 py-3 border border-slate-200 dark:border-slate-700 text-sm font-semibold rounded-lg text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition"
                >
                  View CV Resume
                </Link>
              </div>
            </div>

            {/* Profile Avatar Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
                {/* Visual backdrops */}
                <div className="absolute inset-0 bg-blue-100 dark:bg-blue-950/30 rounded-2xl transform rotate-6 scale-95 opacity-60"></div>
                <div className="absolute inset-0 bg-slate-900 dark:bg-slate-950 rounded-2xl transform -rotate-3 scale-95 opacity-5"></div>
                
                <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex items-center justify-center">
                  {about?.image?.url ? (
                    <img
                      src={getOptimizedAvatarUrl(about.image.url, 400)}
                      referrerPolicy="no-referrer"
                      alt={name}
                      loading="lazy"
                      className="w-full h-full object-cover transition duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-350">
                      <User size={96} strokeWidth={1} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Bento Statistics Cards */}
      <section className="bg-slate-100/55 dark:bg-slate-900/20 border-y border-slate-200/50 dark:border-slate-800/80 py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
                <Laptop size={24} />
              </div>
              <div className="text-left">
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{projects?.length || 0}</p>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Completed Projects</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <GraduationCap size={24} />
              </div>
              <div className="text-left">
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{education?.length || 0}</p>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Education Timelines</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <Award size={24} />
              </div>
              <div className="text-left">
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{about?.skills?.length || 0}</p>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Technical Skills</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-lg">
                <Briefcase size={24} />
              </div>
              <div className="text-left">
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {cv?.sections?.find((s) => s.title.toLowerCase().includes('experience') || s.title.toLowerCase().includes('employment'))?.items?.length || 4}
                </p>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {cv?.sections?.find((s) => s.title.toLowerCase().includes('experience') || s.title.toLowerCase().includes('employment'))?.items?.length ? 'Professional Roles' : 'Months Experience'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Projects Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-2 text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Featured Projects</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl">
              An elegant visual subset of core technical code, applications, and sound integrations I have designed.
            </p>
          </div>
          <Link
            to="/projects"
            className="group inline-flex items-center mt-4 md:mt-0 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-750 dark:hover:text-blue-300 transition"
          >
            See all projects
            <ArrowRight size={16} className="ml-1 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

        {featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition duration-300"
              >
                {/* Image panel */}
                <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden border-b border-slate-100 dark:border-slate-800">
                  {project.image?.url ? (
                    <img
                      src={getOptimizedProjectUrl(project.image.url, 600, 338)}
                      referrerPolicy="no-referrer"
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                      <Laptop size={32} />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md rounded-full text-[10px] font-bold tracking-wider text-white uppercase">
                    {project.category}
                  </span>
                </div>

                {/* Information details */}
                <div className="flex-1 p-6 flex flex-col justify-between space-y-4 text-left">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Tech categories */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[11px] text-slate-600 dark:text-slate-350 font-medium">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800/40 rounded-md text-[11px] text-slate-400 dark:text-slate-550 font-medium">
                          +{project.technologies.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Footer query links */}
                    <div className="pt-2 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                        >
                          Launch App
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                        >
                          Source Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/20">
            <p className="text-slate-500 dark:text-slate-400 font-medium">No projects added yet.</p>
            {isAuthenticated && (
              <Link to="/admin/projects" className="mt-2 text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline">
                Add your first project
              </Link>
            )}
          </div>
        )}
      </section>

      {/* 4. Elegant CTA Block */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-950 dark:bg-slate-900 rounded-2xl p-8 sm:p-12 lg:p-16 text-center text-white border border-transparent dark:border-slate-800 space-y-6 relative overflow-hidden">
          {/* Ambient vector circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
            Interested in working together or hiring an architect?
          </h2>
          <p className="text-slate-400 dark:text-slate-300 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Download my printable CV or review completed code repositories. Feel free to contact me directly!
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/cv"
              className="w-full sm:w-auto px-6 py-3 bg-white text-slate-950 font-bold rounded-lg hover:bg-slate-100 transition shadow-sm text-sm"
            >
              Get Resume
            </Link>
            {cv?.personalInfo?.email && (
              <a
                href={`mailto:${cv.personalInfo.email}`}
                className="w-full sm:w-auto px-6 py-3 border border-slate-800 dark:border-slate-700 text-slate-300 font-bold rounded-lg hover:bg-slate-900/50 hover:text-white transition text-sm"
              >
                Send Message
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
