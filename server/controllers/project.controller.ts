import { Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import { redisCache } from '../utils/redis.js';
import { CACHE_KEYS, invalidatePortfolioCache } from '../utils/cacheHelper.js';
import { projectService } from '../services/project.service.js';
import { AuthenticatedRequest } from '../types/index.js';

export class ProjectController {
  public getAllProjects = catchAsync(async (req: any, res: Response) => {
    try {
      const { search, category } = req.query;
      const s = search ? String(search) : undefined;
      const c = category ? String(category) : undefined;
      
      const cacheKey = CACHE_KEYS.PROJECTS_ALL(s, c);
      const cached = await redisCache.get(cacheKey);
      if (cached) {
        console.log('[Projects] Returning cached data');
        return res.status(200).json(JSON.parse(cached));
      }

      const projects = projectService.getAllProjects(s, c);
      console.log(`[Projects] Found ${projects.length} projects`);
      
      await redisCache.set(cacheKey, JSON.stringify(projects), 3600);
      res.status(200).json(projects);
    } catch (error) {
      console.error('[Projects Controller] Error:', error);
      res.status(500).json({ 
        message: 'Failed to fetch projects',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      });
    }
  });

  public getProjectById = catchAsync(async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const cacheKey = CACHE_KEYS.PROJECT_SINGLE(id);
      const cached = await redisCache.get(cacheKey);
      if (cached) {
        return res.status(200).json(JSON.parse(cached));
      }

      const project = projectService.getProjectById(id);
      await redisCache.set(cacheKey, JSON.stringify(project), 3600);
      res.status(200).json(project);
    } catch (error) {
      console.error('[Projects Controller] Error:', error);
      res.status(500).json({ 
        message: 'Failed to fetch project',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      });
    }
  });

  public createProject = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    try {
      const newProject = projectService.createProject(req.body);
      await invalidatePortfolioCache();
      res.status(201).json(newProject);
    } catch (error) {
      console.error('[Projects Controller] Error:', error);
      res.status(500).json({ 
        message: 'Failed to create project',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      });
    }
  });

  public updateProject = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const updatedProject = projectService.updateProject(id, req.body);
      await invalidatePortfolioCache();
      res.status(200).json(updatedProject);
    } catch (error) {
      console.error('[Projects Controller] Error:', error);
      res.status(500).json({ 
        message: 'Failed to update project',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      });
    }
  });

  public reorderProjects = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { ids } = req.body;
      const count = projectService.reorderProjects(ids);
      await invalidatePortfolioCache();
      res.status(200).json({ message: `Successfully reordered ${count} projects` });
    } catch (error) {
      console.error('[Projects Controller] Error:', error);
      res.status(500).json({ 
        message: 'Failed to reorder projects',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      });
    }
  });

  public deleteProject = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      projectService.deleteProject(id);
      await invalidatePortfolioCache();
      res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
      console.error('[Projects Controller] Error:', error);
      res.status(500).json({ 
        message: 'Failed to delete project',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      });
    }
  });
}

export const projectController = new ProjectController();