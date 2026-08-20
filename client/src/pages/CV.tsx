import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { CVSkeleton } from '../components/common/Skeleton';
import { FileText, Printer, Download } from 'lucide-react';
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

  // -------- PDF generation – single page with auto‑scaling and line wrapping --------
  const handleDownloadPDF = () => {
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

        // ---- Title + contacts (one line – split if too long) ----
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
        // Wrap if too long
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

        // ---- Sections (Experience, Education, etc.) ----
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
                // Title + Subtitle (left), Date (right) – wrap if needed
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9 * scale);
                doc.setTextColor(15, 23, 42);
                let headerText = item.title;
                if (item.subtitle) headerText += ` — ${item.subtitle}`;
                // We'll split the header to allow wrapping, but we want date on right
                // So we draw title left and date right separately
                const headerWidth = doc.getTextWidth(headerText);
                const dateText = item.date || '';
                const dateWidth = doc.getTextWidth(dateText);
                // If both fit on one line
                if (headerWidth + dateWidth + 4 < usableWidth) {
                  doc.text(headerText, margin, y);
                  if (dateText) {
                    doc.text(dateText, pageWidth - margin, y, { align: 'right' });
                  }
                  y += 4.5 * scale;
                } else {
                  // Put date on next line if needed
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

                // Description
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

                // Highlights (bullets)
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

                y += 2 * scale; // spacing between items
              });
            }
          });
        }

        // ---- Languages & References (if present) ----
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

      // Measure at scale=1.0
      const measure = buildPDF(1.0);
      const totalHeight = measure.endY;
      const pageHeight = 297;
      const margin = measure.margin;
      const availableHeight = pageHeight - margin * 2;

      let scale = 1.0;
      if (totalHeight > availableHeight) {
        scale = availableHeight / totalHeight;
        if (scale < 0.55) scale = 0.55; // keep minimum readability
      }

      // Build final PDF with computed scale
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

  // -------- Screen render (exactly the same layout) --------
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 print:p-0 print:m-0">
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

      <div
        id="printable-cv"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 print:border-none print:p-0 print:shadow-none shadow-sm"
      >
        <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {personalInfo.name}
          </h1>
          <div className="mt-1 text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400">
            {personalInfo.title}
            <span className="text-slate-400 dark:text-slate-500 font-normal mx-2">|</span>
            <span className="text-slate-600 dark:text-slate-300 font-normal">
              {[
                personalInfo.address,
                personalInfo.phone,
                personalInfo.email,
                personalInfo.website?.replace(/^https?:\/\//i, '')
              ].filter(Boolean).join(' | ')}
            </span>
          </div>
        </div>

        {personalInfo.summary && (
          <div className="py-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {personalInfo.summary}
          </div>
        )}

        {skills && skills.length > 0 && (
          <div className="py-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide border-b border-slate-200 dark:border-slate-700 pb-2">
              Core Skills
            </h2>
            <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {skills.map((cat, idx) => (
                <p key={idx}>
                  <span className="font-semibold">{cat.category}:</span>{' '}
                  {cat.items.join(', ')}
                </p>
              ))}
            </div>
          </div>
        )}

        {sections && sections.length > 0 && (
          <div className="space-y-8 pt-4">
            {sections.map((section) => (
              <div key={section.id}>
                <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide border-b border-slate-200 dark:border-slate-700 pb-2">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-6">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex flex-wrap items-baseline justify-between">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.title}
                          {item.subtitle && (
                            <span className="font-semibold text-slate-600 dark:text-slate-400">
                              {' — '}{item.subtitle}
                            </span>
                          )}
                        </h3>
                        {item.date && (
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
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
                              className="px-1.5 py-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase"
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

        {(languages?.length > 0 || references?.length > 0) && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-200 dark:border-slate-700 pt-6">
            {languages?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Languages
                </h3>
                <div className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  {languages.map((lang, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{lang.name}</span>
                      <span className="text-slate-500 dark:text-slate-400">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {references?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  References
                </h3>
                <div className="mt-2 space-y-3 text-sm text-slate-700 dark:text-slate-300">
                  {references.map((ref, i) => (
                    <div key={i}>
                      <p className="font-semibold">{ref.name}</p>
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