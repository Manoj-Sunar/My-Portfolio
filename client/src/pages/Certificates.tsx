import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Award, Calendar, ExternalLink, ShieldCheck, Eye, X, BookOpen, Clock } from 'lucide-react';

const Certificates: React.FC = () => {
  const { certificates, isLoading } = usePortfolio();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState<any | null>(null);

  // Formatting date for human-readable display
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

  // Filtering based on search query
  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      const query = searchTerm.toLowerCase();
      return (
        cert.title.toLowerCase().includes(query) ||
        cert.issuer.toLowerCase().includes(query) ||
        (cert.credentialId && cert.credentialId.toLowerCase().includes(query))
      );
    });
  }, [certificates, searchTerm]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Skeleton Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-8 space-y-4 text-left">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-96 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
        
        {/* Skeleton Search Bar */}
        <div className="h-10 w-full max-w-md bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />

        {/* Skeleton Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
              <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 style-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left">
      {/* 1. Page Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-8 space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <Award className="text-blue-600 dark:text-blue-400" size={36} />
          <span>Professional Certifications</span>
        </h1>
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
          Validated micro-credentials, technical documents, and specialized technical licenses
        </p>
      </div>

      {/* 2. Interactive Search & Stats bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800/85 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search credentials, titles, or academies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950/40 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 transition-all"
          />
        </div>

        {/* Info label counts */}
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <ShieldCheck className="text-emerald-500" size={16} />
          <span>Showing {filteredCertificates.length} credentials total</span>
        </div>
      </div>

      {/* 3. Certificates Cards Display */}
      {filteredCertificates.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 }
            }
          }}
        >
          {filteredCertificates.map((cert) => {
            const hasImage = cert.image && cert.image.url;
            return (
              <motion.div
                key={cert.id}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="group relative flex flex-col justify-between bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-400/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div>
                  {/* Aspect Ratio Certificate Frame Panel */}
                  <div className="relative aspect-video bg-slate-100 dark:bg-slate-950/60 overflow-hidden border-b border-slate-100 dark:border-slate-900">
                    {hasImage ? (
                      <img
                        src={cert.image.url}
                        alt={cert.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-950 p-6 space-y-2">
                        <Award size={32} />
                        <span className="text-[10px] uppercase tracking-wider font-semibold">Document view not uploaded</span>
                      </div>
                    )}

                    {/* Dark Eye Overlay on hover inside Image */}
                    {hasImage && (
                      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                        <button
                          onClick={() => setSelectedCertificate(cert)}
                          className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-white text-slate-900 rounded-full text-xs font-bold shadow-md hover:scale-105 transition cursor-pointer"
                        >
                          <Eye size={13} />
                          <span>Inspect Document</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Text Information Panel */}
                  <div className="p-6 space-y-4 text-left">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950 rounded-full text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                        {cert.issuer}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {cert.title}
                      </h3>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400 md:text-[11px] font-semibold">
                      {/* Issue date */}
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} className="text-slate-400 flex-shrink-0" />
                        <span>Issued: {formatDate(cert.issueDate)}</span>
                        {cert.expiryDate && (
                          <span className="text-slate-400">
                            (Expires: {formatDate(cert.expiryDate)})
                          </span>
                        )}
                      </div>

                      {/* Credential ID */}
                      {cert.credentialId && (
                        <div className="flex items-center space-x-2">
                          <BookOpen size={14} className="text-slate-400 flex-shrink-0" />
                          <span className="truncate">ID: {cert.credentialId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-50 dark:border-slate-800/40 mt-auto">
                  {cert.credentialUrl ? (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-750 dark:hover:text-blue-300 hover:underline transition"
                    >
                      <span>Verify Credential</span>
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-wider font-semibold">Self-Certified log</span>
                  )}

                  {hasImage && (
                    <button
                      onClick={() => setSelectedCertificate(cert)}
                      className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      View Image
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950/30">
          <p className="text-slate-500 dark:text-slate-400 font-medium">No certificates or documents found.</p>
          <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">Refine your search parameters or check back later.</p>
        </div>
      )}

      {/* 4. Beautiful Full-Screen Zoom Lightbox Modal */}
      <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setSelectedCertificate(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
              aria-label="Close modal viewer"
            >
              <X size={24} />
            </button>

            <motion.div
              className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
              initial={{ scale: 0.93, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Document Image Frame */}
              <div className="flex-1 bg-slate-950 flex items-center justify-center p-3 relative min-h-[250px] md:min-h-[480px]">
                <img
                  src={selectedCertificate.image.url}
                  alt={selectedCertificate.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[75vh] w-auto max-w-full object-contain rounded shadow-lg"
                />
              </div>

              {/* Side Meta Details Panel */}
              <div className="w-full md:w-80 bg-slate-900 p-6 md:p-8 flex flex-col justify-between text-left border-t md:border-t-0 md:border-l border-slate-800">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400">
                      {selectedCertificate.issuer}
                    </span>
                    <h2 className="text-xl font-bold text-white leading-snug">
                      {selectedCertificate.title}
                    </h2>
                  </div>

                  <div className="space-y-4 text-slate-350 text-xs font-semibold">
                    <div className="flex items-center space-x-2">
                      <Clock size={16} className="text-slate-500" />
                      <span>Issued: {formatDate(selectedCertificate.issueDate)}</span>
                    </div>

                    {selectedCertificate.expiryDate && (
                      <div className="flex items-center space-x-2">
                        <Clock size={16} className="text-slate-500" />
                        <span>Expires: {formatDate(selectedCertificate.expiryDate)}</span>
                      </div>
                    )}

                    {selectedCertificate.credentialId && (
                      <div className="space-y-1">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide">Credential Identifier</div>
                        <div className="font-mono bg-slate-950 px-3 py-1.5 rounded border border-slate-850/60 break-all text-blue-300">
                          {selectedCertificate.credentialId}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Verification Trigger */}
                <div className="pt-6 border-t border-slate-800/80 mt-8 flex flex-col gap-3">
                  {selectedCertificate.credentialUrl && (
                    <a
                      href={selectedCertificate.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-1.5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                    >
                      <span>Verify Academy Records</span>
                      <ExternalLink size={13} />
                    </a>
                  )}

                  <button
                    onClick={() => setSelectedCertificate(null)}
                    className="w-full py-2 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer text-center"
                  >
                    Close Sheet Viewer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Certificates;
