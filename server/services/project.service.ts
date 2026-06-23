import { loadDB, logActivity, saveDB } from "../config/database.js";
import { deleteFile } from "../middleware/upload.js";
import { ProjectType } from "../types/index.js";
import { AppError } from "../utils/AppError.js";

export class ProjectService {
  public getAllProjects(search?: string, category?: string) {
    try {
      const db = loadDB();
      const projects = db.projects || [];
      
      console.log(`[Project Service] Loaded ${projects.length} projects from database`);
      
      let filtered = [...projects];

      if (search) {
        const q = String(search).toLowerCase();
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (Array.isArray(p.technologies) && p.technologies.some((tech: any) => tech.toLowerCase().includes(q))) ||
          (p.category && p.category.toLowerCase().includes(q))
        );
      }

      if (category && category !== 'All' && category !== 'all') {
        const cat = String(category).toLowerCase();
        filtered = filtered.filter(p => p.category && p.category.toLowerCase() === cat);
      }

      // Sort by order
      return filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
      console.error('[Project Service] Error in getAllProjects:', error);
      return [];
    }
  }

  public getProjectById(id: string) {
    const db = loadDB();
    const projects = db.projects || [];
    const project = projects.find(p => p.id === id);
    if (!project) {
      throw new AppError('The requested project does not exist.', 404);
    }
    return project;
  }

  public createProject(data: Partial<ProjectType>) {
    const { title, description, image, technologies, liveUrl, githubUrl, category, featured } = data;

    if (!title || !description) {
      throw new AppError('Title and description parameters are required.', 400);
    }

    const db = loadDB();
    const projects = db.projects || [];
    const maxOrder = projects.reduce((max, p) => (p.order > max ? p.order : max), 0);

    const newProject: ProjectType = {
      id: Date.now().toString(),
      title,
      description,
      image: image || { url: '', publicId: '' },
      technologies: Array.isArray(technologies) ? technologies : [],
      liveUrl: liveUrl || '',
      githubUrl: githubUrl || '',
      category: category || 'General',
      featured: !!featured,
      order: maxOrder + 1,
    };

    projects.push(newProject);
    db.projects = projects;
    saveDB(db);

    logActivity(`Created project: "${title}"`);
    return newProject;
  }

  public updateProject(id: string, updates: Partial<ProjectType>) {
    const db = loadDB();
    const projects = db.projects || [];
    const idx = projects.findIndex(p => p.id === id);

    if (idx === -1) {
      throw new AppError('The project sought for modification was not found.', 404);
    }

    const currentProject = projects[idx];

    // Soft asset cleanup if project image switches
    if (updates.image && updates.image.publicId && currentProject.image && currentProject.image.publicId && currentProject.image.publicId !== updates.image.publicId) {
      deleteFile(currentProject.image.publicId).catch(err =>
        console.error('[Project Service Asset Cleanup] Failed to delete target image:', err)
      );
    }

    const updatedProject: ProjectType = {
      ...currentProject,
      title: updates.title !== undefined ? updates.title : currentProject.title,
      description: updates.description !== undefined ? updates.description : currentProject.description,
      image: updates.image !== undefined ? updates.image : currentProject.image,
      technologies: Array.isArray(updates.technologies) ? updates.technologies : currentProject.technologies,
      liveUrl: updates.liveUrl !== undefined ? updates.liveUrl : currentProject.liveUrl,
      githubUrl: updates.githubUrl !== undefined ? updates.githubUrl : currentProject.githubUrl,
      category: updates.category !== undefined ? updates.category : currentProject.category,
      featured: updates.featured !== undefined ? !!updates.featured : currentProject.featured,
      order: updates.order !== undefined ? Number(updates.order) : currentProject.order,
    };

    projects[idx] = updatedProject;
    db.projects = projects;
    saveDB(db);

    logActivity(`Updated project: "${updatedProject.title}"`);
    return updatedProject;
  }

  public reorderProjects(ids: string[]) {
    const db = loadDB();
    const projects = db.projects || [];
    let counter = 0;

    const reordered = projects.map(project => {
      const orderIdx = ids.indexOf(project.id);
      if (orderIdx !== -1) {
        counter++;
        return { ...project, order: orderIdx + 1 };
      }
      return project;
    });

    db.projects = reordered;
    saveDB(db);
    logActivity('Portfolio projects display list reordered.');
    return counter;
  }

  public deleteProject(id: string) {
    const db = loadDB();
    const projects = db.projects || [];
    const project = projects.find(p => p.id === id);

    if (!project) {
      throw new AppError('The project requested for deletion does not exist.', 404);
    }

    // Asset unlinking
    if (project.image && project.image.publicId) {
      deleteFile(project.image.publicId).catch(err =>
        console.error('[Project Service Asset Unlink] Failed to delete target asset:', err)
      );
    }

    const filtered = projects.filter(p => p.id !== id);
    db.projects = filtered;
    saveDB(db);

    logActivity(`Deleted project: "${project.title}"`);
    return true;
  }
}

export const projectService = new ProjectService();