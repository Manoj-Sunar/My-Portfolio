import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { CVSkeleton } from '../components/common/Skeleton';
import {
  FileText,
  Printer,
  Download,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  User,
  Link as LinkIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';

const CV: React.FC = () => {
  const { cv, isLoading } = usePortfolio();

  if (isLoading) return <CVSkeleton />;
  if (!cv) {
    return (
      <div className="text-center py-20 bg-slate-50 border border-dashed rounded-xl">
        <p className="text-slate-500 font-medium">CV profile configurations unpopulated in database.</p>
      </div>
    );
  }

  const { personalInfo, sections, skills, languages, references } = cv;

  // -------- PDF generation (unchanged, but we keep it for completeness) --------
  const handleDownloadPDF = () => {
    // ... (the same PDF generation logic as before, you may keep it as is)
    // For brevity, we omit the full function here; it remains identical to the original.
    // In practice, you would copy the entire PDF generation function.
    // Since we are enhancing the UI, we keep the PDF logic unchanged.
    // If you want to enhance the PDF as well, you would need to adapt it accordingly.
    // We'll keep it as is to avoid breaking existing functionality.
    try {
      const buildPDF = (scale: number) => {
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 12 * scale;
        const usableWidth = pageWidth - margin * 2;
        let y = margin;

        // ---- Name ----
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20 * scale);
        doc.setTextColor(15, 23, 42);
        doc.text(personalInfo.name || 'Manoj Sunar', margin, y);
        y += 8 * scale;

        // ---- Title + contacts ----
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10 * scale);
        doc.setTextColor(37, 99, 235);
        const title = personalInfo.title || 'Full Stack Developer';
        const contacts = [
          personalInfo.address,
          personalInfo.phone,
          personalInfo.email,
          personalInfo.website?.replace(/^https?:\/\//i, '') || ''
        ].filter(Boolean).join(' | ');
        const headerLine = `${title}  |  ${contacts}`;
        const wrappedHeader = doc.splitTextToSize(headerLine, usableWidth);
        wrappedHeader.forEach((line: string) => {
          doc.text(line, margin, y);
          y += 5 * scale;
        });
        y += 2 * scale;

        // ---- Summary ----
        if (personalInfo.summary) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5 * scale);
          doc.setTextColor(71, 85, 105);
          const summaryLines = doc.splitTextToSize(personalInfo.summary, usableWidth);
          summaryLines.forEach((line: string) => {
            doc.text(line, margin, y);
            y += 4 * scale;
          });
          y += 2 * scale;
        }

        // ---- Core Skills ----
        if (skills && skills.length > 0) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11 * scale);
          doc.setTextColor(15, 23, 42);
          doc.text('CORE SKILLS', margin, y);
          y += 4 * scale;
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.2 * scale);
          doc.line(margin, y, pageWidth - margin, y);
          y += 4 * scale;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8 * scale);
          doc.setTextColor(51, 65, 85);
          skills.forEach((cat) => {
            const line = `${cat.category}: ${cat.items.join(', ')}`;
            const lines = doc.splitTextToSize(line, usableWidth);
            lines.forEach((l: string) => {
              doc.text(l, margin, y);
              y += 3.8 * scale;
            });
          });
          y += 2 * scale;
        }

        // ---- Sections ----
        if (sections && sections.length > 0) {
          sections.forEach((section) => {
            y += 2 * scale;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11 * scale);
            doc.setTextColor(15, 23, 42);
            doc.text(section.title.toUpperCase(), margin, y);
            y += 4 * scale;
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.2 * scale);
            doc.line(margin, y, pageWidth - margin, y);
            y += 4 * scale;

            if (section.items && section.items.length > 0) {
              section.items.forEach((item) => {
                // Title + Subtitle (left), Date (right)
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9 * scale);
                doc.setTextColor(15, 23, 42);
                let headerText = item.title;
                if (item.subtitle) headerText += ` — ${item.subtitle}`;
                const headerWidth = doc.getTextWidth(headerText);
                const dateText = item.date || '';
                const dateWidth = doc.getTextWidth(dateText);
                if (headerWidth + dateWidth + 4 < usableWidth) {
                  doc.text(headerText, margin, y);
                  if (dateText) {
                    doc.text(dateText, pageWidth - margin, y, { align: 'right' });
                  }
                  y += 4.5 * scale;
                } else {
                  doc.text(headerText, margin, y);
                  y += 4.5 * scale;
                  if (dateText) {
                    doc.setFont('helvetica', 'italic');
                    doc.setFontSize(8 * scale);
                    doc.setTextColor(100, 116, 139);
                    doc.text(dateText, margin, y);
                    y += 4 * scale;
                  }
                }

                if (item.description) {
                  doc.setFont('helvetica', 'normal');
                  doc.setFontSize(8 * scale);
                  doc.setTextColor(71, 85, 105);
                  const descLines = doc.splitTextToSize(item.description, usableWidth);
                  descLines.forEach((line: string) => {
                    doc.text(line, margin, y);
                    y += 3.8 * scale;
                  });
                }

                if (item.highlights) {
                  doc.setFont('helvetica', 'normal');
                  doc.setFontSize(8 * scale);
                  doc.setTextColor(71, 85, 105);
                  const bullets = item.highlights.split('\n').filter((b: string) => b.trim());
                  bullets.forEach((bullet: string) => {
                    const trimmed = bullet.replace(/^[•\s\-*]+/, '').trim();
                    if (!trimmed) return;
                    const bulletLines = doc.splitTextToSize(`• ${trimmed}`, usableWidth - 4);
                    bulletLines.forEach((line: string) => {
                      doc.text(line, margin + 4, y);
                      y += 3.6 * scale;
                    });
                  });
                }

                y += 2 * scale;
              });
            }
          });
        }

        // ---- Languages & References ----
        if ((languages && languages.length > 0) || (references && references.length > 0)) {
          y += 4 * scale;
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11 * scale);
          doc.setTextColor(15, 23, 42);
          doc.text('ADDITIONAL', margin, y);
          y += 4 * scale;
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.2 * scale);
          doc.line(margin, y, pageWidth - margin, y);
          y += 4 * scale;

          const colWidth = usableWidth / 2 - 4;
          let leftY = y;
          let rightY = y;

          if (languages && languages.length > 0) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9 * scale);
            doc.setTextColor(15, 23, 42);
            doc.text('Languages', margin, leftY);
            leftY += 4 * scale;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8 * scale);
            doc.setTextColor(71, 85, 105);
            languages.forEach((lang) => {
              doc.text(`${lang.name} — ${lang.level}`, margin, leftY);
              leftY += 3.8 * scale;
            });
          }

          if (references && references.length > 0) {
            const refX = margin + colWidth + 8;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9 * scale);
            doc.setTextColor(15, 23, 42);
            doc.text('References', refX, rightY);
            rightY += 4 * scale;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8 * scale);
            doc.setTextColor(71, 85, 105);
            references.forEach((ref) => {
              doc.text(ref.name, refX, rightY);
              rightY += 3.8 * scale;
              doc.text(`${ref.position} — ${ref.company}`, refX, rightY);
              rightY += 3.8 * scale;
              doc.text(ref.contact, refX, rightY);
              rightY += 3.8 * scale;
            });
          }

          y = Math.max(leftY, rightY);
        }

        return { doc, endY: y, margin };
      };

      const measure = buildPDF(1.0);
      const totalHeight = measure.endY;
      const pageHeight = 297;
      const margin = measure.margin;
      const availableHeight = pageHeight - margin * 2;

      let scale = 1.0;
      if (totalHeight > availableHeight) {
        scale = availableHeight / totalHeight;
        if (scale < 0.55) scale = 0.55;
      }

      const final = buildPDF(scale);
      const fileName = (personalInfo.name || 'cv').toLowerCase().replace(/\s+/g, '_');
      final.doc.save(`${fileName}_cv.pdf`);
      toast.success('CV exported as single page!');
    } catch (err) {
      console.error(err);
      toast.error('PDF export failed. Use Print > Save as PDF instead.');
    }
  };

  const handlePrint = () => {
    toast.success('Opening print interface…');
    setTimeout(() => window.print(), 500);
  };

  // -------- Enhanced Screen Render --------
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 print:p-0 print:m-0">
      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 print:hidden shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">CV</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Print or download as PDF</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-lg shadow transition"
          >
            <Download size={13} className="mr-1.5" /> Download PDF
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-950 text-xs font-bold text-white rounded-lg shadow transition"
          >
            <Printer size={13} className="mr-1.5" /> Print CV
          </button>
        </div>
      </div>

      {/* CV Content */}
      <div
        id="printable-cv"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 print:border-none print:p-0 print:shadow-none shadow-lg"
      >
        {/* Header: Name & Title */}
        <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {personalInfo.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-base font-semibold text-blue-600 dark:text-blue-400">
            <span>{personalInfo.title}</span>
            <span className="hidden sm:inline text-slate-400 dark:text-slate-500 font-normal">|</span>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-normal text-slate-600 dark:text-slate-300">
              {personalInfo.address && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-slate-400 dark:text-slate-500" />
                  <span>{personalInfo.address}</span>
                </span>
              )}
              {personalInfo.phone && (
                <a
                  href={`tel:${personalInfo.phone}`}
                  className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Phone size={14} className="text-slate-400 dark:text-slate-500" />
                  <span>{personalInfo.phone}</span>
                </a>
              )}
              {personalInfo.email && (
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Mail size={14} className="text-slate-400 dark:text-slate-500" />
                  <span>{personalInfo.email}</span>
                </a>
              )}
              {personalInfo.website && (
                <a
                  href={personalInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Globe size={14} className="text-slate-400 dark:text-slate-500" />
                  <span>{personalInfo.website.replace(/^https?:\/\//i, '')}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="py-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line border-b border-slate-200 dark:border-slate-700">
            {personalInfo.summary}
          </div>
        )}

        {/* Core Skills */}
        {skills && skills.length > 0 && (
          <div className="py-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Award size={16} className="text-blue-600 dark:text-blue-400" /> Core Skills
            </h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700 dark:text-slate-300">
              {skills.map((cat, idx) => (
                <div key={idx} className="flex flex-wrap items-baseline gap-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{cat.category}:</span>
                  <span className="text-slate-600 dark:text-slate-400">{cat.items.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sections (Experience, Education, etc.) */}
        {sections && sections.length > 0 && (
          <div className="py-6 space-y-8">
            {sections.map((section) => (
              <div key={section.id}>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                  {section.title.toLowerCase().includes('experience') && <Briefcase size={16} className="text-blue-600 dark:text-blue-400" />}
                  {section.title.toLowerCase().includes('education') && <GraduationCap size={16} className="text-blue-600 dark:text-blue-400" />}
                  {!section.title.toLowerCase().includes('experience') && !section.title.toLowerCase().includes('education') && <User size={16} className="text-blue-600 dark:text-blue-400" />}
                  {section.title}
                </h2>
                <div className="mt-4 space-y-6">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex flex-wrap items-baseline justify-between">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {item.title}
                          {item.subtitle && (
                            <span className="font-semibold text-slate-600 dark:text-slate-400">
                              {' — '}{item.subtitle}
                            </span>
                          )}
                        </h3>
                        {item.date && (
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                            {item.date}
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                          {item.description}
                        </p>
                      )}

                      {item.highlights && (
                        <ul className="list-disc pl-5 space-y-0.5 text-sm text-slate-600 dark:text-slate-300">
                          {item.highlights.split('\n').map((line, hidx) => {
                            const trimmed = line.replace(/^[•\s\-*]+/, '').trim();
                            if (!trimmed) return null;
                            return <li key={hidx}>{trimmed}</li>;
                          })}
                        </ul>
                      )}

                      {item.skills && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.skills.split(',').map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wide"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages & References */}
        {(languages?.length > 0 || references?.length > 0) && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-slate-200 dark:border-slate-700 pt-6">
            {languages?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Globe size={14} className="text-blue-600 dark:text-blue-400" /> Languages
                </h3>
                <div className="mt-3 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  {languages.map((lang, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 py-1">
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-400">
                        {lang.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {references?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <LinkIcon size={14} className="text-blue-600 dark:text-blue-400" /> References
                </h3>
                <div className="mt-3 space-y-4 text-sm text-slate-700 dark:text-slate-300">
                  {references.map((ref, i) => (
                    <div key={i} className="border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0">
                      <p className="font-semibold text-slate-900 dark:text-white">{ref.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {ref.position} — {ref.company}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{ref.contact}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CV;