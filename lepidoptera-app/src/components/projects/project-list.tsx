import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { FaPlus } from 'react-icons/fa';
import { useNavigationStore } from '../../stores/navigation-store';
import './project-list.styles.scss';

export default function ProjectList() {
    const navigate = useNavigate();
    const { projects, isLoadingProjects, fetchProjects } = useNavigationStore();

    useEffect(() => {
        fetchProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // fetchProjects is stable from Zustand store

    const handleCreateNewProject = () => {
        // Navigate to create project page (route to be created)
        navigate({ to: '/projects/new/edit' });
    };

    return (
        <div className="project-list">
            <div className="project-list-header">
                <h1 className="project-list-title">Projects</h1>
            </div>

            <div className="project-list-toolbar">
                <button 
                    className="project-list-create-button"
                    onClick={handleCreateNewProject}
                >
                    <FaPlus className="project-list-create-icon" />
                    <span>Create New Project</span>
                </button>
            </div>

            <div className="project-list-content">
                {isLoadingProjects ? (
                    <div className="project-list-loading">Loading projects...</div>
                ) : projects.length === 0 ? (
                    <div className="project-list-empty">No projects found</div>
                ) : (
                    <table className="project-list-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Created</th>
                                <th>Updated</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.id || 'unknown'}>
                                    <td className="project-list-name">{project.name}</td>
                                    <td className="project-list-description">
                                        {project.description || '-'}
                                    </td>
                                    <td className="project-list-date">
                                        {project.created_at 
                                            ? new Date(project.created_at).toLocaleDateString()
                                            : '-'
                                        }
                                    </td>
                                    <td className="project-list-date">
                                        {project.updated_at 
                                            ? new Date(project.updated_at).toLocaleDateString()
                                            : '-'
                                        }
                                    </td>
                                    <td className="project-list-status">
                                        <span className={`project-list-status-badge ${project.is_active ? 'active' : 'inactive'}`}>
                                            {project.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

