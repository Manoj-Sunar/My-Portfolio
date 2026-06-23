import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { AboutSkeleton } from '../components/common/Skeleton';
import { Award, Zap, Cpu, Code, Layers, Server, Palette, Database, Cloud, HelpCircle } from 'lucide-react';

const iconMap: Record<string, any> = {
  Award,
  Zap,
  Cpu,
  Code,
  Layers,
  Server,
  Palette,
  Database,
  Cloud,
};

const About: React.FC = () => {
  const { about, cv, isLoading } = usePortfolio();

  if (isLoading) {
    return <AboutSkeleton />;
  }

  const name = cv?.personalInfo?.name || 'Sarah Dev';
  const displayTitle = about?.title || `About ${name}`;
  const displayBio = about?.content || 'Developer biography is empty. Log into admin panel to update.';

  // Format paragraphs nicely
  const bioParagraphs = displayBio.split('\n\n');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* 1. Header Display */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-8 text-left space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {displayTitle}
        </h1>
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
          Professional biography, capacities, and accolades
        </p>
      </div>

      {/* 2. Main content GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
        {/* Biography Column */}
        <div className="lg:col-span-7 space-y-6">
          {bioParagraphs.map((par, idx) => (
            <p key={idx} className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-wrap">
              {par}
            </p>
          ))}

          {/* Achievement Nodes */}
          {about?.achievements && about.achievements.length > 0 && (
            <div className="pt-8 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Key Accolades & Milestones</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {about.achievements.map((ach, index) => {
                  const IconComp = iconMap[ach.icon || 'Award'] || Award;
                  return (
                    <div
                      key={index}
                      className="p-5 border border-slate-205 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-xs hover:shadow-sm transition"
                    >
                      <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400 mb-2">
                        <IconComp size={20} />
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{ach.title}</h4>
                      </div>
                      <p className="text-xs text-slate-505 dark:text-slate-400 leading-relaxed">{ach.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Skills Sliders Side-Column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
              <Cpu size={18} className="text-blue-600 dark:text-blue-400 mr-2" />
              Technical Capabilities
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-405 leading-relaxed">
              Tested indicators of direct proficiency across core client frameworks, deployment tools, and API backend databases.
            </p>

            {about?.skills && about.skills.length > 0 ? (
              <div className="space-y-5">
                {about.skills.map((skill, idx) => {
                  const IconComp = iconMap[skill.icon || 'Code'] || Code;
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <div className="flex items-center space-x-2">
                          <IconComp size={15} className="text-slate-500 dark:text-slate-400" />
                          <span>{skill.name}</span>
                        </div>
                        <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">{skill.level}%</span>
                      </div>
                      
                      {/* Meter Slider */}
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs">
                No verified technical skills logged in database.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
