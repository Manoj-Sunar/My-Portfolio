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
import { FaGithub } from 'react-icons/fa';
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
  const GITHUB_URL = 'https://github.com/Manoj-Sunar';

  // ================================================================
  //  PDF GENERATION – with clickable links and perfect proportions
  // ================================================================
  const handleDownloadPDF = () => {
    try {
      const buildPDF = (scale: number) => {
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = 210;
        const margin = 16 * scale;
        const usableWidth = pageWidth - margin * 2;
        let y = margin;

        // ---- Name ----
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(26 * scale);
        doc.setTextColor(15, 23, 42);
        doc.text(personalInfo.name || 'Manoj Sunar', margin, y);
        y += 11 * scale;

        // ---- Title + clickable contacts ----
        const title = personalInfo.title || 'Full Stack Developer';

        // Build contact items with their URLs
        const contactItems: { text: string; url?: string }[] = [];
        if (personalInfo.address) contactItems.push({ text: personalInfo.address });
        if (personalInfo.phone) contactItems.push({ text: personalInfo.phone, url: `tel:${personalInfo.phone}` });
        if (personalInfo.email) contactItems.push({ text: personalInfo.email, url: `mailto:${personalInfo.email}` });
        if (personalInfo.website) {
          const cleanWebsite = personalInfo.website.replace(/^https?:\/\//i, '');
          contactItems.push({ text: cleanWebsite, url: personalInfo.website });
        }
        const cleanGithub = GITHUB_URL.replace(/^https?:\/\//i, '');
        contactItems.push({ text: cleanGithub, url: GITHUB_URL });

        const separator = '  |  ';

        // First, try to draw title and all contacts on one line
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13 * scale);
        doc.setTextColor(37, 99, 235);
        const titleWidth = doc.getTextWidth(title);
        const sepWidth = doc.getTextWidth(separator);

        // Measure total width of contacts
        let totalContactsWidth = 0;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10.5 * scale);
        contactItems.forEach((item, idx) => {
          const w = doc.getTextWidth(item.text);
          totalContactsWidth += w;
          if (idx < contactItems.length - 1) totalContactsWidth += sepWidth;
        });

        const totalWidth = titleWidth + sepWidth + totalContactsWidth;

        if (totalWidth < usableWidth) {
          // ---- One line: title + separator + contacts ----
          // Draw title
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(13 * scale);
          doc.setTextColor(37, 99, 235);
          doc.text(title, margin, y);
          let x = margin + titleWidth + sepWidth;

          // Draw each contact with separator before (except first)
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10.5 * scale);
          doc.setTextColor(71, 85, 105);
          let startX = margin + titleWidth + sepWidth;
          contactItems.forEach((item, idx) => {
            const textW = doc.getTextWidth(item.text);
            const xPos = startX;
            doc.text(item.text, xPos, y);
            // Add link if URL exists
            if (item.url) {
              const textHeight = 4 * scale;
              doc.link(xPos, y - textHeight, textW, textHeight, { url: item.url });
            }
            startX += textW + sepWidth;
          });
          y += 6.5 * scale;
        } else {
          // ---- Two lines: title on first, contacts on second with indent ----
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(13 * scale);
          doc.setTextColor(37, 99, 235);
          doc.text(title, margin, y);
          y += 6.5 * scale;

          // Contacts on next line with small indent
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10 * scale);
          doc.setTextColor(71, 85, 105);
          let x = margin + 2;
          contactItems.forEach((item, idx) => {
            const textW = doc.getTextWidth(item.text);
            doc.text(item.text, x, y);
            if (item.url) {
              const textHeight = 4 * scale;
              doc.link(x, y - textHeight, textW, textHeight, { url: item.url });
            }
            x += textW;
            if (idx < contactItems.length - 1) {
              doc.text(separator, x, y);
              x += doc.getTextWidth(separator);
            }
          });
          y += 5.5 * scale;
        }
        y += 2 * scale;

        // ---- Summary ----
        if (personalInfo.summary) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10 * scale);
          doc.setTextColor(71, 85, 105);
          const summaryLines = doc.splitTextToSize(personalInfo.summary, usableWidth);
          summaryLines.forEach((line: string) => {
            doc.text(line, margin, y);
            y += 5 * scale;
          });
          y += 3 * scale;
        }

        // ---- Core Skills (two‑column) ----
        if (skills && skills.length > 0) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(13 * scale);
          doc.setTextColor(15, 23, 42);
          doc.text('CORE SKILLS', margin, y);
          y += 5 * scale;
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.3 * scale);
          doc.line(margin, y, pageWidth - margin, y);
          y += 6 * scale;

          const colWidth = (usableWidth / 2) - 4;
          const leftX = margin;
          const rightX = margin + colWidth + 8;
          let leftY = y;
          let rightY = y;
          const half = Math.ceil(skills.length / 2);
          const leftSkills = skills.slice(0, half);
          const rightSkills = skills.slice(half);

          const renderSkillColumn = (skillsArray: any[], x: number, startY: number) => {
            let curY = startY;
            skillsArray.forEach((cat) => {
              const line = `${cat.category}: ${cat.items.join(', ')}`;
              const lines = doc.splitTextToSize(line, colWidth);
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(9.5 * scale);
              doc.setTextColor(51, 65, 85);
              lines.forEach((l: string) => {
                doc.text(l, x, curY);
                curY += 4.8 * scale;
              });
              curY += 1.5 * scale;
            });
            return curY;
          };

          if (leftSkills.length) leftY = renderSkillColumn(leftSkills, leftX, leftY);
          if (rightSkills.length) rightY = renderSkillColumn(rightSkills, rightX, rightY);
          y = Math.max(leftY, rightY) + 3 * scale;
        }

        // ---- Sections ----
        if (sections && sections.length > 0) {
          sections.forEach((section) => {
            y += 2 * scale;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(13 * scale);
            doc.setTextColor(15, 23, 42);
            doc.text(section.title.toUpperCase(), margin, y);
            y += 5 * scale;
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.3 * scale);
            doc.line(margin, y, pageWidth - margin, y);
            y += 6 * scale;

            if (section.items && section.items.length > 0) {
              section.items.forEach((item) => {
                // Item header
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(11 * scale);
                doc.setTextColor(15, 23, 42);
                let headerText = item.title;
                if (item.subtitle) headerText += ` — ${item.subtitle}`;
                const dateText = item.date || '';
                const headerWidth = doc.getTextWidth(headerText);
                const dateWidth = doc.getTextWidth(dateText);
                if (headerWidth + dateWidth + 6 < usableWidth) {
                  doc.text(headerText, margin, y);
                  if (dateText) {
                    doc.text(dateText, pageWidth - margin, y, { align: 'right' });
                  }
                  y += 5.5 * scale;
                } else {
                  doc.text(headerText, margin, y);
                  y += 5.5 * scale;
                  if (dateText) {
                    doc.setFont('helvetica', 'italic');
                    doc.setFontSize(9 * scale);
                    doc.setTextColor(100, 116, 139);
                    doc.text(dateText, margin, y);
                    y += 4.5 * scale;
                  }
                }

                // Description
                if (item.description) {
                  doc.setFont('helvetica', 'normal');
                  doc.setFontSize(9.5 * scale);
                  doc.setTextColor(71, 85, 105);
                  const descLines = doc.splitTextToSize(item.description, usableWidth);
                  descLines.forEach((line: string) => {
                    doc.text(line, margin, y);
                    y += 4.8 * scale;
                  });
                }

                // Highlights (bullets)
                if (item.highlights) {
                  doc.setFont('helvetica', 'normal');
                  doc.setFontSize(9.5 * scale);
                  doc.setTextColor(71, 85, 105);
                  const bullets = item.highlights.split('\n').filter((b: string) => b.trim());
                  bullets.forEach((bullet: string) => {
                    const trimmed = bullet.replace(/^[•\s\-*]+/, '').trim();
                    if (!trimmed) return;
                    const bulletLines = doc.splitTextToSize(`• ${trimmed}`, usableWidth - 5);
                    bulletLines.forEach((line: string) => {
                      doc.text(line, margin + 4, y);
                      y += 4.5 * scale;
                    });
                  });
                }

                // Skill tags
                if (item.skills) {
                  const skillArray = item.skills.split(',').map(s => s.trim()).filter(Boolean);
                  if (skillArray.length > 0) {
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(8 * scale);
                    doc.setTextColor(51, 65, 85);
                    const skillLine = skillArray.join('  •  ');
                    const wrappedSkills = doc.splitTextToSize(skillLine, usableWidth);
                    wrappedSkills.forEach((line: string) => {
                      doc.text(line, margin, y);
                      y += 4.2 * scale;
                    });
                  }
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
          doc.setFontSize(13 * scale);
          doc.setTextColor(15, 23, 42);
          doc.text('ADDITIONAL', margin, y);
          y += 5 * scale;
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.3 * scale);
          doc.line(margin, y, pageWidth - margin, y);
          y += 6 * scale;

          const colWidth = usableWidth / 2 - 4;
          let leftY = y;
          let rightY = y;

          if (languages && languages.length > 0) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10.5 * scale);
            doc.setTextColor(15, 23, 42);
            doc.text('Languages', margin, leftY);
            leftY += 5 * scale;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9 * scale);
            doc.setTextColor(71, 85, 105);
            languages.forEach((lang) => {
              doc.text(`${lang.name} — ${lang.level}`, margin, leftY);
              leftY += 4.5 * scale;
            });
          }

          if (references && references.length > 0) {
            const refX = margin + colWidth + 8;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10.5 * scale);
            doc.setTextColor(15, 23, 42);
            doc.text('References', refX, rightY);
            rightY += 5 * scale;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9 * scale);
            doc.setTextColor(71, 85, 105);
            references.forEach((ref) => {
              doc.text(ref.name, refX, rightY);
              rightY += 4.5 * scale;
              doc.text(`${ref.position} — ${ref.company}`, refX, rightY);
              rightY += 4.5 * scale;
              doc.text(ref.contact, refX, rightY);
              rightY += 4.5 * scale;
            });
          }

          y = Math.max(leftY, rightY);
        }

        return { doc, endY: y, margin };
      };

      // ---- Auto‑scale (minimum 0.65 to keep text readable) ----
      const measure = buildPDF(1.0);
      const totalHeight = measure.endY;
      const pageHeight = 297;
      const margin = measure.margin;
      const availableHeight = pageHeight - margin * 2;

      let scale = 1.0;
      if (totalHeight > availableHeight) {
        scale = availableHeight / totalHeight;
        if (scale < 0.65) scale = 0.65; // higher minimum readability
      }

      const final = buildPDF(scale);
      const fileName = (personalInfo.name || 'cv').toLowerCase().replace(/\s+/g, '_');
      final.doc.save(`${fileName}_cv.pdf`);
      toast.success('CV exported with clickable links!');
    } catch (err) {
      console.error(err);
      toast.error('PDF export failed. Please use the Print option instead.');
    }
  };

  const handlePrint = () => {
    toast.success('Opening print interface…');
    setTimeout(() => window.print(), 500);
  };

  // -------- Screen Render (unchanged – already perfect) --------
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
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 print:border-none print:p-0 print:shadow-none shadow-lg"
      >
        {/* Header */}
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
                <a href={`tel:${personalInfo.phone}`} className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Phone size={14} className="text-slate-400 dark:text-slate-500" />
                  <span>{personalInfo.phone}</span>
                </a>
              )}
              {personalInfo.email && (
                <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Mail size={14} className="text-slate-400 dark:text-slate-500" />
                  <span>{personalInfo.email}</span>
                </a>
              )}
              {personalInfo.website && (
                <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Globe size={14} className="text-slate-400 dark:text-slate-500" />
                  <span>{personalInfo.website.replace(/^https?:\/\//i, '')}</span>
                </a>
              )}
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <FaGithub size={14} className="text-slate-400 dark:text-slate-500" />
                <span>{GITHUB_URL.replace(/^https?:\/\//i, '')}</span>
              </a>
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

        {/* Sections */}
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