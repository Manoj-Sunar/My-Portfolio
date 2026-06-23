import React, { useState, useCallback, useMemo } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import ImageUpload from '../../components/common/ImageUpload';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getOptimizedProjectUrl } from '../../utils/imageUtils';
import {
  Laptop,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Search,
  X,
  ExternalLink,
  Github,
  Star
} from 'lucide-react';
import { Card, Input, Textarea, Button, Heading, Paragraph, Span, Label } from '../../components/common/UI';
import toast from 'react-hot-toast';
import { ProjectType } from '../../types';

const ProjectsPage: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject, reorderProjects, isLoading } = usePortfolio();
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<ProjectType | null>(null);
  const [currentTechInput, setCurrentTechInput] = useState<string>('');
  
  // Form State
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<{ url: string; publicId: string } | null>(null);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [liveUrl, setLiveUrl] = useState<string>('');
  const [githubUrl, setGithubUrl] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [featured, setFeatured] = useState<boolean>(false);

  const resetForm = useCallback(() => {
    setTitle('');
    setDescription('');
    setImage(null);
    setTechnologies([]);
    setLiveUrl('');
    setGithubUrl('');
    setCategory('Web Applications');
    setFeatured(false);
    setCurrentTechInput('');
    setEditingProject(null);
  }, []);

  const handleOpenCreate = useCallback(() => {
    resetForm();
    setModalOpen(true);
  }, [resetForm]);

  const handleOpenEdit = useCallback((project: ProjectType) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setImage(project.image || null);
    setTechnologies(project.technologies || []);
    setLiveUrl(project.liveUrl || '');
    setGithubUrl(project.githubUrl || '');
    setCategory(project.category || 'Web Applications');
    setFeatured(project.featured || false);
    setModalOpen(true);
  }, []);

  const handleAddTech = useCallback(() => {
    const trimmed = currentTechInput.trim();
    if (trimmed && !technologies.includes(trimmed)) {
      setTechnologies((prev) => [...prev, trimmed]);
      setCurrentTechInput('');
    }
  }, [currentTechInput, technologies]);

  const handleRemoveTech = useCallback((tech: string) => {
    setTechnologies((prev) => prev.filter((t) => t !== tech));
  }, []);

  const handleSave = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      toast.error('Title and description are required.');
      return;
    }

    const payload = {
      title,
      description,
      image: image || { url: '', publicId: '' },
      technologies,
      liveUrl,
      githubUrl,
      category,
      featured,
    };

    let success = false;
    if (editingProject) {
      success = await updateProject(editingProject.id, payload);
    } else {
      success = await addProject(payload);
    }

    if (success) {
      setModalOpen(false);
      resetForm();
    }
  }, [title, description, image, technologies, liveUrl, githubUrl, category, featured, editingProject, updateProject, addProject, resetForm]);

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (window.confirm(`Are you absolutely sure you want to delete project "${name}"? This action cannot be undone.`)) {
      await deleteProject(id);
    }
  }, [deleteProject]);

  const handleMoveUp = useCallback(async (index: number) => {
    if (index === 0) return;
    const items = [...projects];
    // swap
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;
    
    await reorderProjects(items.map((i) => i.id));
  }, [projects, reorderProjects]);

  const handleMoveDown = useCallback(async (index: number) => {
    if (index === projects.length - 1) return;
    const items = [...projects];
    // swap
    const temp = items[index];
    items[index] = items[index + 1];
    items[index + 1] = temp;
    
    await reorderProjects(items.map((i) => i.id));
  }, [projects, reorderProjects]);

  // Memoized Filter list
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch = searchTerm.toLowerCase();
      return (
        p.title.toLowerCase().includes(matchSearch) ||
        p.category.toLowerCase().includes(matchSearch) ||
        p.technologies.some((t) => t.toLowerCase().includes(matchSearch))
      );
    });
  }, [projects, searchTerm]);

  const getCategoryStyles = useCallback((cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'web applications':
      case 'web development':
      case 'web design':
        return 'bg-blue-50 text-blue-600 border-blue-101 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900';
      case 'mobile applications':
      case 'mobile apps':
      case 'mobile development':
        return 'bg-emerald-50 text-emerald-600 border-emerald-101 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900';
      case 'ui/ux design':
      case 'graphic design':
      case 'design':
        return 'bg-purple-50 text-purple-600 border-purple-101 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900';
      case 'cloud computing':
      case 'backends':
      case 'devops':
        return 'bg-cyan-50 text-cyan-600 border-cyan-101 dark:bg-cyan-950/20 dark:text-cyan-400 dark:border-cyan-900';
      case 'data science':
      case 'artificial intelligence':
      case 'ai / ml':
        return 'bg-rose-50 text-rose-600 border-rose-101 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-201 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800';
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div className="space-y-1">
          <Heading level={1} className="text-slate-900 dark:text-white leading-tight">
            Manage Projects
          </Heading>
          <Paragraph className="text-xs text-slate-500 font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 leading-relaxed bg-transparent">
            Create, edit, delete, and rearrange display sequence
          </Paragraph>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="flex items-center px-4 py-2 cursor-pointer"
        >
          <Plus size={15} className="mr-1.5" />
          Add New Project
        </Button>
      </div>

      {/* Utilities Search and count panel */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects by title, category, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <Paragraph className="text-xs text-slate-500 dark:text-slate-400 font-bold">
          Showing {filteredProjects.length} of {projects.length} Total Projects
        </Paragraph>
      </div>

      {/* Projects Table List */}
      {filteredProjects.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-shadow duration-300">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-150 dark:divide-slate-800">
              <thead className="bg-slate-50/70 dark:bg-slate-950 text-slate-450 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4 text-center w-28">Seq Order</th>
                  <th scope="col" className="px-6 py-4 text-left">Project Metadata</th>
                  <th scope="col" className="px-6 py-4 text-left">Technologies / Tags</th>
                  <th scope="col" className="px-6 py-4 text-left">Visibility / Links</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-305">
                {filteredProjects.map((project, idx) => (
                  <tr key={project.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-colors duration-150">
                    {/* Order buttons */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl p-1.5 shadow-2xs space-x-2 w-max mx-auto">
                        <button
                          onClick={() => handleMoveUp(idx)}
                          disabled={idx === 0}
                          className="p-1 hover:bg-white dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-xs disabled:opacity-20 disabled:hover:shadow-none disabled:hover:text-slate-400 rounded-lg transition cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp size={13} className="stroke-[2.5]" />
                        </button>
                        <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-600 text-white font-mono text-[10px] font-bold shadow-xs select-none">
                          {idx + 1}
                        </span>
                        <button
                          onClick={() => handleMoveDown(idx)}
                          disabled={idx === projects.length - 1}
                          className="p-1 hover:bg-white dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-xs disabled:opacity-20 disabled:hover:shadow-none disabled:hover:text-slate-400 rounded-lg transition cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown size={13} className="stroke-[2.5]" />
                        </button>
                      </div>
                    </td>

                    {/* Meta info */}
                    <td className="px-6 py-4 max-w-sm">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 overflow-hidden flex-shrink-0 shadow-sm relative group">
                          {project.image?.url ? (
                            <img src={getOptimizedProjectUrl(project.image.url, 150, 150)} referrerPolicy="no-referrer" alt={project.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-350 dark:text-slate-500 bg-slate-50 dark:bg-slate-900">
                              <Laptop size={22} className="stroke-[1.5]" />
                            </div>
                          )}
                        </div>
                        <div className="text-left overflow-hidden min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <Heading level={5} className="font-extrabold text-slate-905 dark:text-white truncate leading-snug">
                              {project.title}
                            </Heading>
                            <span className={`inline-flex px-2 py-0.5 border rounded-full text-[9px] font-extrabold uppercase tracking-wider ${getCategoryStyles(project.category)}`}>
                              {project.category}
                            </span>
                          </div>
                          {project.description && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 max-w-md antialiased break-words font-normal">
                              {project.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Tech List */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5 max-w-[240px]">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <span key={tech} className="inline-flex items-center px-2 py-1 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-[10px] font-semibold rounded-md border border-slate-100 dark:border-slate-800 transition-colors duration-100">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="inline-flex items-center px-1.5 py-1 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[9px] font-bold rounded-md border border-blue-100 dark:border-blue-900">
                            +{project.technologies.length - 4} more
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Props badges */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2 text-left">
                        {project.featured ? (
                          <span className="inline-flex items-center text-[9px] font-extrabold text-amber-700 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-150 dark:border-amber-900 px-2 py-0.5 rounded-full w-fit shadow-2xs antialiased animate-pulse">
                            <Star size={10} className="fill-amber-500 text-amber-500 stroke-[2.5]" />
                            <span>Featured Item</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[9px] font-bold text-slate-400 dark:text-slate-500 gap-1 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-801 px-2 py-0.5 rounded-full w-fit">
                            <span>Regular Display</span>
                          </span>
                        )}
                        <div className="flex items-center space-x-2 pt-0.5">
                          {project.liveUrl ? (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 border border-blue-200 dark:border-blue-905 bg-blue-50/50 hover:bg-blue-100/70 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-bold transition-all duration-150 shadow-2xs hover:shadow"
                            >
                              <span>Live Demo</span>
                              <ExternalLink size={9} className="stroke-[2.5]" />
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-350 dark:text-slate-600 cursor-not-allowed select-none italic font-medium px-1">No site link</span>
                          )}
                          {project.githubUrl ? (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-705 dark:text-slate-300 rounded-lg text-[10px] font-bold transition-all duration-150 shadow-2xs hover:shadow"
                            >
                              <span>Source Code</span>
                              <Github size={9} className="stroke-[2.5]" />
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-350 dark:text-slate-600 cursor-not-allowed select-none italic font-medium px-1">Private repo</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          onClick={() => handleOpenEdit(project)}
                          variant="outline"
                          className="h-auto px-2.5 py-1.5 text-[10px] inline-flex items-center space-x-1"
                        >
                          <Edit2 size={11} className="mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(project.id, project.title)}
                          variant="outline"
                          className="h-auto px-2.5 py-1.5 text-[10px] text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/25 border-slate-200 dark:border-slate-801 cursor-pointer"
                        >
                          <Trash2 size={11} className="mr-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Card className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-transparent shadow-xs">
          <Paragraph className="text-slate-500 font-medium bg-transparent">No projects matched your criteria.</Paragraph>
          <button onClick={handleOpenCreate} className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer">
            Create new project record
          </button>
        </Card>
      )}

      {/* ======================================= */}
      {/* CREATE & EDIT DIALOG MODAL              */}
      {/* ======================================= */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-101 dark:border-slate-850 bg-slate-50 dark:bg-slate-950">
              <Heading level={5} className="font-extrabold text-sm text-slate-900 dark:text-white uppercase">
                {editingProject ? 'Edit Project properties' : 'Add New Portfolio Project'}
              </Heading>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scroll area */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5 text-left text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Category and Featured switch */}
                <div className="space-y-1.5">
                  <Label htmlFor="category-select">Category</Label>
                  <select
                    id="category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    <option value="Web Applications">Web Applications</option>
                    <option value="Creative Tech">Creative Tech</option>
                    <option value="AI & Automation">AI & Automation</option>
                    <option value="Systems & Devops">Systems & Devops</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center font-bold text-slate-700 dark:text-slate-300 uppercase cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={() => setFeatured(!featured)}
                      className="rounded border-slate-300 dark:border-slate-800 text-blue-600 focus:ring-blue-500 h-4.5 w-4.5 mr-2"
                    />
                    <Span className="text-xs font-bold text-slate-705 dark:text-slate-300 uppercase">Feature this on Home page</Span>
                  </label>
                </div>
              </div>

              {/* Title parameter */}
              <Input
                id="project-title"
                type="text"
                required
                label="Project Title"
                placeholder="e.g. Intelligent Search Crawler"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              {/* Description parameter */}
              <Textarea
                id="project-desc"
                rows={3}
                required
                label="Description"
                placeholder="Review of core requirements, technologies used, and user interactions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* External URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  id="project-live"
                  type="url"
                  label="Live Demo URL"
                  placeholder="https://example.com"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                />

                <Input
                  id="project-git"
                  type="url"
                  label="GitHub Code URL"
                  placeholder="https://github.com/profile/repo"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
              </div>

              {/* Tech Token Generator */}
              <div className="space-y-2">
                <Label htmlFor="tech-tag-input">Technology Tags</Label>
                <div className="flex gap-2">
                  <input
                    id="tech-tag-input"
                    type="text"
                    placeholder="e.g. Framer, TypeScript"
                    value={currentTechInput}
                    onChange={(e) => setCurrentTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                    className="flex-1 p-2.5 text-xs border border-slate-205 dark:border-slate-800 rounded-lg focus:outline-none bg-white dark:bg-slate-950 text-slate-950 dark:text-white"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTech}
                    className="px-4 py-2.5 h-auto text-xs"
                  >
                    Add Tag
                  </Button>
                </div>
                
                {/* Tech tag list items */}
                {technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {technologies.map((tech) => (
                      <Span
                        key={tech}
                        className="inline-flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-955 text-blue-700 dark:text-blue-300 font-bold max-w-full rounded-md border border-blue-100 dark:border-blue-900/40"
                      >
                        <span className="font-semibold text-xs">{tech}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(tech)}
                          className="ml-1.5 text-blue-500 hover:text-blue-800 dark:hover:text-blue-200 transition cursor-pointer"
                        >
                          <X size={11} />
                        </button>
                      </Span>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload image widget */}
              <div className="space-y-1.5">
                <Label>Cover Thumbnail Image</Label>
                <ImageUpload
                  value={image || undefined}
                  onChange={(val) => setImage(val)}
                  folder="projects"
                />
              </div>

              {/* Footer Save actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                >
                  Save Project details
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
