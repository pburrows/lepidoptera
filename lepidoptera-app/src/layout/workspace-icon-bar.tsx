import { useState } from 'react';
import { FaFolder, FaPlus } from 'react-icons/fa6';
import './workspace-icon-bar.styles.scss';

interface Workspace {
    id: string;
    name: string;
    icon?: React.ReactNode;
}

interface WorkspaceIconBarProps {
    workspaces?: Workspace[];
    activeWorkspaceId?: string;
    onWorkspaceSelect?: (workspaceId: string) => void;
    onWorkspaceCreate?: () => void;
}

export default function WorkspaceIconBar({
    workspaces = [],
    activeWorkspaceId,
    onWorkspaceSelect,
    onWorkspaceCreate,
}: WorkspaceIconBarProps) {
    const [hoveredWorkspaceId, setHoveredWorkspaceId] = useState<string | null>(null);

    const handleWorkspaceClick = (workspaceId: string) => {
        onWorkspaceSelect?.(workspaceId);
    };

    const handleCreateClick = () => {
        onWorkspaceCreate?.();
    };

    // Default workspace for demo purposes
    const defaultWorkspaces: Workspace[] = workspaces.length > 0 
        ? workspaces 
        : [
            { id: '1', name: 'Default Workspace' },
            { id: '2', name: 'Personal' },
        ];

    const displayWorkspaces = defaultWorkspaces;
    const displayActiveId = activeWorkspaceId || displayWorkspaces[0]?.id;

    return (
        <div className="workspace-icon-bar">
            <div className="workspace-icons">
                {displayWorkspaces.map((workspace) => {
                    const isActive = workspace.id === displayActiveId;
                    const isHovered = hoveredWorkspaceId === workspace.id;

                    return (
                        <button
                            key={workspace.id}
                            className={`workspace-icon-button ${isActive ? 'active' : ''}`}
                            onClick={() => handleWorkspaceClick(workspace.id)}
                            onMouseEnter={() => setHoveredWorkspaceId(workspace.id)}
                            onMouseLeave={() => setHoveredWorkspaceId(null)}
                            aria-label={workspace.name}
                            title={workspace.name}
                        >
                            {workspace.icon || <FaFolder />}
                            {isActive && <div className="workspace-indicator" />}
                        </button>
                    );
                })}
            </div>
            <div className="workspace-icon-bar-separator" />
            <button
                className="workspace-icon-button workspace-add-button"
                onClick={handleCreateClick}
                aria-label="Create or load workspace"
                title="Create or load workspace"
            >
                <FaPlus />
            </button>
        </div>
    );
}

