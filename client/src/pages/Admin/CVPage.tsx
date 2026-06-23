import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  FileText,
  Plus,
  Trash2,
  Calendar,
  Globe,
  PlusCircle,
  HelpCircle,
  FolderDot,
  Briefcase,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  X,
  Edit2,
  Check,
  Github,
} from 'lucide-react';
import { Card, Input, Textarea, Button, Heading, Paragraph, Span, Label } from '../../components/common/UI';
import toast from 'react-hot-toast';
import { CVSection, CVItem, CVSkillCategory, CVLanguage, CVReference } from '../../types';

const CVPage: React.FC = () => {
  const { cv, updateCV, isLoading } = usePortfolio();

  // Primary States
  const [personalName, setPersonalName] = useState<string>('');
  const [personalEmail, setPersonalEmail] = useState<string>('');
  const [personalPhone, setPersonalPhone] = useState<string>('');
  const [personalAddress, setPersonalAddress] = useState<string>('');
  const [personalWebsite, setPersonalWebsite] = useState<string>('');
  const [personalTitle, setPersonalTitle] = useState<string>('');
  const [personalSummary, setPersonalSummary] = useState<string>('');
  
  const [template, setTemplate] = useState<'modern' | 'classic' | 'creative'>('modern');

  // Multi-item States
  const [sections, setSections] = useState<CVSection[]>([]);
  const [skills, setSkills] = useState<CVSkillCategory[]>([]);
  const [languages, setLanguages] = useState<CVLanguage[]>([]);
  const [references, setReferences] = useState<CVReference[]>([]);

  // Helpers for creating new entities
  const [newSecTitle, setNewSecTitle] = useState<string>('');
  
  const [newSkillCat, setNewSkillCat] = useState<string>('');
  const [newSkillItems, setNewSkillItems] = useState<string>('');

  const [newLangName, setNewLangName] = useState<string>('');
  const [newLangLevel, setNewLangLevel] = useState<string>('Native / Bilingual');

  const [newRefName, setNewRefName] = useState<string>('');
  const [newRefPos, setNewRefPos] = useState<string>('');
  const [newRefComp, setNewRefComp] = useState<string>('');
  const [newRefContact, setNewRefContact] = useState<string>('');

  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Nested item modal / form states
  const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false);
  const [activeSectionIdForItems, setActiveSectionIdForItems] = useState<string>('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemFormTitle, setItemFormTitle] = useState<string>('');
  const [itemFormSubtitle, setItemFormSubtitle] = useState<string>('');
  const [itemFormDate, setItemFormDate] = useState<string>('');
  const [itemFormDescription, setItemFormDescription] = useState<string>('');
  const [itemFormSkills, setItemFormSkills] = useState<string>('');
  const [itemFormGithub, setItemFormGithub] = useState<string>('');
  const [itemFormWebsite, setItemFormWebsite] = useState<string>('');
  const [itemFormHighlights, setItemFormHighlights] = useState<string>('');

  // Skill category edit index
  const [editingSkillIdx, setEditingSkillIdx] = useState<number | null>(null);

  // Section title editing state
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState<string>('');

  // Language edit index
  const [editingLangIdx, setEditingLangIdx] = useState<number | null>(null);

  // Reference edit index
  const [editingRefIdx, setEditingRefIdx] = useState<number | null>(null);

  // Sync with DB context initially
  useEffect(() => {
    if (cv) {
      setPersonalName(cv.personalInfo?.name || '');
      setPersonalEmail(cv.personalInfo?.email || '');
      setPersonalPhone(cv.personalInfo?.phone || '');
      setPersonalAddress(cv.personalInfo?.address || '');
      setPersonalWebsite(cv.personalInfo?.website || '');
      setPersonalTitle(cv.personalInfo?.title || '');
      setPersonalSummary(cv.personalInfo?.summary || '');
      setTemplate(cv.template || 'modern');
      
      const rawSections = cv.sections || [];
      const sanitizedSections = rawSections.map((sec, sidx) => {
        const secId = sec.id || `sec_loaded_${sidx}_${Date.now()}`;
        const secItems = (sec.items || []).map((itm, iidx) => {
          return {
            ...itm,
            id: itm.id || `itm_loaded_${sidx}_${iidx}_${Date.now()}`
          };
        });
        return {
          ...sec,
          id: secId,
          items: secItems
        };
      });
      setSections(sanitizedSections);
      setSkills(cv.skills || []);
      setLanguages(cv.languages || []);
      setReferences(cv.references || []);
    }
  }, [cv]);

  // Enterprise Auto-Sync core engine
  const triggerAutoSave = useCallback(async (
    updatedSections?: CVSection[],
    updatedSkills?: CVSkillCategory[],
    updatedLanguages?: CVLanguage[],
    updatedReferences?: CVReference[],
    updatedTemplate?: 'modern' | 'classic' | 'creative'
  ) => {
    const payload = {
      personalInfo: {
        name: personalName,
        email: personalEmail,
        phone: personalPhone,
        address: personalAddress,
        website: personalWebsite,
        title: personalTitle,
        summary: personalSummary,
      },
      sections: updatedSections !== undefined ? updatedSections : sections,
      skills: updatedSkills !== undefined ? updatedSkills : skills,
      languages: updatedLanguages !== undefined ? updatedLanguages : languages,
      references: updatedReferences !== undefined ? updatedReferences : references,
      template: updatedTemplate !== undefined ? updatedTemplate : template,
    };
    
    try {
      await updateCV(payload);
    } catch (err) {
      console.error('[CV Auto-Save Exception] Failed to persist updates:', err);
    }
  }, [personalName, personalEmail, personalPhone, personalAddress, personalWebsite, personalTitle, personalSummary, sections, skills, languages, references, template, updateCV]);

  // SECTIONS & NESTED ITEMS MUTATIONS
  const handleAddSection = useCallback(() => {
    if (!newSecTitle.trim()) return;
    const newSec: CVSection = {
      id: 'sec_' + Date.now().toString(),
      title: newSecTitle.trim(),
      items: [],
    };
    const updated = [...sections, newSec];
    setSections(updated);
    setNewSecTitle('');
    triggerAutoSave(updated);
    toast.success(`Section "${newSec.title}" initialized.`);
  }, [newSecTitle, sections, triggerAutoSave]);

  const handleRemoveSection = useCallback((id: string) => {
    const updated = sections.filter((s) => s.id !== id);
    setSections(updated);
    triggerAutoSave(updated);
    toast.success('Section removed.');
  }, [sections, triggerAutoSave]);

  const handleMoveSection = useCallback((id: string, direction: 'up' | 'down') => {
    const index = sections.findIndex(s => s.id === id);
    if (index === -1) return;
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= sections.length) return;
    
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    
    setSections(updated);
    triggerAutoSave(updated);
    toast.success('Section sequence updated.');
  }, [sections, triggerAutoSave]);

  // Section Name Editing
  const handleStartEditSectionTitle = useCallback((id: string, currentTitle: string) => {
    setEditingSectionId(id);
    setEditingSectionTitle(currentTitle);
  }, []);

  const handleSaveSectionTitle = useCallback(() => {
    if (!editingSectionTitle.trim()) {
      toast.error('Section title cannot be empty.');
      return;
    }
    const updated = sections.map((sec) => {
      if (sec.id === editingSectionId) {
        return { ...sec, title: editingSectionTitle.trim() };
      }
      return sec;
    });
    setSections(updated);
    setEditingSectionId(null);
    setEditingSectionTitle('');
    triggerAutoSave(updated);
    toast.success('Section renamed successfully.');
  }, [editingSectionTitle, sections, editingSectionId, triggerAutoSave]);

  const handleCancelEditSectionTitle = useCallback(() => {
    setEditingSectionId(null);
    setEditingSectionTitle('');
  }, []);

  const handleOpenAddNestedItem = useCallback((sectionId: string) => {
    setActiveSectionIdForItems(sectionId);
    setEditingItemId(null);
    setItemFormTitle('');
    setItemFormSubtitle('');
    setItemFormDate('');
    setItemFormDescription('');
    setItemFormSkills('');
    setItemFormGithub('');
    setItemFormWebsite('');
    setItemFormHighlights('');
    setIsItemModalOpen(true);
  }, []);

  const handleOpenEditNestedItem = useCallback((sectionId: string, item: CVItem) => {
    setActiveSectionIdForItems(sectionId);
    setEditingItemId(item.id || '');
    setItemFormTitle(item.title);
    setItemFormSubtitle(item.subtitle);
    setItemFormDate(item.date);
    setItemFormDescription(item.description);
    setItemFormSkills(item.skills || '');
    setItemFormGithub(item.githubUrl || '');
    setItemFormWebsite(item.websiteUrl || '');
    setItemFormHighlights(item.highlights || '');
    setIsItemModalOpen(true);
  }, []);

  const handleSaveNestedItem = useCallback(() => {
    if (!itemFormTitle.trim()) {
      toast.error('Item Title is required.');
      return;
    }

    let updated: CVSection[];

    if (editingItemId) {
      // Edit mode
      updated = sections.map((sec) => {
        if (sec.id === activeSectionIdForItems) {
          return {
            ...sec,
            items: sec.items.map((itm) => {
              if (itm.id === editingItemId) {
                return {
                  ...itm,
                  title: itemFormTitle.trim(),
                  subtitle: itemFormSubtitle.trim(),
                  date: itemFormDate.trim(),
                  description: itemFormDescription.trim(),
                  skills: itemFormSkills.trim(),
                  githubUrl: itemFormGithub.trim(),
                  websiteUrl: itemFormWebsite.trim(),
                  highlights: itemFormHighlights.trim(),
                };
              }
              return itm;
            }),
          };
        }
        return sec;
      });
      toast.success('Nested entry updated successfully!');
    } else {
      // Add mode
      const newItem: CVItem = {
        id: 'itm_' + Date.now().toString(),
        title: itemFormTitle.trim(),
        subtitle: itemFormSubtitle.trim(),
        date: itemFormDate.trim(),
        description: itemFormDescription.trim(),
        skills: itemFormSkills.trim(),
        githubUrl: itemFormGithub.trim(),
        websiteUrl: itemFormWebsite.trim(),
        highlights: itemFormHighlights.trim(),
      };
      updated = sections.map((sec) => {
        if (sec.id === activeSectionIdForItems) {
          return {
            ...sec,
            items: [...sec.items, newItem],
          };
        }
        return sec;
      });
      toast.success('Nested entry added successfully!');
    }

    setSections(updated);
    triggerAutoSave(updated);
    setIsItemModalOpen(false);
  }, [itemFormTitle, editingItemId, sections, activeSectionIdForItems, itemFormSubtitle, itemFormDate, itemFormDescription, itemFormSkills, itemFormGithub, itemFormWebsite, itemFormHighlights, triggerAutoSave]);

  const handleRemoveNestedItem = useCallback((sectionId: string, itemId: string, itemIdx: number) => {
    const updated = sections.map((sec) => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          items: sec.items.filter((itm, idx) => {
            if (itemId && itm.id) {
              return itm.id !== itemId;
            }
            return idx !== itemIdx;
          }),
        };
      }
      return sec;
    });
    setSections(updated);
    triggerAutoSave(updated);
    toast.success('Nested item deleted and synced.');
  }, [sections, triggerAutoSave]);

  // Reorder nested items inside a section
  const handleMoveNestedItem = useCallback((sectionId: string, itemId: string, direction: 'up' | 'down') => {
    const updated = sections.map((sec) => {
      if (sec.id === sectionId) {
        const itemIdx = sec.items.findIndex(itm => (itm.id || '') === itemId);
        if (itemIdx === -1) return sec;
        const nextIdx = direction === 'up' ? itemIdx - 1 : itemIdx + 1;
        if (nextIdx < 0 || nextIdx >= sec.items.length) return sec;
        
        const updatedItms = [...sec.items];
        const temp = updatedItms[itemIdx];
        updatedItms[itemIdx] = updatedItms[nextIdx];
        updatedItms[nextIdx] = temp;
        return {
          ...sec,
          items: updatedItms
        };
      }
      return sec;
    });
    setSections(updated);
    triggerAutoSave(updated);
    toast.success('Nested chronological order rearranged.');
  }, [sections, triggerAutoSave]);

  // SKILLS CATEGORIES
  const handleAddSkillCat = useCallback(() => {
    if (!newSkillCat.trim() || !newSkillItems.trim()) return;
    const items = newSkillItems.split(',').map((i) => i.trim()).filter(Boolean);

    let updated: CVSkillCategory[];

    if (editingSkillIdx !== null) {
      updated = [...skills];
      updated[editingSkillIdx] = {
        category: newSkillCat.trim(),
        items,
      };
      setEditingSkillIdx(null);
      toast.success('Skill category updated!');
    } else {
      const newCat: CVSkillCategory = {
        category: newSkillCat.trim(),
        items,
      };
      updated = [...skills, newCat];
      toast.success('Skill category added.');
    }

    setSkills(updated);
    setNewSkillCat('');
    setNewSkillItems('');
    triggerAutoSave(undefined, updated);
  }, [newSkillCat, newSkillItems, editingSkillIdx, skills, triggerAutoSave]);

  const handleStartEditSkillCat = useCallback((idx: number) => {
    const dSkill = skills[idx];
    setEditingSkillIdx(idx);
    setNewSkillCat(dSkill.category);
    setNewSkillItems(dSkill.items.join(', '));
  }, [skills]);

  const handleCancelEditSkillCat = useCallback(() => {
    setEditingSkillIdx(null);
    setNewSkillCat('');
    setNewSkillItems('');
  }, []);

  const handleRemoveSkillCat = useCallback((idx: number) => {
    const updated = skills.filter((_, i) => i !== idx);
    setSkills(updated);
    triggerAutoSave(undefined, updated);
    toast.success('Skill category deleted and synced.');
    if (editingSkillIdx === idx) {
      handleCancelEditSkillCat();
    }
  }, [skills, editingSkillIdx, handleCancelEditSkillCat, triggerAutoSave]);

  const handleMoveSkillCat = useCallback((idx: number, direction: 'up' | 'down') => {
    const nextIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= skills.length) return;
    
    const updated = [...skills];
    const temp = updated[idx];
    updated[idx] = updated[nextIdx];
    updated[nextIdx] = temp;

    setSkills(updated);
    triggerAutoSave(undefined, updated);
    toast.success('Skills rearrangement completed.');
  }, [skills, triggerAutoSave]);

  // LANGUAGES
  const handleAddLanguage = useCallback(() => {
    if (!newLangName.trim()) return;

    let updated: CVLanguage[];

    if (editingLangIdx !== null) {
      updated = [...languages];
      updated[editingLangIdx] = {
        name: newLangName.trim(),
        level: newLangLevel,
      };
      setEditingLangIdx(null);
      toast.success('Language proficiency updated.');
    } else {
      const newLang: CVLanguage = {
        name: newLangName.trim(),
        level: newLangLevel,
      };
      updated = [...languages, newLang];
      toast.success('Language entry registered.');
    }

    setLanguages(updated);
    setNewLangName('');
    triggerAutoSave(undefined, undefined, updated);
  }, [newLangName, editingLangIdx, languages, newLangLevel, triggerAutoSave]);

  const handleStartEditLang = useCallback((idx: number) => {
    const lang = languages[idx];
    setEditingLangIdx(idx);
    setNewLangName(lang.name);
    setNewLangLevel(lang.level);
  }, [languages]);

  const handleCancelEditLang = useCallback(() => {
    setEditingLangIdx(null);
    setNewLangName('');
    setNewLangLevel('Native / Bilingual');
  }, []);

  const handleRemoveLanguage = useCallback((idx: number) => {
    const updated = languages.filter((_, i) => i !== idx);
    setLanguages(updated);
    triggerAutoSave(undefined, undefined, updated);
    toast.success('Language profile entry deleted and synced.');
    if (editingLangIdx === idx) {
      handleCancelEditLang();
    }
  }, [languages, editingLangIdx, handleCancelEditLang, triggerAutoSave]);

  const handleMoveLanguage = useCallback((idx: number, direction: 'up' | 'down') => {
    const nextIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= languages.length) return;

    const updated = [...languages];
    const temp = updated[idx];
    updated[idx] = updated[nextIdx];
    updated[nextIdx] = temp;

    setLanguages(updated);
    triggerAutoSave(undefined, undefined, updated);
    toast.success('Languages sequence updated.');
  }, [languages, triggerAutoSave]);

  // REFERENCES
  const handleAddReference = useCallback(() => {
    if (!newRefName.trim() || !newRefContact.trim()) {
      toast.error('Reference name and contact info are required.');
      return;
    }

    let updated: CVReference[];

    if (editingRefIdx !== null) {
      updated = [...references];
      updated[editingRefIdx] = {
        name: newRefName.trim(),
        position: newRefPos.trim(),
        company: newRefComp.trim(),
        contact: newRefContact.trim(),
      };
      setEditingRefIdx(null);
      toast.success('Reference details updated and saved.');
    } else {
      const newRef: CVReference = {
        name: newRefName.trim(),
        position: newRefPos.trim(),
        company: newRefComp.trim(),
        contact: newRefContact.trim(),
      };
      updated = [...references, newRef];
      toast.success('Reference person registered.');
    }

    setReferences(updated);
    setNewRefName('');
    setNewRefPos('');
    setNewRefComp('');
    setNewRefContact('');
    triggerAutoSave(undefined, undefined, undefined, updated);
  }, [newRefName, newRefContact, editingRefIdx, references, newRefPos, newRefComp, triggerAutoSave]);

  const handleStartEditRef = useCallback((idx: number) => {
    const ref = references[idx];
    setEditingRefIdx(idx);
    setNewRefName(ref.name);
    setNewRefPos(ref.position);
    setNewRefComp(ref.company);
    setNewRefContact(ref.contact);
  }, [references]);

  const handleCancelEditRef = useCallback(() => {
    setEditingRefIdx(null);
    setNewRefName('');
    setNewRefPos('');
    setNewRefComp('');
    setNewRefContact('');
  }, []);

  const handleRemoveReference = useCallback((idx: number) => {
    const updated = references.filter((_, i) => i !== idx);
    setReferences(updated);
    triggerAutoSave(undefined, undefined, undefined, updated);
    toast.success('Reference entry deleted and synced.');
    if (editingRefIdx === idx) {
      handleCancelEditRef();
    }
  }, [references, editingRefIdx, handleCancelEditRef, triggerAutoSave]);

  const handleMoveReference = useCallback((idx: number, direction: 'up' | 'down') => {
    const nextIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= references.length) return;

    const updated = [...references];
    const temp = updated[idx];
    updated[idx] = updated[nextIdx];
    updated[nextIdx] = temp;

    setReferences(updated);
    triggerAutoSave(undefined, undefined, undefined, updated);
    toast.success('References sequence updated.');
  }, [references, triggerAutoSave]);

  // Aesthetic Style template changes
  const handleSelectTemplate = useCallback((look: 'modern' | 'classic' | 'creative') => {
    setTemplate(look);
    triggerAutoSave(undefined, undefined, undefined, undefined, look);
    toast.success(`Active aesthetic style set to ${look}.`);
  }, [triggerAutoSave]);

  // MASTER MANUAL ACTION
  const handleSaveCV = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!personalName || !personalEmail || !personalPhone) {
      toast.error('Master CV Personal details (Name, Email, Phone) are required.');
      return;
    }

    setIsSaving(true);
    const success = await updateCV({
      personalInfo: {
        name: personalName,
        email: personalEmail,
        phone: personalPhone,
        address: personalAddress,
        website: personalWebsite,
        title: personalTitle,
        summary: personalSummary,
      },
      sections,
      skills,
      languages,
      references,
      template,
    });
    setIsSaving(false);
  }, [personalName, personalEmail, personalPhone, personalAddress, personalWebsite, personalTitle, personalSummary, sections, skills, languages, references, template, updateCV]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-10 text-xs text-left animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div className="space-y-1 text-left">
          <Heading level={1} className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Manage CV Resume Master
          </Heading>
          <Paragraph className="text-xs text-slate-505 font-semibold uppercase tracking-widest text-blue-600 leading-relaxed bg-transparent">
            Define personal info, rich work sections, categorized skill tags, and PDF templates
          </Paragraph>
        </div>

        {/* Global save button */}
        <Button
          onClick={handleSaveCV}
          isLoading={isSaving}
          className="px-5 py-2.5"
        >
          {isSaving ? 'Storing CV...' : 'Save Complete CV'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left main pane: personal details & multi sections */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 1: Personal Details */}
          <Card className="space-y-6">
            <Heading level={2} className="text-base font-bold text-slate-900 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-850 pb-3">
              <FileText size={18} className="text-blue-600 mr-2 animate-pulse" />
              Primary Personal Info
            </Heading>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="cv-name"
                type="text"
                required
                label="Full Professional Name"
                placeholder="Sarah Dev"
                value={personalName}
                onChange={(e) => setPersonalName(e.target.value)}
              />

              <Input
                id="cv-title"
                type="text"
                required
                label="Professional Title"
                placeholder="Senior Full-Stack & AI Engineer"
                value={personalTitle}
                onChange={(e) => setPersonalTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                id="cv-email"
                type="email"
                required
                label="Contact Email"
                placeholder="sarah.dev@portfolio.com"
                value={personalEmail}
                onChange={(e) => setPersonalEmail(e.target.value)}
              />

              <Input
                id="cv-phone"
                type="text"
                required
                label="Phone Number"
                placeholder="+1 (555) 019-2831"
                value={personalPhone}
                onChange={(e) => setPersonalPhone(e.target.value)}
              />

              <Input
                id="cv-web"
                type="text"
                label="Portfolio Website"
                placeholder="https://sarahdev.example.com"
                value={personalWebsite}
                onChange={(e) => setPersonalWebsite(e.target.value)}
              />
            </div>

            <Input
              id="cv-add"
              type="text"
              label="Physical Address"
              placeholder="San Francisco, CA"
              value={personalAddress}
              onChange={(e) => setPersonalAddress(e.target.value)}
            />

            <Textarea
              id="cv-sum"
              rows={4}
              label="Executive Profile Summary"
              placeholder="Resourceful Full-Stack developer with..."
              value={personalSummary}
              onChange={(e) => setPersonalSummary(e.target.value)}
              className="whitespace-pre-line"
            />
          </Card>

          {/* Section 2: Custom Multi Sections */}
          <Card className="space-y-6">
            <Heading level={2} className="text-base font-bold text-slate-900 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <FolderDot size={18} className="text-blue-600 mr-2" />
              Work Experience & Custom Sections
            </Heading>

            {/* Quick Adding Segment */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-xl flex gap-2">
              <input
                type="text"
                placeholder="Create new section (e.g. Professional Experience)"
                value={newSecTitle}
                onChange={(e) => setNewSecTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSection();
                  }
                }}
                className="flex-1 p-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-950 dark:text-white"
              />
              <Button
                type="button"
                onClick={handleAddSection}
                className="px-4 py-2 text-xs h-auto"
              >
                Create
              </Button>
            </div>

            {/* Existing Sections Accordion Loop */}
            {sections.length > 0 ? (
              <div className="space-y-6">
                {sections.map((section) => (
                  <div key={section.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-left relative space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      {editingSectionId === section.id ? (
                        <div className="flex items-center space-x-2 flex-1 mr-4">
                          <input
                            type="text"
                            value={editingSectionTitle}
                            onChange={(e) => setEditingSectionTitle(e.target.value)}
                            className="flex-1 p-2 text-xs border border-blue-400 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={handleSaveSectionTitle}
                            className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 rounded"
                            title="Save Title"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEditSectionTitle}
                            className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 rounded"
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Heading level={3} className="font-extrabold text-sm text-slate-900 dark:text-white">{section.title}</Heading>
                          <button
                            type="button"
                            onClick={() => handleStartEditSectionTitle(section.id, section.title)}
                            className="p-1 text-slate-400 hover:text-slate-705 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition cursor-pointer"
                            title="Rename Section"
                          >
                            <Edit2 size={11} />
                          </button>
                          {/* Reordering high level section */}
                          <div className="flex items-center space-x-0.5">
                            <button
                              type="button"
                              onClick={() => handleMoveSection(section.id, 'up')}
                              className="p-1 text-slate-400 hover:text-slate-705 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition cursor-pointer"
                              title="Move section up"
                            >
                              <ArrowUp size={11} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveSection(section.id, 'down')}
                              className="p-1 text-slate-400 hover:text-slate-705 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition cursor-pointer"
                              title="Move section down"
                            >
                              <ArrowDown size={11} />
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleRemoveSection(section.id)}
                        className="px-2 py-1 h-auto text-[10px] text-red-600 border-red-100 dark:border-red-950/40 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900 dark:text-red-400 flex items-center space-x-1"
                      >
                        <Trash2 size={11} />
                        <Span className="font-bold text-[10px]">Remove Section</Span>
                      </Button>
                    </div>

                    {/* Section Nested items */}
                    <div className="space-y-4">
                      {section.items && section.items.length > 0 ? (
                        <div className="space-y-3">
                          {section.items.map((item, idx) => (
                            <div key={item.id || idx} className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-100 dark:border-slate-800 relative space-y-1.5 flex justify-between items-start">
                              <div className="space-y-1 flex-1">
                                <Paragraph className="font-bold text-slate-800 dark:text-slate-200 leading-tight">
                                  {item.title} &mdash; <span className="font-semibold text-blue-600 dark:text-blue-400">{item.subtitle}</span>
                                </Paragraph>
                                <Paragraph className="text-[10px] text-slate-400 font-bold">{item.date}</Paragraph>
                                {item.description && <Paragraph className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal font-normal">{item.description}</Paragraph>}
                                {item.highlights && (
                                  <div className="text-[9px] text-slate-505 dark:text-slate-400 font-normal leading-normal italic pl-2 border-l border-slate-200 dark:border-slate-800 mt-1 max-w-md">
                                    <span className="font-semibold">Highlights:</span>{" "}
                                    {item.highlights.split("\n").filter(Boolean)[0] || ""}
                                    {item.highlights.split("\n").filter(Boolean).length > 1 ? " ..." : ""}
                                  </div>
                                )}
                                <div className="flex flex-wrap gap-2 text-[9px] pt-1 font-bold">
                                  {item.skills && <Span className="text-slate-450 uppercase">Tags: {item.skills}</Span>}
                                  {item.githubUrl && <Span className="text-blue-600 dark:text-blue-400 uppercase flex items-center gap-0.5"><Github size={10} /> GitHub Set</Span>}
                                  {item.websiteUrl && <Span className="text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-0.5"><Globe size={10} /> Website Set</Span>}
                                </div>
                              </div>
                              <div className="flex items-center space-x-1.5 ml-2 flex-shrink-0">
                                {/* Item reordering keys */}
                                <div className="flex items-center space-x-0.5 border-r border-slate-200 dark:border-slate-800 pr-1.5 mr-1">
                                  <button
                                    type="button"
                                    onClick={() => handleMoveNestedItem(section.id, item.id || '', 'up')}
                                    className="p-1 hover:bg-slate-205 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition cursor-pointer"
                                    title="Move item up"
                                  >
                                    <ArrowUp size={11} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveNestedItem(section.id, item.id || '', 'down')}
                                    className="p-1 hover:bg-slate-205 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition cursor-pointer"
                                    title="Move item down"
                                  >
                                    <ArrowDown size={11} />
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditNestedItem(section.id, item)}
                                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-505 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded transition cursor-pointer"
                                  title="Edit entry details"
                                >
                                  <Edit2 size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveNestedItem(section.id, item.id || '', idx)}
                                  className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 rounded transition cursor-pointer"
                                  title="Remove nested item"
                                >
                                  <X size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-450 text-[10px] italic">No nested experience logs added to this section.</p>
                      )}

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleOpenAddNestedItem(section.id)}
                        className="inline-flex items-center text-[10px] font-bold text-blue-600 dark:text-blue-400 p-0 hover:underline h-auto shadow-none"
                      >
                        <PlusCircle size={13} className="mr-1" />
                        Add Item to section...
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-400 text-[11px] py-4 bg-slate-50/50 dark:bg-slate-900/10 rounded-xl">No sections created yet.</p>
            )}
          </Card>
        </div>

        {/* Right sub-pane: category skills, template styles, languages, and references */}
        <div className="lg:col-span-5 space-y-8 text-left">
          
          {/* Template presets picker */}
          <Card className="space-y-4">
            <Heading level={5} className="text-sm font-bold text-slate-905 dark:text-white">Select Template Look</Heading>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleSelectTemplate('modern')}
                className={`p-3 text-left border rounded-xl transition flex justify-between items-center cursor-pointer ${
                  template === 'modern' ? 'border-slate-805 dark:border-slate-700 bg-slate-900 dark:bg-slate-850 text-white' : 'border-slate-205 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/30 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-left space-y-0.5">
                  <p className="text-xs font-bold">Modern Grid Presets</p>
                  <p className={`text-[10px] font-normal leading-normal ${template === 'modern' ? 'text-slate-350' : 'text-slate-400'}`}>
                    Asymmetric left-right grid with bold badges. Better for technical devs.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTemplate('classic')}
                className={`p-3 text-left border rounded-xl transition flex justify-between items-center cursor-pointer ${
                  template === 'classic' ? 'border-slate-805 dark:border-slate-700 bg-slate-900 dark:bg-slate-850 text-white' : 'border-slate-205 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/30 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-left space-y-0.5">
                  <p className="text-xs font-bold">Classic Corporate Style</p>
                  <p className={`text-[10px] font-normal leading-normal ${template === 'classic' ? 'text-slate-350' : 'text-slate-400'}`}>
                    Centered headings with traditional resume layouts. Standard serif styles.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTemplate('creative')}
                className={`p-3 text-left border rounded-xl transition flex justify-between items-center cursor-pointer ${
                  template === 'creative' ? 'border-slate-805 dark:border-slate-700 bg-slate-900 dark:bg-slate-850 text-white' : 'border-slate-205 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/30 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-left space-y-0.5">
                  <p className="text-xs font-bold">Creative Tinted Presets</p>
                  <p className={`text-[10px] font-normal leading-normal ${template === 'creative' ? 'text-slate-350' : 'text-slate-400'}`}>
                    Premium background tinting with gradient highlights and clean accents.
                  </p>
                </div>
              </button>
            </div>
          </Card>

          {/* Categorized CV Skills */}
          <Card className="space-y-4">
            <Heading level={5} className="text-sm font-bold text-slate-900 dark:text-white">Categorized Skill Lists</Heading>
            
            <div className={`p-4 rounded-xl space-y-3 border ${editingSkillIdx !== null ? 'bg-indigo-50/55 border-indigo-150 dark:bg-indigo-950/10 dark:border-indigo-900' : 'bg-slate-50 border-slate-150 dark:bg-slate-950 dark:border-slate-850'}`}>
              <p className="text-[10px] font-bold text-indigo-755 dark:text-indigo-400 uppercase">
                {editingSkillIdx !== null ? 'Modify Competency Category' : 'Create Skill Category'}
              </p>
              
              <input
                placeholder="e.g. Frameworks / Tools"
                value={newSkillCat}
                onChange={(e) => setNewSkillCat(e.target.value)}
                className="w-full p-2 text-xs border border-slate-205 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />

              <input
                placeholder="e.g. React, Express (Comma separated)"
                value={newSkillItems}
                onChange={(e) => setNewSkillItems(e.target.value)}
                className="w-full p-2 text-xs border border-slate-205 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleAddSkillCat}
                  className="flex-1 py-2 text-xs h-auto"
                >
                  {editingSkillIdx !== null ? 'Update Category' : 'Add Category'}
                </Button>
                {editingSkillIdx !== null && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEditSkillCat}
                    className="py-2 text-xs h-auto"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>

            {/* List */}
            {skills.length > 0 && (
              <div className="space-y-2.5 max-h-[30vh] overflow-y-auto pr-1 text-left">
                {skills.map((cat, sidx) => (
                  <div key={sidx} className={`p-3 border rounded-lg flex justify-between items-start ${editingSkillIdx === sidx ? 'bg-indigo-50/20 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-805' : 'border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 bg-opacity-40'}`}>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <p className="font-bold text-slate-850 dark:text-slate-200 truncate">{cat.category}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal break-words">{cat.items.join(', ')}</p>
                    </div>
                    <div className="flex items-center space-x-1.5 ml-2 flex-shrink-0 text-left">
                      {/* Reorder buttons */}
                      <div className="flex items-center space-x-0.5 border-r border-slate-200 dark:border-slate-800 pr-1.5 mr-1">
                        <button
                          type="button"
                          onClick={() => handleMoveSkillCat(sidx, 'up')}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded transition cursor-pointer"
                          title="Move category up"
                        >
                          <ArrowUp size={11} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveSkillCat(sidx, 'down')}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded transition cursor-pointer"
                          title="Move category down"
                        >
                          <ArrowDown size={11} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleStartEditSkillCat(sidx)}
                        className="p-1 hover:bg-slate-250 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-850 dark:hover:text-white rounded transition cursor-pointer"
                        title="Edit category"
                      >
                        <Edit2 size={11} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkillCat(sidx)}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 transition rounded cursor-pointer"
                        title="Remove category"
                      >
                         <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Languages spoken */}
          <Card className="space-y-4">
            <Heading level={5} className="text-sm font-bold text-slate-900 dark:text-white">Spoken Languages</Heading>

             <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl space-y-3">
              <p className="text-[10px] font-bold text-slate-705 dark:text-slate-350 uppercase">
                {editingLangIdx !== null ? 'Modify Language Spoken' : 'Add Language'}
              </p>
              
              <div className="flex gap-2">
                <input
                  placeholder="e.g. English, Spanish"
                  value={newLangName}
                  onChange={(e) => setNewLangName(e.target.value)}
                  className="flex-1 p-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-white dark:bg-slate-950 text-slate-950 dark:text-white font-medium"
                />

                <select
                  value={newLangLevel}
                  onChange={(e) => setNewLangLevel(e.target.value)}
                  className="p-2 text-xs border border-slate-205 dark:border-slate-800 rounded-lg focus:outline-none bg-white dark:bg-slate-950 text-slate-950 dark:text-white font-medium cursor-pointer"
                >
                  <option value="Native / Bilingual">Native / Bilingual</option>
                  <option value="Full Professional">Full Professional</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Basic / Conversational">Basic / Conversational</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleAddLanguage}
                  className="flex-1 py-2 text-xs h-auto"
                >
                  {editingLangIdx !== null ? 'Update Language' : 'Add Language'}
                </Button>
                {editingLangIdx !== null && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEditLang}
                    className="py-2 text-xs h-auto"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>

            {/* List */}
            {languages.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {languages.map((lang, lidx) => (
                  <div key={lidx} className={`flex justify-between items-center p-2.5 border border-slate-101 dark:border-slate-850 rounded-lg bg-slate-50/50 dark:bg-slate-900/20 ${editingLangIdx === lidx ? 'border-blue-350 bg-blue-50/20 dark:border-blue-800' : ''}`}>
                    <span className="font-bold text-slate-850 dark:text-slate-200">
                      {lang.name} &mdash; <span className="text-slate-450 dark:text-slate-400 font-normal">{lang.level}</span>
                    </span>
                    <div className="flex items-center space-x-1.5">
                      {/* Language Reordering Controls */}
                      <div className="flex items-center space-x-0.5">
                        <button
                          type="button"
                          onClick={() => handleMoveLanguage(lidx, 'up')}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition cursor-pointer"
                          title="Move language up"
                        >
                          <ArrowUp size={11} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveLanguage(lidx, 'down')}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition cursor-pointer"
                          title="Move language down"
                        >
                          <ArrowDown size={11} />
                        </button>
                      </div>
                      
                      {/* Language Edit and Delete Actions */}
                      <button
                        type="button"
                        onClick={() => handleStartEditLang(lidx)}
                        className="p-1 text-slate-400 hover:text-slate-705 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition cursor-pointer"
                        title="Edit language Details"
                      >
                        <Edit2 size={11} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveLanguage(lidx)}
                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition cursor-pointer"
                        title="Delete language"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* References */}
          <Card className="space-y-4">
            <Heading level={5} className="text-sm font-bold text-slate-900 dark:text-white">Professional References</Heading>

            <div className={`p-4 rounded-xl space-y-3 text-left border ${editingRefIdx !== null ? 'bg-indigo-50/55 border-indigo-150 dark:bg-indigo-950/10' : 'bg-slate-50 border-slate-150 dark:bg-slate-950 dark:border-slate-850'}`}>
              <p className="text-[10px] font-bold text-slate-705 dark:text-slate-350 uppercase">
                {editingRefIdx !== null ? 'Modify Reference Details' : 'Add Reference Person'}
              </p>

              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Full Name (e.g. David)"
                  value={newRefName}
                  onChange={(e) => setNewRefName(e.target.value)}
                  className="p-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-medium"
                />
                <input
                  placeholder="Company Name (e.g. Apex)"
                  value={newRefComp}
                  onChange={(e) => setNewRefComp(e.target.value)}
                  className="p-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Position (e.g. VP)"
                  value={newRefPos}
                  onChange={(e) => setNewRefPos(e.target.value)}
                  className="p-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-medium"
                />
                <input
                  placeholder="Contact (e.g. email / tel)"
                  value={newRefContact}
                  onChange={(e) => setNewRefContact(e.target.value)}
                  className="p-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-medium"
                />
              </div>

              <div className="flex gap-2 text-left">
                <Button
                  type="button"
                  onClick={handleAddReference}
                  className="flex-1 py-2 text-xs h-auto shadow-xs"
                >
                  {editingRefIdx !== null ? 'Update Reference' : 'Register Reference'}
                </Button>
                {editingRefIdx !== null && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEditRef}
                    className="py-2 text-xs h-auto"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>

            {/* List */}
            {references.length > 0 && (
              <div className="space-y-2.5 max-h-[30vh] overflow-y-auto pr-1 text-left">
                {references.map((ref, idx) => (
                  <div key={idx} className={`p-3 border rounded-lg bg-slate-50/50 dark:bg-slate-900/20 flex justify-between items-start ${editingRefIdx === idx ? 'border-indigo-350 bg-indigo-50/20 dark:border-indigo-800' : 'border-slate-100 dark:border-slate-850'}`}>
                    <div>
                      <Paragraph className="font-bold text-slate-800 dark:text-slate-200 text-xs leading-none">{ref.name}</Paragraph>
                      <Paragraph className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal mt-1">{ref.position} &bull; {ref.company}</Paragraph>
                      <Paragraph className="text-[9px] text-slate-400 dark:text-slate-505 font-mono italic mt-0.5">{ref.contact}</Paragraph>
                    </div>
                    <div className="flex items-center space-x-1 ml-2 flex-shrink-0 text-left">
                      {/* References sequence reorder */}
                      <div className="flex items-center space-x-0.5">
                        <button
                          type="button"
                          onClick={() => handleMoveReference(idx, 'up')}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition cursor-pointer"
                          title="Move reference up"
                        >
                          <ArrowUp size={11} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveReference(idx, 'down')}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition cursor-pointer"
                          title="Move reference down"
                        >
                          <ArrowDown size={11} />
                        </button>
                      </div>

                      {/* Reference edit/delete */}
                      <button
                        type="button"
                        onClick={() => handleStartEditRef(idx)}
                        className="p-1 text-slate-400 hover:text-slate-705 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition cursor-pointer"
                        title="Edit Reference"
                      >
                        <Edit2 size={11} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveReference(idx)}
                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-55 dark:hover:bg-red-950/20 rounded transition cursor-pointer"
                        title="Delete Reference"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Dynamic Item Add/Edit Modal overlay */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <Card className="max-w-lg w-full p-0 overflow-hidden text-left transform transition-all duration-250">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Heading level={4} className="text-base font-extrabold text-slate-900 dark:text-white uppercase leading-none">
                {editingItemId ? 'Edit Experience Item' : 'Add Experience Item'}
              </Heading>
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="p-1 px-1.5 text-slate-400 hover:text-slate-655 dark:hover:text-slate-200 font-bold transition rounded-md hover:bg-slate-50 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Inputs Form */}
            <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <Input
                label="Professional Title / Role"
                type="text"
                placeholder="e.g. Lead Software Architect"
                value={itemFormTitle}
                onChange={(e) => setItemFormTitle(e.target.value)}
              />

              <Input
                label="Institution / Company"
                type="text"
                placeholder="e.g. Innovative Tech Corp"
                value={itemFormSubtitle}
                onChange={(e) => setItemFormSubtitle(e.target.value)}
              />

              <Input
                label="Date Duration"
                type="text"
                placeholder="e.g. June 2023 - Present"
                value={itemFormDate}
                onChange={(e) => setItemFormDate(e.target.value)}
              />

              <Textarea
                rows={3}
                label="Description Details"
                placeholder="Outline core accomplishments, projects managed, and processes optimized..."
                value={itemFormDescription}
                onChange={(e) => setItemFormDescription(e.target.value)}
              />

              <Input
                label="Associated Skills (Comma separated)"
                type="text"
                placeholder="e.g. React, Node.js, Kubernetes"
                value={itemFormSkills}
                onChange={(e) => setItemFormSkills(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="GitHub Repo URL (Optional)"
                  type="url"
                  placeholder="e.g. https://github.com/user/repo"
                  value={itemFormGithub}
                  onChange={(e) => setItemFormGithub(e.target.value)}
                />

                <Input
                  label="Website / Live URL (Optional)"
                  type="url"
                  placeholder="e.g. https://myproject.com"
                  value={itemFormWebsite}
                  onChange={(e) => setItemFormWebsite(e.target.value)}
                />
              </div>

              <Textarea
                rows={3}
                label="Highlighted Features / Key Achievements (One per line)"
                placeholder="e.g.&#10;• Designed and developed new cloud microservices&#10;• Implemented real-time synchronization with 99.9% uptime"
                value={itemFormHighlights}
                onChange={(e) => setItemFormHighlights(e.target.value)}
              />
            </div>

            {/* Footer buttons */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsItemModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveNestedItem}
              >
                {editingItemId ? 'Update Entry' : 'Append Entry'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CVPage;
