import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';

// Types matching the Rust response types
export interface NavigationItemResponse {
    id: string;
    label: string;
    icon?: string | null;
    children?: NavigationItemResponse[] | null;
    show_hover_menu?: boolean | null;
    unread?: boolean | null;
    sequential_number?: string | null; // Sequential number for work items (e.g., M-0003, M-1045, etc.)
}

export interface NavigationSectionResponse {
    id: string;
    label: string;
    icon?: string | null;
    items: NavigationItemResponse[];
    spacing_before?: boolean | null;
}

export interface NavigationResponse {
    sections: NavigationSectionResponse[];
}

export interface Project {
    id: string | null;
    created_at: string;
    updated_at: string | null;
    name: string;
    description: string | null;
    is_active: boolean;
}

interface NavigationState {
    // Projects
    projects: Project[];
    activeProjectId: string | null;
    isLoadingProjects: boolean;
    
    // Navigation
    navigation: NavigationResponse | null;
    isLoadingNavigation: boolean;
    
    // Actions
    fetchProjects: () => Promise<void>;
    setActiveProjectId: (projectId: string | null) => Promise<void>;
    fetchNavigation: (projectId: string) => Promise<void>;
    refreshNavigation: () => Promise<void>;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
    // Initial state
    projects: [],
    activeProjectId: null,
    isLoadingProjects: false,
    navigation: null,
    isLoadingNavigation: false,

    // Fetch projects from backend
    fetchProjects: async () => {
        set({ isLoadingProjects: true });
        try {
            const fetchedProjects = await invoke<Project[]>('get_projects');
            set({ 
                projects: fetchedProjects,
                isLoadingProjects: false 
            });
            
            // Set the first project as active if available and none is selected
            const currentState = get();
            if (fetchedProjects.length > 0 && !currentState.activeProjectId) {
                const firstProject = fetchedProjects[0];
                await get().setActiveProjectId(firstProject.id || null);
            }
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            set({ 
                projects: [],
                isLoadingProjects: false 
            });
        }
    },

    // Set active project and fetch navigation
    setActiveProjectId: async (projectId: string | null) => {
        set({ activeProjectId: projectId });
        
        // Find project name for selected project
        const state = get();
        const selectedProject = state.projects.find(p => p.id === projectId);
        
        if (projectId) {
            // Fetch navigation for the new active project
            await get().fetchNavigation(projectId);
        } else {
            set({ navigation: null });
        }
    },

    // Fetch navigation data for a specific project
    fetchNavigation: async (projectId: string) => {
        set({ isLoadingNavigation: true });
        try {
            const response = await invoke<NavigationResponse>('get_navigation', { projectId });
            set({ 
                navigation: response,
                isLoadingNavigation: false 
            });
        } catch (error) {
            console.error('Failed to fetch navigation:', error);
            set({ 
                navigation: null,
                isLoadingNavigation: false 
            });
        }
    },

    // Refresh navigation for the current active project
    refreshNavigation: async () => {
        const state = get();
        if (state.activeProjectId) {
            await get().fetchNavigation(state.activeProjectId);
        }
    },
}));

