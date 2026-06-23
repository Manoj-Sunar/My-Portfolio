import React, { useState, useEffect, useCallback } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import ImageUpload from '../../components/common/ImageUpload';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  User,
  Plus,
  Trash2,
  Cpu,
  Award,
  Edit2,
} from 'lucide-react';
import { Card, Input, Textarea, Button, Heading, Paragraph, Label, Span } from '../../components/common/UI';
import toast from 'react-hot-toast';

const iconOptions = ['Code', 'Layers', 'Server', 'Palette', 'Database', 'Cloud', 'Award', 'Zap', 'Cpu'];

const AboutPage: React.FC = () => {
  const { about, updateAbout, isLoading } = usePortfolio();

  // Primary States
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [image, setImage] = useState<{ url: string; publicId: string } | null>(null);

  // Lists
  const [skills, setSkills] = useState<Array<{ name: string; level: number; icon: string }>>([]);
  const [achievements, setAchievements] = useState<Array<{ title: string; description: string; icon: string }>>([]);

  // Adding single-item states
  const [newSkillName, setNewSkillName] = useState<string>('');
  const [newSkillLevel, setNewSkillLevel] = useState<number>(80);
  const [newSkillIcon, setNewSkillIcon] = useState<string>('Code');

  const [newAchTitle, setNewAchTitle] = useState<string>('');
  const [newAchDesc, setNewAchDesc] = useState<string>('');
  const [newAchIcon, setNewAchIcon] = useState<string>('Award');

  // Edit Indexes
  const [editingSkillIdx, setEditingSkillIdx] = useState<number | null>(null);
  const [editingAchIdx, setEditingAchIdx] = useState<number | null>(null);

  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Sync state on load
  useEffect(() => {
    if (about) {
      setTitle(about.title || '');
      setContent(about.content || '');
      setImage(about.image || null);
      setSkills(
        (about.skills || []).map((s) => ({
          name: s.name,
          level: s.level,
          icon: s.icon ?? 'Code',
        }))
      );
      setAchievements(
        (about.achievements || []).map((a) => ({
          title: a.title,
          description: a.description,
          icon: a.icon ?? 'Award',
        }))
      );
    }
  }, [about]);

  const handleAddSkill = useCallback(() => {
    if (!newSkillName.trim()) {
      toast.error('Please specify a capability name.');
      return;
    }

    if (editingSkillIdx !== null) {
      const updated = [...skills];
      updated[editingSkillIdx] = { name: newSkillName.trim(), level: newSkillLevel, icon: newSkillIcon };
      setSkills(updated);
      setEditingSkillIdx(null);
      toast.success('Skill category parameters updated.');
    } else {
      const exists = skills.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase());
      if (exists) {
        toast.error('That capability is already registered.');
        return;
      }
      setSkills((prev) => [...prev, { name: newSkillName.trim(), level: newSkillLevel, icon: newSkillIcon }]);
      toast.success('Skill added to checklist.');
    }

    setNewSkillName('');
    setNewSkillLevel(80);
    setNewSkillIcon('Code');
  }, [newSkillName, editingSkillIdx, skills, newSkillLevel, newSkillIcon]);

  const handleStartEditSkill = useCallback((idx: number) => {
    const sk = skills[idx];
    setEditingSkillIdx(idx);
    setNewSkillName(sk.name);
    setNewSkillLevel(sk.level);
    setNewSkillIcon(sk.icon || 'Code');
  }, [skills]);

  const handleCancelEditSkill = useCallback(() => {
    setEditingSkillIdx(null);
    setNewSkillName('');
    setNewSkillLevel(80);
    setNewSkillIcon('Code');
  }, []);

  const handleRemoveSkill = useCallback((name: string) => {
    setSkills((prev) => prev.filter((s) => s.name !== name));
    if (editingSkillIdx !== null && skills[editingSkillIdx]?.name === name) {
      handleCancelEditSkill();
    }
  }, [editingSkillIdx, skills, handleCancelEditSkill]);

  const handleLevelChange = useCallback((index: number, val: number) => {
    setSkills((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], level: val };
      return updated;
    });
  }, []);

  const handleAddAchievement = useCallback(() => {
    if (!newAchTitle.trim() || !newAchDesc.trim()) {
      toast.error('Accolade titles and descriptions cannot be empty.');
      return;
    }

    if (editingAchIdx !== null) {
      const updated = [...achievements];
      updated[editingAchIdx] = { title: newAchTitle.trim(), description: newAchDesc.trim(), icon: newAchIcon };
      setAchievements(updated);
      setEditingAchIdx(null);
      toast.success('Award details updated.');
    } else {
      setAchievements((prev) => [...prev, { title: newAchTitle.trim(), description: newAchDesc.trim(), icon: newAchIcon }]);
      toast.success('Award catalogued.');
    }

    setNewAchTitle('');
    setNewAchDesc('');
    setNewAchIcon('Award');
  }, [newAchTitle, newAchDesc, editingAchIdx, achievements, newAchIcon]);

  const handleStartEditAchievement = useCallback((idx: number) => {
    const ach = achievements[idx];
    setEditingAchIdx(idx);
    setNewAchTitle(ach.title);
    setNewAchDesc(ach.description);
    setNewAchIcon(ach.icon || 'Award');
  }, [achievements]);

  const handleCancelEditAchievement = useCallback(() => {
    setEditingAchIdx(null);
    setNewAchTitle('');
    setNewAchDesc('');
    setNewAchIcon('Award');
  }, []);

  const handleRemoveAchievement = useCallback((idx: number) => {
    setAchievements((prev) => prev.filter((_, i) => i !== idx));
    if (editingAchIdx === idx) {
      handleCancelEditAchievement();
    }
  }, [editingAchIdx, handleCancelEditAchievement]);

  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      toast.error('Biography title and main paragraphs are required.');
      return;
    }

    setIsSaving(true);
    await updateAbout({
      title,
      content,
      image: image || { url: '', publicId: '' },
      skills,
      achievements,
    });
    setIsSaving(false);
  }, [title, content, image, skills, achievements, updateAbout]);

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
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <Heading level={1} className="text-slate-900 dark:text-white leading-tight">
          Manage About Me Summary
        </Heading>
        <Paragraph className="text-xs text-slate-500 font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 leading-relaxed bg-transparent mt-1">
          Sync biography parameters, technical rating sliders, and accolade credentials
        </Paragraph>
      </div>

      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        {/* Left pane: core details & biography text */}
        <Card className="lg:col-span-7">
          <div className="space-y-6">
            <Heading level={4} className="text-base font-bold text-slate-900 dark:text-white flex items-center mb-1 border-b border-slate-100 dark:border-slate-850 pb-3">
              <User size={18} className="text-blue-600 mr-2" />
              <span>Biographical Content</span>
            </Heading>

            <Input
              id="about-title"
              type="text"
              required
              label="Biography Heading"
              placeholder="e.g. Hi, I am Sarah"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Textarea
              id="about-paragraphs"
              rows={8}
              required
              label="Biography paragraphs"
              placeholder="Write a high-fidelity summary of your professional journey, technical projects, and creative goals..."
              value={content}
              onChange={(e) => setContent(e.target.value)}

            />

            {/* Profile pic section */}
            <div className="space-y-1.5">
              <Label>About profile Image</Label>
              <ImageUpload
                value={image || undefined}
                onChange={(val) => setImage(val)}
                folder="about"
              />
            </div>

            {/* Form Actions Footer block */}
            <div className="pt-4 border-t border-slate-150 dark:border-slate-800 flex items-center justify-end">
              <Button
                type="submit"
                isLoading={isSaving}
                className="px-6 py-2"
              >
                Save Biography updates
              </Button>
            </div>
          </div>
        </Card>

        {/* Right pane: Skills and Achievements widgets */}
        <div className="lg:col-span-5 space-y-8 text-left">
          {/* A_1. Skills List and ratings sliders */}
          <Card>
            <div className="space-y-5">
              <Heading level={4} className="text-base font-bold text-slate-900 dark:text-white flex items-center mb-1 border-b border-slate-100 dark:border-slate-850 pb-3">
                <Cpu size={18} className="text-blue-600 mr-2" />
                <span>Technical Skills & Sliders</span>
              </Heading>

              {/* Quick adding line */}
              <div className={`p-4 border rounded-xl space-y-3 ${editingSkillIdx !== null ? 'bg-indigo-50/55 border-indigo-150 dark:bg-indigo-950/20 dark:border-indigo-900' : 'bg-slate-50 border-slate-150 dark:bg-slate-900/60 dark:border-slate-800'}`}>
                <Paragraph className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase leading-none bg-transparent">
                  {editingSkillIdx !== null ? 'Modify Competency rating' : 'Register new capability'}
                </Paragraph>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Next.js, GCP"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="flex-1 p-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-white dark:bg-slate-950 text-slate-905 dark:text-white"
                  />

                  <select
                    value={newSkillIcon}
                    onChange={(e) => setNewSkillIcon(e.target.value)}
                    className="p-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-white dark:bg-slate-950 text-slate-905 dark:text-white cursor-pointer"
                  >
                    {iconOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 text-left">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <Span className="text-slate-500 dark:text-slate-400 font-bold text-[10px]">Proficiency rating</Span>
                    <Span className="text-blue-600 dark:text-blue-400 font-bold text-[10px]">{newSkillLevel}%</Span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                    className="w-full text-blue-600 accent-blue-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleAddSkill}
                    className="flex-1 py-2 text-xs h-auto"
                  >
                    {editingSkillIdx !== null ? 'Update parameters' : 'Add Skill'}
                  </Button>
                  {editingSkillIdx !== null && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEditSkill}
                      className="py-2 text-xs h-auto"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>

              {/* Existing Skills lists */}
              {skills.length > 0 ? (
                <div className="space-y-4 pt-2">
                  <Paragraph className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 leading-none bg-transparent">
                    Active technical skill stack ({skills.length})
                  </Paragraph>
                  <div className="space-y-4 max-h-[44vh] overflow-y-auto pr-1">
                    {skills.map((sk, index) => (
                      <div key={sk.name || index} className={`space-y-1.5 border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0 ${editingSkillIdx === index ? 'bg-indigo-50/10 dark:bg-indigo-950/10 p-2 rounded-lg' : ''}`}>
                        <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                          <Span className="font-bold text-xs">{sk.name} ({sk.icon})</Span>
                          <div className="flex items-center space-x-1.5 text-slate-500">
                            <Span className="text-blue-600 dark:text-blue-400 font-extrabold text-[11px] mr-1">{sk.level}%</Span>
                            <button
                              type="button"
                              onClick={() => handleStartEditSkill(index)}
                              className="p-1 hover:bg-slate-150 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded transition cursor-pointer"
                              title="Edit parameters"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(sk.name)}
                              className="p-1 text-slate-400 hover:text-red-550 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-955/10 rounded transition cursor-pointer"
                              title="Remove skill"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Slider controls */}
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={sk.level}
                          onChange={(e) => handleLevelChange(index, Number(e.target.value))}
                          className="w-full text-blue-600 accent-blue-600 cursor-pointer h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 font-medium">No specialized tech skills registered.</div>
              )}
            </div>
          </Card>

          {/* A_2. Achievements & milestones list */}
          <Card>
            <div className="space-y-5">
              <Heading level={4} className="text-base font-bold text-slate-905 dark:text-white flex items-center mb-1 border-b border-slate-100 dark:border-slate-850 pb-3">
                <Award size={18} className="text-blue-600 mr-2" />
                <span>Manage Milestones & Awards</span>
              </Heading>

              {/* Quick adding line */}
              <div className={`p-4 border rounded-xl space-y-3 ${editingAchIdx !== null ? 'bg-indigo-50/55 border-indigo-150 dark:bg-indigo-950/20 dark:border-indigo-900' : 'bg-slate-50 border-slate-150 dark:bg-slate-900/60 dark:border-slate-800'}`}>
                <Paragraph className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase leading-none bg-transparent">
                  {editingAchIdx !== null ? 'Modify Accolade details' : 'Add Accolade or badge'}
                </Paragraph>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Best Speaker / Author"
                    value={newAchTitle || ''}
                    onChange={(e) => setNewAchTitle(e.target.value)}
                    className="sm:col-span-8 p-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-white dark:bg-slate-950 text-slate-905 dark:text-white"
                  />

                  <select
                    value={newAchIcon}
                    onChange={(e) => setNewAchIcon(e.target.value)}
                    className="sm:col-span-4 p-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-white dark:bg-slate-955 text-slate-905 dark:text-white cursor-pointer"
                  >
                    {iconOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <input
                  placeholder="Description of criteria, company name or award summary..."
                  value={newAchDesc || ''}
                  onChange={(e) => setNewAchDesc(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-white dark:bg-slate-955 text-slate-905 dark:text-white"
                />

                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleAddAchievement}
                    className="flex-1 py-2 text-xs h-auto"
                  >
                    {editingAchIdx !== null ? 'Update Accolade' : 'Add Accolade'}
                  </Button>
                  {editingAchIdx !== null && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEditAchievement}
                      className="py-2 text-xs h-auto"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>

              {/* Existing accolade list items */}
              {achievements.length > 0 ? (
                <div className="space-y-3 pt-2">
                  <Paragraph className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 leading-none bg-transparent">
                    Registered awards list ({achievements.length})
                  </Paragraph>
                  <div className="space-y-3 max-h-[44vh] overflow-y-auto pr-1">
                    {achievements.map((ach, index) => (
                      <div key={index} className={`flex justify-between items-start p-3 border rounded-xl ${editingAchIdx === index ? 'bg-indigo-50/25 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-800' : 'border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 bg-opacity-40'}`}>
                        <div className="text-left space-y-0.5 flex-1 min-w-0">
                          <Paragraph className="font-bold text-slate-800 dark:text-slate-200 truncate bg-transparent leading-snug">{ach.title} ({ach.icon})</Paragraph>
                          <Paragraph className="text-[10px] text-slate-550 dark:text-slate-400 leading-normal break-words bg-transparent font-normal">{ach.description}</Paragraph>
                        </div>
                        <div className="flex items-center space-x-1.5 ml-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEditAchievement(index)}
                            className="p-1 hover:bg-slate-250 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded transition cursor-pointer"
                            title="Edit accolade"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveAchievement(index)}
                            className="p-1 hover:bg-red-50 dark:hover:bg-red-955/30 text-slate-400 hover:text-red-600 rounded transition cursor-pointer"
                            title="Remove award"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 font-medium">No specialized accomplishments listed.</div>
              )}
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default AboutPage;
