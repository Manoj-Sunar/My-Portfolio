import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { EducationSkeleton } from '../components/common/Skeleton';
import { GraduationCap, Calendar, Award } from 'lucide-react';

const Education: React.FC = () => {
  const { education, isLoading } = usePortfolio();

  if (isLoading) {
    return <EducationSkeleton />;
  }

  // Ensure chronological order
  const sortedEducation = [...education].sort((a, b) => a.order - b.order);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2] || 15));
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-8 text-left space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Education & Credentials
        </h1>
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
          Formal academic training, research, and degree accomplishments
        </p>
      </div>

      {sortedEducation.length > 0 ? (
        // Timeline Tree
        <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 md:ml-8 space-y-12 pb-12">
          {sortedEducation.map((edu, idx) => {
            const start = formatDate(edu.startDate);
            const end = edu.isCurrent ? 'Present' : formatDate(edu.endDate);

            return (
              <div key={edu.id} className="relative pl-8 sm:pl-10 text-left">
                {/* Visual node bullet */}
                <div className="absolute -left-3.5 top-0 flex items-center justify-center bg-blue-50 dark:bg-blue-950 border border-blue-600 dark:border-blue-450 text-blue-600 dark:text-blue-400 rounded-full w-7 h-7 shadow-xs">
                  <GraduationCap size={14} />
                </div>

                <div className="space-y-3 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition duration-200">
                  {/* Meta date */}
                  <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <Calendar size={13} />
                    <span>
                      {start} &mdash; {end}
                    </span>
                  </div>

                  {/* Degree info */}
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {edu.degree} in {edu.field}
                    </h2>
                    <p className="text-md font-semibold text-slate-705 dark:text-slate-300">
                      {edu.institution}
                    </p>
                  </div>

                  {/* Grade flag */}
                  {edu.grade && (
                    <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 rounded-md text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                      <Award size={11} />
                      <span>{edu.grade}</span>
                    </div>
                  )}

                  {/* Body description */}
                  {edu.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl font-normal">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/30">
          <p className="text-slate-500 dark:text-slate-400 font-medium">No education entries found.</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Please log into the admin panel to update your timeline.</p>
        </div>
      )}
    </div>
  );
};

export default Education;
