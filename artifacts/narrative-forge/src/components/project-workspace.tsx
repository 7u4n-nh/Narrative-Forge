import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getListProjectsQueryKey,
  useCreateProject,
  useListProjects,
  type Project,
  type ProjectInput,
} from '@workspace/api-client-react';

type ProjectWorkspaceValue = {
  projects: Project[];
  selectedProjectId?: string;
  selectedProject?: Project;
  isLoading: boolean;
  isError: boolean;
  selectProject: (id: string) => void;
  createProject: (input: ProjectInput, options?: { onSuccess?: (project: Project) => void }) => void;
  isCreating: boolean;
  createError: boolean;
};

const ProjectWorkspaceContext = createContext<ProjectWorkspaceValue | null>(null);
const storageKey = 'narrative-forge-selected-project';

export function ProjectWorkspaceProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const projectsQuery = useListProjects({ query: { queryKey: getListProjectsQueryKey() } });
  const createMutation = useCreateProject();
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(() => {
    return window.localStorage.getItem(storageKey) ?? undefined;
  });
  const projects = projectsQuery.data ?? [];

  useEffect(() => {
    if (!projects.length) return;
    const selectedStillExists = selectedProjectId && projects.some((project) => project.id === selectedProjectId);
    if (!selectedStillExists) {
      const firstProject = projects[0];
      setSelectedProjectId(firstProject.id);
      window.localStorage.setItem(storageKey, firstProject.id);
    }
  }, [projects, selectedProjectId]);

  const selectProject = (id: string) => {
    setSelectedProjectId(id);
    window.localStorage.setItem(storageKey, id);
  };

  const createProject = (input: ProjectInput, options?: { onSuccess?: (project: Project) => void }) => {
    createMutation.mutate({ data: input }, {
      onSuccess: (project) => {
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        selectProject(project.id);
        options?.onSuccess?.(project);
      },
    });
  };

  const value = useMemo<ProjectWorkspaceValue>(() => ({
    projects,
    selectedProjectId,
    selectedProject: projects.find((project) => project.id === selectedProjectId),
    isLoading: projectsQuery.isLoading,
    isError: projectsQuery.isError,
    selectProject,
    createProject,
    isCreating: createMutation.isPending,
    createError: createMutation.isError,
  }), [createMutation.isError, createMutation.isPending, projects, projectsQuery.isError, projectsQuery.isLoading, selectedProjectId]);

  return <ProjectWorkspaceContext.Provider value={value}>{children}</ProjectWorkspaceContext.Provider>;
}

export function useProjectWorkspace() {
  const context = useContext(ProjectWorkspaceContext);
  if (!context) throw new Error('useProjectWorkspace must be used inside ProjectWorkspaceProvider');
  return context;
}