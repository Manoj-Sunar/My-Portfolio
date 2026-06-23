import React from 'react';

// Base pulse skeleton brick
export const SkeletonBlock: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
  );
};

// Beautiful skeletal pages mimicking real content layouts

/**
 * 1. Home Skeleton Loader
 */
export const HomeSkeleton: React.FC = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline blocks */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <SkeletonBlock className="h-6 w-44 rounded-full" />
              {/* Giant Name Headline */}
              <div className="space-y-3">
                <SkeletonBlock className="h-10 sm:h-12 w-3/4 rounded-lg" />
                <SkeletonBlock className="h-10 sm:h-12 w-1/2 rounded-lg" />
              </div>
              {/* Subheading */}
              <SkeletonBlock className="h-6 w-2/3 rounded-md" />
              {/* Description paragraphs */}
              <div className="space-y-2">
                <SkeletonBlock className="h-4 w-full rounded" />
                <SkeletonBlock className="h-4 w-11/12 rounded" />
                <SkeletonBlock className="h-4 w-5/6 rounded" />
              </div>
              {/* CTA buttons */}
              <div className="pt-4 flex flex-wrap gap-4">
                <SkeletonBlock className="h-11 w-36 rounded-lg" />
                <SkeletonBlock className="h-11 w-36 rounded-lg" />
              </div>
            </div>

            {/* Right Profile Avatar frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
                <div className="absolute inset-0 bg-slate-100 rounded-2xl transform rotate-3 scale-95 opacity-60 animate-pulse"></div>
                <div className="absolute inset-0 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-center p-4">
                  <div className="w-full h-full bg-slate-200 rounded-xl animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Statistics Grid */}
      <section className="bg-slate-50 border-y border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-4">
                <div className="p-3 bg-slate-100 rounded-lg h-12 w-12 animate-pulse shrink-0" />
                <div className="space-y-2 flex-1">
                  <SkeletonBlock className="h-7 w-12 rounded" />
                  <SkeletonBlock className="h-3 w-28 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects header & list */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-3 text-left">
            <SkeletonBlock className="h-8 w-56 rounded-md" />
            <SkeletonBlock className="h-4 w-80 sm:w-96 rounded" />
          </div>
          <SkeletonBlock className="h-5 w-28 rounded md:mt-0 mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
              <div className="relative aspect-video bg-slate-200 animate-pulse" />
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <SkeletonBlock className="h-5 w-5/6 rounded" />
                  <div className="space-y-1.5">
                    <SkeletonBlock className="h-3.5 w-full rounded" />
                    <SkeletonBlock className="h-3.5 w-full rounded" />
                    <SkeletonBlock className="h-3.5 w-2/3 rounded" />
                  </div>
                </div>
                <div className="flex gap-1.5 pt-2">
                  <SkeletonBlock className="h-5 w-12 rounded-md" />
                  <SkeletonBlock className="h-5 w-14 rounded-md" />
                  <SkeletonBlock className="h-5 w-16 rounded-md" />
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between">
                  <SkeletonBlock className="h-4 w-20 rounded" />
                  <SkeletonBlock className="h-4 w-24 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

/**
 * 2. Projects Skeleton Loader
 */
export const ProjectsSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 pb-8 gap-4">
        <div className="space-y-3 text-left">
          <SkeletonBlock className="h-9 w-48 rounded" />
          <SkeletonBlock className="h-4.5 w-80 sm:w-96 rounded" />
        </div>
        {/* Search input skeleton */}
        <SkeletonBlock className="h-10 w-full md:w-80 rounded-lg" />
      </div>

      {/* Category Pills skeleton */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
        <SkeletonBlock className="h-6 w-20 rounded-md" />
        <SkeletonBlock className="h-7 w-12 rounded-full" />
        <SkeletonBlock className="h-7 w-20 rounded-full" />
        <SkeletonBlock className="h-7 w-24 rounded-full" />
        <SkeletonBlock className="h-7 w-16 rounded-full" />
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
            <div className="relative aspect-video bg-slate-200 animate-pulse" />
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <SkeletonBlock className="h-5 w-4/5 rounded" />
                <div className="space-y-1.5">
                  <SkeletonBlock className="h-3.5 w-full rounded" />
                  <SkeletonBlock className="h-3.5 w-full rounded" />
                  <SkeletonBlock className="h-3.5 w-3/4 rounded" />
                </div>
              </div>
              <div className="flex gap-1.5 pt-2">
                <SkeletonBlock className="h-5 w-14 rounded-md" />
                <SkeletonBlock className="h-5 w-16 rounded-md" />
                <SkeletonBlock className="h-5 w-12 rounded-md" />
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between">
                <SkeletonBlock className="h-4 w-20 rounded" />
                <SkeletonBlock className="h-4 w-24 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 3. Education Skeleton Loader
 */
export const EducationSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header Info */}
      <div className="border-b border-slate-100 pb-8 text-left space-y-3">
        <SkeletonBlock className="h-9 w-64 rounded" />
        <SkeletonBlock className="h-4.5 w-80 sm:w-[450px] rounded" />
      </div>

      {/* Timeline Tree Nodes */}
      <div className="relative border-l border-slate-200 ml-4 md:ml-8 space-y-12 pb-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative pl-8 sm:pl-10 text-left">
            {/* Bullet node mock */}
            <div className="absolute -left-3.5 top-0 flex bg-slate-100 border border-slate-300 rounded-full w-7 h-7 animate-pulse shrink-0" />

            {/* Box card */}
            <div className="space-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <SkeletonBlock className="h-4.5 w-44 rounded-md" />
              <div className="space-y-2">
                <SkeletonBlock className="h-6 w-3/4 sm:w-2/3 rounded" />
                <SkeletonBlock className="h-5 w-1/2 sm:w-2/5 rounded" />
              </div>
              <SkeletonBlock className="h-5 w-20 rounded" />
              <div className="space-y-1.5 pt-1">
                <SkeletonBlock className="h-3.5 w-full rounded" />
                <SkeletonBlock className="h-3.5/12 w-11/12 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 4. About Skeleton Loader
 */
export const AboutSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header Info */}
      <div className="border-b border-slate-100 pb-8 text-left space-y-3">
        <SkeletonBlock className="h-9 w-52 rounded" />
        <SkeletonBlock className="h-4.5 w-80 sm:w-96 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
        {/* Left Column: Bio & Accolades */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2.5">
            <SkeletonBlock className="h-4 w-full rounded" />
            <SkeletonBlock className="h-4 w-full rounded" />
            <SkeletonBlock className="h-4 w-11/12 rounded" />
            <SkeletonBlock className="h-4 w-5/6 rounded" />
          </div>
          <div className="space-y-2.5 pt-4">
            <SkeletonBlock className="h-4 w-full rounded" />
            <SkeletonBlock className="h-4 w-full rounded" />
            <SkeletonBlock className="h-4 w-10/12 rounded" />
          </div>

          {/* Key Achievements Grid */}
          <div className="pt-8 space-y-6">
            <SkeletonBlock className="h-6 w-56 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-5 border border-slate-200 rounded-xl bg-white space-y-3">
                  <div className="flex items-center space-x-3">
                    <SkeletonBlock className="h-5 w-5 rounded-md animate-pulse" />
                    <SkeletonBlock className="h-4 w-32 rounded" />
                  </div>
                  <SkeletonBlock className="h-3 w-11/12 rounded" />
                  <SkeletonBlock className="h-3 w-5/6 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Skills */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
            <SkeletonBlock className="h-6 w-44 rounded" />
            <SkeletonBlock className="h-3 w-full rounded" />

            <div className="space-y-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <SkeletonBlock className="h-4 w-28 rounded" />
                    <SkeletonBlock className="h-4 w-8 rounded" />
                  </div>
                  <SkeletonBlock className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 5. CV Skeleton Loader
 */
export const CVSkeleton: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toolbar strip mockup */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-100 pb-4">
        <div className="flex gap-2">
          <SkeletonBlock className="h-8 w-20 rounded-md" />
          <SkeletonBlock className="h-8 w-20 rounded-md" />
          <SkeletonBlock className="h-8 w-20 rounded-md" />
        </div>
        <div className="flex gap-2">
          <SkeletonBlock className="h-9 w-28 rounded-md" />
          <SkeletonBlock className="h-9 w-28 rounded-md" />
        </div>
      </div>

      {/* Styled CV Card mockup */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8 sm:p-12 space-y-8 text-left">
        {/* Header (Primary summary info) */}
        <div className="flex flex-col md:flex-row justify-between items-start border-b border-slate-200 pb-8 gap-6">
          <div className="space-y-2.5 flex-1 w-full">
            <SkeletonBlock className="h-9 w-2/3 max-w-sm rounded" />
            <SkeletonBlock className="h-5.5 w-1/2 max-w-xs rounded" />
            <SkeletonBlock className="h-4.5 w-11/12 rounded" />
          </div>
          <div className="space-y-2 w-full md:w-52 shrink-0">
            <SkeletonBlock className="h-4 w-full rounded" />
            <SkeletonBlock className="h-4 w-full rounded" />
            <SkeletonBlock className="h-4 w-full rounded" />
            <SkeletonBlock className="h-4 w-2/3 rounded" />
          </div>
        </div>

        {/* Experience Sections mock */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
          <div className="md:col-span-8 space-y-8">
            <div className="space-y-4">
              <SkeletonBlock className="h-6 w-36 rounded" />
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <SkeletonBlock className="h-5 w-1/2 rounded" />
                      <SkeletonBlock className="h-4 w-20 rounded" />
                    </div>
                    <SkeletonBlock className="h-4 w-1/3 rounded" />
                    <SkeletonBlock className="h-3 w-full rounded" />
                    <SkeletonBlock className="h-3 w-11/12 rounded" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
              <SkeletonBlock className="h-6 w-32 rounded" />
              <div className="space-y-4">
                <div className="space-y-2">
                  <SkeletonBlock className="h-5 w-2/3 rounded" />
                  <SkeletonBlock className="h-4 w-1/3 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar details mock */}
          <div className="md:col-span-4 space-y-8 border-t md:border-t-0 md:border-l border-slate-200 pt-8 md:pt-0 md:pl-8">
            <div className="space-y-4">
              <SkeletonBlock className="h-6 w-24 rounded" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-1.5">
                    <SkeletonBlock className="h-4 w-32 rounded" />
                    <SkeletonBlock className="h-3 w-full rounded" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <SkeletonBlock className="h-6 w-28 rounded" />
              <div className="flex flex-wrap gap-1.5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <SkeletonBlock key={i} className="h-5.5 w-14 rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
