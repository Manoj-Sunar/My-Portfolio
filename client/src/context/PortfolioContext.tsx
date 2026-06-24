// src/context/PortfolioContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { ProjectType, EducationType, AboutType, CVType, CertificateType } from '../types';
import toast from 'react-hot-toast';

interface PortfolioContextType {
  projects: ProjectType[];
  education: EducationType[];
  certificates: CertificateType[];
  about: AboutType | null;
  cv: CVType | null;
  isLoading: boolean;
  refreshAll: () => Promise<void>;
  
  // Projects Endpoints
  addProject: (data: Omit<ProjectType, 'id' | 'order'>) => Promise<boolean>;
  updateProject: (id: string, data: Partial<ProjectType>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  reorderProjects: (orderedIds: string[]) => Promise<boolean>;

  // Education Endpoints
  addEducation: (data: Omit<EducationType, 'id' | 'order'>) => Promise<boolean>;
  updateEducation: (id: string, data: Partial<EducationType>) => Promise<boolean>;
  deleteEducation: (id: string) => Promise<boolean>;

  // Certificates Endpoints
  addCertificate: (data: Omit<CertificateType, 'id' | 'order'>) => Promise<boolean>;
  updateCertificate: (id: string, data: Partial<CertificateType>) => Promise<boolean>;
  deleteCertificate: (id: string) => Promise<boolean>;

  // About Endpoints
  updateAbout: (data: Partial<AboutType>) => Promise<boolean>;

  // CV Endpoints
  updateCV: (data: Partial<CVType>) => Promise<boolean>;
}

// Create context outside the component
const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// Export the provider as a separate component
export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // Unified portfolio query with TanStack Query
  const { data: portfolioData, isLoading, refetch } = useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const res = await api.get('/portfolio');
      return res.data;
    },
  });

  const projects = portfolioData?.projects || [];
  const education = portfolioData?.education || [];
  const certificates = portfolioData?.certificates || [];
  const about = portfolioData?.about || null;
  const cv = portfolioData?.cv || null;

  const refreshAll = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // MUTATIONS
  const addProjectMutation = useMutation({
    mutationFn: async (data: Omit<ProjectType, 'id' | 'order'>) => {
      const res = await api.post('/projects', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Project added to database!');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to establish new project record';
      toast.error(msg);
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProjectType> }) => {
      const res = await api.put(`/projects/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Project details modified!');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to update project attributes';
      toast.error(msg);
    }
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Project deleted successfully.');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to delete selected project';
      toast.error(msg);
    }
  });

  const reorderProjectsMutation = useMutation({
    mutationFn: async (orderedIds: string[]) => {
      await api.put('/projects/reorder', { ids: orderedIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to commit reorder checklist sequence';
      toast.error(msg);
    }
  });

  const addEducationMutation = useMutation({
    mutationFn: async (data: Omit<EducationType, 'id' | 'order'>) => {
      const res = await api.post('/education', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Education record added successfully!');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to write academic log';
      toast.error(msg);
    }
  });

  const updateEducationMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EducationType> }) => {
      const res = await api.put(`/education/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Education history catalog updated.');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Could not update education attributes';
      toast.error(msg);
    }
  });

  const deleteEducationMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/education/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Education record removed.');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to remove selected record';
      toast.error(msg);
    }
  });

  const addCertificateMutation = useMutation({
    mutationFn: async (data: Omit<CertificateType, 'id' | 'order'>) => {
      const res = await api.post('/certificates', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Certificate added to portfolio!');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to upload/create new certificate';
      toast.error(msg);
    }
  });

  const updateCertificateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CertificateType> }) => {
      const res = await api.patch(`/certificates/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Certificate details modified!');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Could not update certificate details';
      toast.error(msg);
    }
  });

  const deleteCertificateMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/certificates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Certificate deleted successfully.');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to delete selected certificate';
      toast.error(msg);
    }
  });

  const updateAboutMutation = useMutation({
    mutationFn: async (data: Partial<AboutType>) => {
      const res = await api.put('/about', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('About page sections saved!');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to save About attributes';
      toast.error(msg);
    }
  });

  const updateCVMutation = useMutation({
    mutationFn: async (data: Partial<CVType>) => {
      const res = await api.patch('/cv', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Master CV structured profile stored successfully!');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to update CV segments';
      toast.error(msg);
    }
  });

  // Client adapter layer to match prior function signatures exactly
  const addProject = async (data: Omit<ProjectType, 'id' | 'order'>): Promise<boolean> => {
    try {
      const res = await addProjectMutation.mutateAsync(data);
      return !!res;
    } catch {
      return false;
    }
  };

  const updateProject = async (id: string, data: Partial<ProjectType>): Promise<boolean> => {
    try {
      const res = await updateProjectMutation.mutateAsync({ id, data });
      return !!res;
    } catch {
      return false;
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      await deleteProjectMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  };

  const reorderProjects = async (orderedIds: string[]): Promise<boolean> => {
    try {
      await reorderProjectsMutation.mutateAsync(orderedIds);
      return true;
    } catch {
      return false;
    }
  };

  const addEducation = async (data: Omit<EducationType, 'id' | 'order'>): Promise<boolean> => {
    try {
      const res = await addEducationMutation.mutateAsync(data);
      return !!res;
    } catch {
      return false;
    }
  };

  const updateEducation = async (id: string, data: Partial<EducationType>): Promise<boolean> => {
    try {
      const res = await updateEducationMutation.mutateAsync({ id, data });
      return !!res;
    } catch {
      return false;
    }
  };

  const deleteEducation = async (id: string): Promise<boolean> => {
    try {
      await deleteEducationMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  };

  const addCertificate = async (data: Omit<CertificateType, 'id' | 'order'>): Promise<boolean> => {
    try {
      const res = await addCertificateMutation.mutateAsync(data);
      return !!res;
    } catch {
      return false;
    }
  };

  const updateCertificate = async (id: string, data: Partial<CertificateType>): Promise<boolean> => {
    try {
      const res = await updateCertificateMutation.mutateAsync({ id, data });
      return !!res;
    } catch {
      return false;
    }
  };

  const deleteCertificate = async (id: string): Promise<boolean> => {
    try {
      await deleteCertificateMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  };

  const updateAbout = async (data: Partial<AboutType>): Promise<boolean> => {
    try {
      const res = await updateAboutMutation.mutateAsync(data);
      return !!res;
    } catch {
      return false;
    }
  };

  const updateCV = async (data: Partial<CVType>): Promise<boolean> => {
    try {
      const res = await updateCVMutation.mutateAsync(data);
      return !!res;
    } catch {
      return false;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        projects,
        education,
        certificates,
        about,
        cv,
        isLoading,
        refreshAll,
        addProject,
        updateProject,
        deleteProject,
        reorderProjects,
        addEducation,
        updateEducation,
        deleteEducation,
        addCertificate,
        updateCertificate,
        deleteCertificate,
        updateAbout,
        updateCV
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

// Export the hook separately
export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be nested inside a PortfolioProvider');
  }
  return context;
}