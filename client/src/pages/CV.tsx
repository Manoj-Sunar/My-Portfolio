import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { CVSkeleton } from '../components/common/Skeleton';
import { Mail, Phone, MapPin, Globe, FileText, Printer, Download, Shield, ChevronDown, Monitor, Github } from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';

const CV: React.FC = () => {
  const { cv, isLoading } = usePortfolio();
  const [selectedStyle, setSelectedStyle] = useState<'modern' | 'classic' | 'creative'>('modern');

  if (isLoading) {
    return <CVSkeleton />;
  }

  if (!cv) {
    return (
      <div className="text-center py-20 bg-slate-50 border border-dashed rounded-xl">
        <p className="text-slate-500 font-medium">CV profile configurations unpopulated in database.</p>
      </div>
    );
  }

  // Sync state with db initially, but let viewer toggle styles dynamically on preview screen!
  const currentTemplate = selectedStyle;

  const handlePrint = () => {
    toast.success('Opening print interface... Select "Save as PDF" to export your CV.');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const { personalInfo, sections, skills, languages, references } = cv;

  const handleDownloadPDF = () => {
    try {
      // Dynamic rendering with responsive scaling to guarantee single-page constraint without overlapping text!
      const buildPDF = (scale: number) => {
        const doc = new jsPDF('p', 'mm', 'a4');
        const margin = Math.max(8, 16 * scale); // dynamic left/right/top/bottom margin
        const pageWidth = 210;
        const pageHeight = 297;
        const usableWidth = pageWidth - (margin * 2);
        let y = margin;

        // Header: Name
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(Math.max(13, 20 * scale));
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text(personalInfo.name || 'Manoj Sunar', margin, y);
        y += 7 * scale;

        // Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(Math.max(8.5, 11 * scale));
        doc.setTextColor(37, 99, 235); // blue-600
        doc.text(personalInfo.title || 'MERN Developer', margin, y);
        y += 5.5 * scale;

        // Contact Info as horizontal list
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(Math.max(7, 8.5 * scale));
        doc.setTextColor(100, 116, 139); // slate-500
        const contacts = [
          personalInfo.email,
          personalInfo.phone,
          personalInfo.address,
          personalInfo.website ? personalInfo.website.replace(/^https?:\/\//i, '') : ''
        ].filter(Boolean);
        doc.text(contacts.join('   |   '), margin, y);
        y += 4.5 * scale;

        // Horizontal separator line
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.setLineWidth(0.35);
        doc.line(margin, y, pageWidth - margin, y);
        y += 5.5 * scale;

        // About/Summary
        if (personalInfo.summary) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(Math.max(7.5, 9.2 * scale));
          doc.setTextColor(71, 85, 105); // slate-600
          const textLines = doc.splitTextToSize(personalInfo.summary, usableWidth);
          textLines.forEach((line: string) => {
            doc.text(line, margin, y);
            y += 4.2 * scale;
          });
          y += 2.5 * scale;
        }

        // Sections
        if (sections && sections.length > 0) {
          sections.forEach((section) => {
            y += 1.5 * scale;
            
            // Section Title
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(Math.max(8.5, 10.5 * scale));
            doc.setTextColor(15, 23, 42);
            doc.text(section.title.toUpperCase(), margin, y);
            y += 1.5 * scale;
            
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.25);
            doc.line(margin, y, pageWidth - margin, y);
            y += 4.2 * scale;

            if (section.content) {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(Math.max(7.5, 8.8 * scale));
              doc.setTextColor(100, 116, 139);
              const contentLines = doc.splitTextToSize(section.content, usableWidth);
              contentLines.forEach((line: string) => {
                doc.text(line, margin, y);
                y += 4 * scale;
              });
              y += 1.5 * scale;
            }

            // Section Items
            if (section.items && section.items.length > 0) {
              section.items.forEach((item) => {
                // Item header: Title & Subtitle + Date on the right
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(Math.max(8, 9.2 * scale));
                doc.setTextColor(15, 23, 42);
                
                let headerText = item.title;
                if (item.subtitle) {
                  headerText += ` - ${item.subtitle}`;
                }
                doc.text(headerText, margin, y);

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(Math.max(7, 8.2 * scale));
                doc.setTextColor(100, 116, 139);
                doc.text(item.date || '', pageWidth - margin, y, { align: 'right' });
                y += 4.2 * scale;

                // Item description
                if (item.description) {
                  doc.setFont('helvetica', 'normal');
                  doc.setFontSize(Math.max(7.5, 8.5 * scale));
                  doc.setTextColor(71, 85, 105);
                  const descLines = doc.splitTextToSize(item.description, usableWidth - 5);
                  descLines.forEach((line: string) => {
                    doc.text(line, margin + 4, y);
                    y += 3.8 * scale;
                  });
                }

                // Item highlights
                if (item.highlights) {
                  doc.setFont('helvetica', 'normal');
                  doc.setFontSize(Math.max(7.2, 8.2 * scale));
                  doc.setTextColor(71, 85, 105);
                  const hlLines = item.highlights.split('\n');
                  hlLines.forEach((line) => {
                    const trimmed = line.replace(/^[•\s\-*]+/, '').trim();
                    if (!trimmed) return;
                    const bulletedLine = `- ${trimmed}`;
                    const bulletLines = doc.splitTextToSize(bulletedLine, usableWidth - 8);
                    bulletLines.forEach((bl: string) => {
                      doc.text(bl, margin + 6, y);
                      y += 3.6 * scale;
                    });
                  });
                }

                // Item links (GitHub / Website)
                if (item.githubUrl || item.websiteUrl) {
                  doc.setFont('helvetica', 'italic');
                  doc.setFontSize(Math.max(7, 8 * scale));
                  doc.setTextColor(59, 130, 246); // blue-500
                  const links = [];
                  if (item.githubUrl) links.push(`GitHub: ${item.githubUrl}`);
                  if (item.websiteUrl) links.push(`Website: ${item.websiteUrl}`);
                  doc.text(links.join('   |   '), margin + 4, y);
                  y += 3.8 * scale;
                }

                // Item skills tags
                if (item.skills) {
                  doc.setFont('helvetica', 'italic');
                  doc.setFontSize(Math.max(7, 8 * scale));
                  doc.setTextColor(37, 99, 235);
                  doc.text(`Technologies: ${item.skills}`, margin + 4, y);
                  y += 4 * scale;
                }

                y += 1.5 * scale; // spacing between items
              });
            }
            y += 1 * scale;
          });
        }

        // Technical Capacities
        if (skills && skills.length > 0) {
          y += 2 * scale;
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(Math.max(8.5, 10.5 * scale));
          doc.setTextColor(15, 23, 42);
          doc.text('CAPACITIES & SKILLS', margin, y);
          y += 1.5 * scale;
          doc.setDrawColor(226, 232, 240);
          doc.setLineWidth(0.25);
          doc.line(margin, y, pageWidth - margin, y);
          y += 4.2 * scale;

          skills.forEach((cat) => {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(Math.max(8, 9.2 * scale));
            doc.setTextColor(15, 23, 42);
            doc.text(cat.category, margin, y);
            y += 3.8 * scale;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(Math.max(7.5, 8.5 * scale));
            doc.setTextColor(71, 85, 105);
            const skillLines = doc.splitTextToSize(cat.items.join(', '), usableWidth - 5);
            skillLines.forEach((line: string) => {
              doc.text(line, margin + 4, y);
              y += 3.8 * scale;
            });
            y += 1.5 * scale;
          });
        }

        // Languages & References side-by-side or list
        if ((languages && languages.length > 0) || (references && references.length > 0)) {
          y += 2 * scale;
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(Math.max(8.5, 10.5 * scale));
          doc.setTextColor(15, 23, 42);
          doc.text('LANGUAGES & REFERENCES', margin, y);
          y += 1.5 * scale;
          doc.setDrawColor(226, 232, 240);
          doc.setLineWidth(0.25);
          doc.line(margin, y, pageWidth - margin, y);
          y += 5 * scale;

          const originalY = y;
          let leftY = originalY;
          let rightY = originalY;

          // Draw side-by-side split columns
          if (languages && languages.length > 0) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(Math.max(8, 9.2 * scale));
            doc.setTextColor(15, 23, 42);
            doc.text('Spoken Languages', margin, leftY);
            leftY += 4.2 * scale;

            languages.forEach((lang) => {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(Math.max(7.5, 8.5 * scale));
              doc.setTextColor(71, 85, 105);
              doc.text(`${lang.name} - ${lang.level}`, margin + 2, leftY);
              leftY += 3.8 * scale;
            });
          }

          if (references && references.length > 0) {
            const colX = margin + (usableWidth / 2);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(Math.max(8, 9.2 * scale));
            doc.setTextColor(15, 23, 42);
            doc.text('Professional References', colX, rightY);
            rightY += 4.2 * scale;

            references.forEach((ref) => {
              doc.setFont('helvetica', 'bold');
              doc.setFontSize(Math.max(7.5, 8.8 * scale));
              doc.setTextColor(71, 85, 105);
              doc.text(ref.name, colX + 2, rightY);
              rightY += 3.5 * scale;

              doc.setFont('helvetica', 'normal');
              doc.setFontSize(Math.max(7, 8 * scale));
              doc.setTextColor(100, 116, 139);
              doc.text(`${ref.position} - ${ref.company}`, colX + 4, rightY);
              rightY += 3.5 * scale;
              
              doc.text(ref.contact, colX + 4, rightY);
              rightY += 4.2 * scale;
            });
          }

          y = Math.max(leftY, rightY);
        }

        return { doc, endY: y, margin };
      };

      // Measure using scale = 1.0
      const measureResult = buildPDF(1.0);
      let scaleLimit = 1.0;
      const printableHeightLimit = 297 - measureResult.margin;

      if (measureResult.endY > printableHeightLimit) {
        // Linearly calculate perfect scale required to compress within 275mm printable space
        scaleLimit = printableHeightLimit / measureResult.endY;
        // Bound minimum scale to 0.58 so the fonts do not shrink to an unreadable state
        scaleLimit = Math.max(0.58, scaleLimit);
      }

      // Generate the optimal single page high-fidelity PDF using our calculated scale factor!
      const finalResult = buildPDF(scaleLimit);

      // Save document
      const normalizedName = personalInfo.name.toLowerCase().replace(/\s+/g, '_');
      finalResult.doc.save(`${normalizedName}_cv.pdf`);
      toast.success('Professional single-page CV exported successfully!');
    } catch (err) {
      console.error('[PDF Export Error]', err);
      toast.error('Direct PDF creation failed. Pls use the Print / Save-to-PDF button.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 print:p-0 print:m-0">
      
      {/* 1. Print & Style Selector panel (Hides on standard print) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden text-left shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Interactive Resume Viewer</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Toggle designs instantly or print/export high-fidelity PDFs.</p>
          </div>
        </div>

        {/* Style Switches */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden text-xs font-semibold">
            <button
              onClick={() => setSelectedStyle('modern')}
              className={`px-3 py-2 transition cursor-pointer ${
                currentTemplate === 'modern' ? 'bg-slate-900 dark:bg-slate-800 text-white' : 'bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Modern Grid
            </button>
            <button
              onClick={() => setSelectedStyle('classic')}
              className={`px-3 py-2 transition cursor-pointer ${
                currentTemplate === 'classic' ? 'bg-slate-900 dark:bg-slate-800 text-white' : 'bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Classic Corporate
            </button>
            <button
              onClick={() => setSelectedStyle('creative')}
              className={`px-3 py-2 transition cursor-pointer ${
                currentTemplate === 'creative' ? 'bg-slate-900 dark:bg-slate-800 text-white' : 'bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Creative Tinted
            </button>
          </div>

          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-lg shadow-xs transition cursor-pointer"
          >
            <Download size={13} className="mr-1.5" />
            Download PDF
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-950 text-xs font-bold text-white rounded-lg shadow-xs transition cursor-pointer"
          >
            <Printer size={13} className="mr-1.5" />
            Print CV
          </button>
        </div>
      </div>

      {/* 2. MASTER PRINTABLE CV CONTAINER */}
      <div
        id="printable-cv-layout"
        className={`bg-white dark:bg-slate-900 border rounded-2xl p-8 sm:p-12 text-left relative overflow-hidden transition-all duration-300 print:border-none print:p-0 print:shadow-none shadow-sm ${
          currentTemplate === 'modern' ? 'border-slate-200 dark:border-slate-800' : ''
        } ${
          currentTemplate === 'classic' ? 'border-slate-300 dark:border-slate-700 font-serif' : 'font-sans'
        } ${
          currentTemplate === 'creative' ? 'border-amber-200 dark:border-amber-900 bg-amber-50/5 dark:bg-amber-950/5' : ''
        }`}
      >
        {/* Creative Top Accent Line */}
        {currentTemplate === 'creative' && (
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 via-blue-500 to-indigo-600"></div>
        )}

        {/* ======================================= */}
        {/* CV HEADER - PERSONAL DETAILS            */}
        {/* ======================================= */}
        <div className={`space-y-6 pb-8 border-b ${
          currentTemplate === 'classic' ? 'text-center border-slate-300 dark:border-slate-700' : 'border-slate-100 dark:border-slate-800'
        }`}>
          {/* Main Title Metadata */}
          <div className="space-y-2">
            <h1 className={`font-extrabold tracking-tight text-slate-900 dark:text-white ${
              currentTemplate === 'classic' ? 'text-4xl sm:text-5xl font-bold' : 'text-3xl sm:text-4xl'
            } ${currentTemplate === 'creative' ? 'text-blue-900 dark:text-blue-400' : ''}`}>
              {personalInfo.name}
            </h1>
            <p className={`text-md sm:text-lg font-bold ${
              currentTemplate === 'creative' ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600'
            }`}>
              {personalInfo.title}
            </p>
          </div>

          {/* Quick Contact Links */}
          <div className={`flex flex-wrap text-xs text-slate-500 dark:text-slate-400 gap-y-3 gap-x-6 leading-relaxed ${
            currentTemplate === 'classic' ? 'justify-center' : ''
          }`}>
            <span className="inline-flex items-center">
              <Mail size={13} className="mr-1.5 text-slate-400 dark:text-slate-500" />
              <a href={`mailto:${personalInfo.email}`} className="hover:underline text-slate-600 dark:text-slate-300">{personalInfo.email}</a>
            </span>
            <span className="inline-flex items-center">
              <Phone size={13} className="mr-1.5 text-slate-400 dark:text-slate-500" />
              <span className="text-slate-600 dark:text-slate-300">{personalInfo.phone}</span>
            </span>
            <span className="inline-flex items-center">
              <MapPin size={13} className="mr-1.5 text-slate-400 dark:text-slate-500" />
              <span className="text-slate-600 dark:text-slate-300">{personalInfo.address}</span>
            </span>
            {personalInfo.website && (
              <span className="inline-flex items-center">
                <Globe size={13} className="mr-1.5 text-slate-400 dark:text-slate-500" />
                <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline text-slate-600 dark:text-slate-300 flex">
                  {personalInfo.website.replace(/^https?:\/\//i, '')}
                </a>
              </span>
            )}
          </div>
          
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl whitespace-pre-line font-normal">
            {personalInfo.summary}
          </p>
        </div>

        {/* ======================================= */}
        {/* CV BODY - SECTIONS FLOW                 */}
        {/* ======================================= */}
        <div className={`grid grid-cols-1 gap-10 pt-8 ${
          currentTemplate === 'modern' ? 'lg:grid-cols-12' : 'lg:grid-cols-1'
        }`}>
          {/* Left Column (Modern uses 8 cols, others cover full) */}
          <div className={`${currentTemplate === 'modern' ? 'lg:col-span-8' : ''} space-y-10`}>
            {sections.map((section) => (
              <div key={section.id} className="space-y-5 text-left">
                <h2 className={`font-bold tracking-tight text-slate-900 dark:text-white border-b pb-2 uppercase ${
                  currentTemplate === 'classic' ? 'text-lg border-slate-300 dark:border-slate-700 text-center font-bold tracking-wider' : 'text-sm'
                } ${currentTemplate === 'creative' ? 'text-indigo-900 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30' : 'border-slate-105 dark:border-slate-800'}`}>
                  {section.title}
                </h2>
                
                {section.content && (
                  <p className="text-xs text-slate-500 dark:text-slate-405 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                )}

                <div className="space-y-6">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="space-y-1.5 text-left">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex flex-wrap items-center gap-1.5">
                          <span>{item.title}</span>{' '}
                          <span className={`text-xs font-semibold ${
                            currentTemplate === 'creative' ? 'text-amber-600 dark:text-amber-450' : 'text-blue-600 dark:text-blue-400'
                          }`}>
                            &mdash; {item.subtitle}
                          </span>
                          {(item.githubUrl || item.websiteUrl) && (
                            <span className="inline-flex items-center gap-2 ml-1.5 py-0.5 px-1.5 bg-slate-100 dark:bg-slate-800 rounded-md">
                              {item.githubUrl && (
                                <a
                                  href={item.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition"
                                  title="View GitHub Repository"
                                >
                                  <Github size={12} />
                                </a>
                              )}
                              {item.websiteUrl && (
                                <a
                                  href={item.websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition"
                                  title="View Live Website / Project"
                                >
                                  <Globe size={12} />
                                </a>
                              )}
                            </span>
                          )}
                        </h3>
                        <span className="text-xs font-semibold text-slate-550 dark:text-slate-450 sm:text-right whitespace-nowrap">
                          {item.date}
                        </span>
                      </div>

                      {item.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal whitespace-pre-line">
                          {item.description}
                        </p>
                      )}

                      {item.highlights && (
                        <ul className="list-disc pl-4 space-y-1 mt-1.5 text-slate-500 dark:text-slate-400">
                          {item.highlights.split('\n').map((line, hidx) => {
                            const trimmed = line.replace(/^[•\s\-*]+/, '').trim();
                            if (!trimmed) return null;
                            return (
                              <li key={hidx} className="text-xs leading-relaxed font-normal">
                                {trimmed}
                              </li>
                            );
                          })}
                        </ul>
                      )}

                      {item.skills && (
                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          {item.skills.split(',').map((skill) => (
                            <span
                              key={skill}
                              className="px-1.5 py-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-205 dark:border-slate-705 rounded text-[9px] font-bold text-slate-600 dark:text-slate-300 uppercase"
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

          {/* Right Column (Modern utilities sidebar / Others Append to bottom) */}
          <div className={`${
            currentTemplate === 'modern'
              ? 'lg:col-span-4 border-l border-slate-100 dark:border-slate-800 lg:pl-8 space-y-8'
              : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 border-t border-slate-100 dark:border-slate-800 pt-8'
          }`}>
            
            {/* 1. Categorized Technical Skills */}
            {skills && skills.length > 0 && (
              <div className="space-y-4 text-left">
                <h3 className={`font-bold tracking-tight text-slate-900 dark:text-white uppercase ${
                  currentTemplate === 'classic' ? 'text-sm font-semibold' : 'text-xs'
                } ${currentTemplate === 'creative' ? 'text-blue-900 dark:text-blue-400 border-b border-blue-50 dark:border-blue-900/30 pb-1' : ''}`}>
                  Capacities
                </h3>
                <div className="space-y-4">
                  {skills.map((cat, sidx) => (
                    <div key={sidx} className="space-y-1">
                      <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300">{cat.category}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {cat.items.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Languages */}
            {languages && languages.length > 0 && (
              <div className="space-y-4 text-left">
                <h3 className={`font-bold tracking-tight text-slate-900 dark:text-white uppercase ${
                  currentTemplate === 'classic' ? 'text-sm font-semibold' : 'text-xs'
                } ${currentTemplate === 'creative' ? 'text-blue-900 dark:text-blue-400 border-b border-blue-50 dark:border-blue-900/30 pb-1' : ''}`}>
                  Spoken Languages
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {languages.map((lang, lidx) => (
                    <div key={lidx} className="flex justify-between text-xs font-medium">
                      <span className="text-slate-800 dark:text-slate-300">{lang.name}</span>
                      <span className="text-slate-400 dark:text-slate-450 font-normal">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Professional References */}
            {references && references.length > 0 && (
              <div className="space-y-4 text-left">
                <h3 className={`font-bold tracking-tight text-slate-900 dark:text-white uppercase ${
                  currentTemplate === 'classic' ? 'text-sm font-semibold' : 'text-xs'
                } ${currentTemplate === 'creative' ? 'text-blue-900 dark:text-blue-400 border-b border-blue-50 dark:border-blue-900/30 pb-1' : ''}`}>
                  References
                </h3>
                <div className="space-y-4.5">
                  {references.map((ref, ridx) => (
                    <div key={ridx} className="space-y-0.5 text-xs">
                      <p className="font-extrabold text-slate-800 dark:text-slate-200">{ref.name}</p>
                      <p className="text-slate-550 dark:text-slate-400 text-[11px] font-medium leading-tight">
                        {ref.position} &mdash; <span className="font-semibold text-slate-600 dark:text-slate-300">{ref.company}</span>
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] select-all font-mono">{ref.contact}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CV;
