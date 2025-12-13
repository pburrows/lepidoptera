import { useState, useRef, useEffect } from 'react';
import { Panel, ImperativePanelHandle } from 'react-resizable-panels';
import { useNavigate } from '@tanstack/react-router';
import { invoke } from '@tauri-apps/api/core';
import { FaChevronLeft, FaChevronRight, FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import {FaChevronDown as FaChevronDownSolid, FaRunning} from 'react-icons/fa';
import { FaFolder, FaFolderOpen, FaFile, FaStar, FaClock, FaUser, FaList, FaRocket, FaBook, FaEllipsisVertical } from 'react-icons/fa6';
import './panel-layout.styles.scss';

const COLLAPSED_SIZE = 5;

interface ContextMenuItem {
    id: string;
    label: string;
    onClick: (itemId: string) => void;
}

interface NavItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    children?: NavItem[];
    showHoverMenu?: boolean; // Flag to indicate if this item should show hover menu
    unread?: boolean; // Flag to indicate if this item has unread changes
    contextMenuItems?: ContextMenuItem[]; // Custom right-click menu items (optional)
}

interface NavSection {
    id: string;
    label: string;
    icon: React.ReactNode;
    items: NavItem[];
    spacingBefore?: boolean; // Add extra vertical space before this section
    contextMenuItems?: ContextMenuItem[]; // Custom right-click menu items (optional)
}

// Rust response types (matching the Rust structs)
interface NavigationItemResponse {
    id: string;
    label: string;
    icon?: string | null;
    children?: NavigationItemResponse[] | null;
    show_hover_menu?: boolean | null;
    unread?: boolean | null;
}

interface NavigationSectionResponse {
    id: string;
    label: string;
    icon?: string | null;
    items: NavigationItemResponse[];
    spacing_before?: boolean | null;
}

interface NavigationResponse {
    sections: NavigationSectionResponse[];
}

export default function LeftPanel() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['sprints', 'documents']));
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['epic-a', 'story-a']));
    const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{ itemId: string; x: number; y: number } | null>(null);
    const [selectedProject, setSelectedProject] = useState<string>('Project A');
    const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
    const [navSections, setNavSections] = useState<NavSection[]>([]);
    const [isLoadingNavigation, setIsLoadingNavigation] = useState(true);
    const panelRef = useRef<ImperativePanelHandle>(null);
    const menuRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const contextMenuRef = useRef<HTMLDivElement>(null);
    const projectDropdownRef = useRef<HTMLDivElement>(null);
    const projectButtonRef = useRef<HTMLButtonElement>(null);

    const handleToggle = () => {
        if (panelRef.current) {
            if (isOpen) {
                panelRef.current.collapse();
            } else {
                panelRef.current.expand();
            }
        }
    };

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            if (next.has(sectionId)) {
                next.delete(sectionId);
            } else {
                next.add(sectionId);
            }
            return next;
        });
    };

    const toggleItem = (itemId: string) => {
        setExpandedItems(prev => {
            const next = new Set(prev);
            if (next.has(itemId)) {
                next.delete(itemId);
            } else {
                next.add(itemId);
            }
            return next;
        });
    };

    // Map navigation item IDs to routes
    const getRouteForItem = (itemId: string): string | null => {
        const routeMap: Record<string, string> = {
            'overview': '/overview',
            'backlog': '/backlog',
            'doc-tree': '/document',
            'documents': '/document', // Section header can also navigate
            'tickets': '/backlog', // Tickets section can navigate to backlog
            // Epics, Stories, and Tasks all go to ticket page
            'epic-a': '/ticket',
            'epic-b': '/ticket',
            'epic-d': '/ticket',
            'story-a': '/ticket',
            'story-b': '/ticket',
            'story-c': '/ticket',
            'story-d': '/ticket',
            'task-a': '/ticket',
            'task-b': '/ticket',
            'sprint-1': '/ticket',
            'sprints': '/ticket', // Sprints section can navigate
        };
        return routeMap[itemId] || null;
    };

    const handleNavClick = (itemId: string) => {
        const route = getRouteForItem(itemId);
        if (route) {
            navigate({ to: route });
        } else {
            console.log('No route mapped for:', itemId);
        }
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openMenuId) {
                const menuElement = menuRefs.current.get(openMenuId);
                const buttonElement = document.querySelector(`[data-menu-button="${openMenuId}"]`);
                
                if (menuElement && !menuElement.contains(event.target as Node) &&
                    buttonElement && !buttonElement.contains(event.target as Node)) {
                    setOpenMenuId(null);
                }
            }
            
            if (contextMenu) {
                if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
                    setContextMenu(null);
                }
            }
            
            if (isProjectDropdownOpen) {
                if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target as Node) &&
                    projectButtonRef.current && !projectButtonRef.current.contains(event.target as Node)) {
                    setIsProjectDropdownOpen(false);
                }
            }
        };

        if (openMenuId || contextMenu || isProjectDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [openMenuId, contextMenu, isProjectDropdownOpen]);

    const handleMenuClick = (itemId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setOpenMenuId(openMenuId === itemId ? null : itemId);
    };

    const handleMenuItemClick = (itemId: string, menuItem: string) => {
        console.log(`Menu item "${menuItem}" clicked for "${itemId}"`);
        setOpenMenuId(null);
        // TODO: Implement menu item actions
    };

    // Default context menu items
    const getDefaultContextMenuItems = (itemId: string, item: NavItem | NavSection): ContextMenuItem[] => {
        const defaultItems: ContextMenuItem[] = [
            {
                id: 'mark-as-read',
                label: 'Mark as Read',
                onClick: (id) => {
                    console.log(`Mark as Read clicked for "${id}"`);
                    // TODO: Implement mark as read functionality
                },
            },
            {
                id: 'star',
                label: 'Star',
                onClick: (id) => {
                    console.log(`Star clicked for "${id}"`);
                    // TODO: Implement star functionality
                },
            },
        ];

        // Merge with custom context menu items if provided
        if ('contextMenuItems' in item && item.contextMenuItems) {
            return [...defaultItems, ...item.contextMenuItems];
        }

        return defaultItems;
    };

    const handleContextMenu = (e: React.MouseEvent, itemId: string, item: NavItem | NavSection) => {
        e.preventDefault();
        e.stopPropagation();
        
        setContextMenu({
            itemId,
            x: e.clientX,
            y: e.clientY,
        });
    };

    const handleContextMenuItemClick = (itemId: string, menuItem: ContextMenuItem) => {
        menuItem.onClick(itemId);
        setContextMenu(null);
    };

    const projects = ['Project A', 'Project B', 'Project C'];

    const handleProjectSelect = (project: string) => {
        setSelectedProject(project);
        setIsProjectDropdownOpen(false);
        console.log(`Selected project: ${project}`);
        // TODO: Implement project switching
    };

    const handleManageProjects = () => {
        setIsProjectDropdownOpen(false);
        navigate({ to: '/projects-manage' });
    };

    // Icon mapping function - maps icon string names to React components
    const mapIcon = (iconName: string | null | undefined): React.ReactNode | undefined => {
        if (!iconName) return undefined;
        
        const iconMap: Record<string, React.ReactNode> = {
            'FaFolder': <FaFolder />,
            'FaFolderOpen': <FaFolderOpen />,
            'FaFile': <FaFile />,
            'FaStar': <FaStar />,
            'FaClock': <FaClock />,
            'FaUser': <FaUser />,
            'FaList': <FaList />,
            'FaRocket': <FaRocket />,
            'FaBook': <FaBook />,
            'FaRunning': <FaRunning />,
        };
        
        return iconMap[iconName] || undefined;
    };

    // Map Rust response types to TypeScript types
    const mapNavigationItem = (item: NavigationItemResponse): NavItem => {
        return {
            id: item.id,
            label: item.label,
            icon: mapIcon(item.icon),
            children: item.children ? item.children.map(mapNavigationItem) : undefined,
            showHoverMenu: item.show_hover_menu ?? undefined,
            unread: item.unread ?? undefined,
        };
    };

    const mapNavigationSection = (section: NavigationSectionResponse): NavSection => {
        return {
            id: section.id,
            label: section.label,
            icon: mapIcon(section.icon) || <FaFolder />, // Default icon if none provided
            items: section.items.map(mapNavigationItem),
            spacingBefore: section.spacing_before ?? undefined,
        };
    };

    // Fetch navigation data from Rust backend
    useEffect(() => {
        const fetchNavigation = async () => {
            try {
                setIsLoadingNavigation(true);
                const response = await invoke<NavigationResponse>('get_navigation');
                const mappedSections = response.sections.map(mapNavigationSection);
                setNavSections(mappedSections);
            } catch (error) {
                console.error('Failed to fetch navigation:', error);
                // Fallback to empty array on error
                setNavSections([]);
            } finally {
                setIsLoadingNavigation(false);
            }
        };

        fetchNavigation();
    }, []);

    // Fallback navigation sections (used during loading or if fetch fails)
    const fallbackNavSections: NavSection[] = [
        { id: 'overview', label: 'Overview', icon: <FaFolder />, items: [] },
        { id: 'for-you', label: 'For You', icon: <FaUser />, items: [] },
        { id: 'recent', label: 'Recent', icon: <FaClock />, items: [] },
        { id: 'starred', label: 'Starred', icon: <FaStar />, items: [] },
        {
            id: 'tickets',
            label: 'Tickets',
            icon: <FaList />,
            items: [
                {
                    id: 'backlog',
                    label: 'Backlog',
                    icon: <FaList />,
                    children: [
                        {
                            id: 'epic-d',
                            label: 'Epic D',
                            children: [
                                { id: 'story-d', label: 'Story D', showHoverMenu: true },
                            ],
                        },
                    ],
                    // spacingBefore: true, // Extra space after Starred
                },
                {
                    id: 'sprints',
                    label: 'Sprints',
                    icon: <FaRocket />,
                    // spacingBefore: true, // Extra space before Sprints
                    children: [
                        {
                            id: "sprint-1",
                            label: "Sprint 1",
                            icon: <FaRunning />,
                            children: [
                                {
                                    id: 'epic-a',
                                    label: 'Epic A',
                                    children: [
                                        {
                                            id: 'story-a',
                                            label: 'Story A',
                                            showHoverMenu: true,
                                            children: [
                                                { id: 'task-a', label: 'Task A', unread: true },
                                                { id: 'task-b', label: 'Task B' },
                                            ],
                                        },
                                        { id: 'story-b', label: 'Story B', showHoverMenu: true },
                                        { id: 'story-c', label: 'Story C', showHoverMenu: true, unread: true },
                                    ],
                                },
                                {
                                    id: 'epic-b',
                                    label: 'Epic B',
                                    children: [],
                                },
                            ]
                        },

                    ],
                },
            ],
            spacingBefore: true, // Extra space after Starred
        },


        {
            id: 'documents',
            label: 'Documents',
            icon: <FaBook />,
            spacingBefore: true, // Extra space before Documents
            items: [
                { id: 'doc-tree', label: '<Document Tree>' },
            ],
        },
    ];

    // Use fetched navigation sections, or fallback if loading/empty
    const displayNavSections = navSections.length > 0 ? navSections : fallbackNavSections;

    const renderNavItem = (item: NavItem, level: number = 0): React.ReactNode => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems.has(item.id);
        const indentLevel = level * 16;
        const isHovered = hoveredItemId === item.id;
        const isMenuOpen = openMenuId === item.id;

        return (
            <div key={item.id} className="nav-item-wrapper">
                <div
                    className={`nav-item ${hasChildren ? 'nav-item-parent' : ''} ${item.showHoverMenu ? 'nav-item-with-menu' : ''}`}
                    style={{ paddingLeft: `${indentLevel + 8}px` }}
                    onMouseEnter={() => item.showHoverMenu && setHoveredItemId(item.id)}
                    onMouseLeave={() => setHoveredItemId(null)}
                    onContextMenu={(e) => handleContextMenu(e, item.id, item)}
                >
                    {hasChildren && (
                        <span 
                            className="nav-item-chevron"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleItem(item.id);
                            }}
                        >
                            {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                        </span>
                    )}
                    <div 
                        className="nav-item-content"
                        onClick={() => {
                            const route = getRouteForItem(item.id);
                            if (route) {
                                handleNavClick(item.id);
                            } else if (!hasChildren) {
                                handleNavClick(item.id);
                            }
                        }}
                    >
                        {item.icon && (
                            <span className="nav-item-icon">{item.icon}</span>
                        )}
                        <span className={`nav-item-label ${item.unread ? 'nav-item-label-unread' : ''}`}>{item.label}</span>
                    </div>
                    {item.showHoverMenu && (
                        <button
                            className={`nav-item-menu-button ${isHovered ? 'nav-item-menu-button-visible' : ''}`}
                            data-menu-button={item.id}
                            onClick={(e) => handleMenuClick(item.id, e)}
                            aria-label="More options"
                        >
                            <FaEllipsisVertical />
                        </button>
                    )}
                </div>
                {item.showHoverMenu && isMenuOpen && (
                    <div
                        ref={(el) => {
                            if (el) {
                                menuRefs.current.set(item.id, el);
                            } else {
                                menuRefs.current.delete(item.id);
                            }
                        }}
                        className="nav-item-menu"
                    >
                        <div
                            className="nav-item-menu-item"
                            onClick={() => handleMenuItemClick(item.id, 'Item A')}
                        >
                            Item A
                        </div>
                        <div
                            className="nav-item-menu-item"
                            onClick={() => handleMenuItemClick(item.id, 'Item B')}
                        >
                            Item B
                        </div>
                    </div>
                )}
                {hasChildren && isExpanded && (
                    <div className="nav-item-children">
                        {item.children!.map(child => renderNavItem(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Panel
            ref={panelRef}
            defaultSize={20}
            minSize={15}
            maxSize={40}
            collapsible={true}
            collapsedSize={COLLAPSED_SIZE}
            className="left-panel"
            onResize={(size) => {
                setIsOpen(size > COLLAPSED_SIZE);
            }}
        >
            <div className="panel-header">
                <button 
                    className="panel-toggle-button"
                    onClick={handleToggle}
                    aria-label={isOpen ? 'Collapse navigation' : 'Expand navigation'}
                >
                    {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
                </button>
                {isOpen && (
                    <div className="panel-title-wrapper">
                        <button
                            ref={projectButtonRef}
                            className={`panel-title-button ${isProjectDropdownOpen ? 'panel-title-dropdown-open' : ''}`}
                            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                            aria-label="Select project"
                            aria-expanded={isProjectDropdownOpen}
                        >
                            <span className="panel-title">{selectedProject}</span>
                            <span className="panel-title-chevron">
                                <FaChevronDownSolid />
                            </span>
                        </button>
                        {isProjectDropdownOpen && (
                            <div
                                ref={projectDropdownRef}
                                className="panel-title-dropdown"
                            >
                                {projects.map(project => (
                                    <div
                                        key={project}
                                        className={`panel-title-dropdown-item ${project === selectedProject ? 'panel-title-dropdown-item-selected' : ''}`}
                                        onClick={() => handleProjectSelect(project)}
                                    >
                                        {project}
                                    </div>
                                ))}
                                <div className="panel-title-dropdown-separator"></div>
                                <div
                                    className="panel-title-dropdown-item"
                                    onClick={handleManageProjects}
                                >
                                    Manage Projects
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {isOpen && (
                <div className="panel-content navigation-content">
                    {isLoadingNavigation && (
                        <div style={{ padding: '8px', color: '#666' }}>Loading navigation...</div>
                    )}
                    {displayNavSections.map(section => {
                        // If section has no items, render it as a simple clickable item
                        if (section.items.length === 0) {
                            return (
                                <div 
                                    key={section.id} 
                                    className={`nav-item-wrapper ${section.spacingBefore ? 'nav-item-wrapper-spacing-before' : ''}`}
                                >
                                    <div
                                        className="nav-item"
                                        onContextMenu={(e) => handleContextMenu(e, section.id, section)}
                                        onClick={() => handleNavClick(section.id)}
                                    >
                                        {section.icon && (
                                            <span className="nav-item-icon">{section.icon}</span>
                                        )}
                                        <span className="nav-item-label">{section.label}</span>
                                    </div>
                                </div>
                            );
                        }

                        // Otherwise, render as an expandable section
                        const isSectionExpanded = expandedSections.has(section.id);
                        return (
                            <div 
                                key={section.id} 
                                className={`nav-section ${section.spacingBefore ? 'nav-section-spacing-before' : ''}`}
                            >
                                <div
                                    className="nav-section-header"
                                    onContextMenu={(e) => handleContextMenu(e, section.id, section)}
                                >
                                    <span 
                                        className="nav-section-chevron"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSection(section.id);
                                        }}
                                    >
                                        {isSectionExpanded ? <FaChevronDown /> : <FaChevronRight />}
                                    </span>
                                    <div 
                                        className="nav-section-content"
                                        onClick={() => {
                                            const route = getRouteForItem(section.id);
                                            if (route) {
                                                handleNavClick(section.id);
                                            }
                                        }}
                                    >
                                        <span className="nav-section-icon">{section.icon}</span>
                                        <span className="nav-section-label">{section.label}</span>
                                    </div>
                                </div>
                                {isSectionExpanded && section.items.length > 0 && (
                                    <div className="nav-section-items">
                                        {section.items.map(item => renderNavItem(item, 0))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
            {contextMenu && (() => {
                // Find the item or section that was right-clicked
                let targetItem: NavItem | NavSection | null = null;
                
                // Search through sections
                for (const section of displayNavSections) {
                    if (section.id === contextMenu.itemId) {
                        targetItem = section;
                        break;
                    }
                    
                    // Search through section items recursively
                    const findItem = (items: NavItem[]): NavItem | null => {
                        for (const item of items) {
                            if (item.id === contextMenu.itemId) {
                                return item;
                            }
                            if (item.children) {
                                const found = findItem(item.children);
                                if (found) return found;
                            }
                        }
                        return null;
                    };
                    
                    const foundItem = findItem(section.items);
                    if (foundItem) {
                        targetItem = foundItem;
                        break;
                    }
                }
                
                if (!targetItem) return null;
                
                const menuItems = getDefaultContextMenuItems(contextMenu.itemId, targetItem);
                
                return (
                    <div
                        ref={contextMenuRef}
                        className="nav-context-menu"
                        style={{
                            position: 'fixed',
                            left: `${contextMenu.x}px`,
                            top: `${contextMenu.y}px`,
                        }}
                    >
                        {menuItems.map(menuItem => (
                            <div
                                key={menuItem.id}
                                className="nav-context-menu-item"
                                onClick={() => handleContextMenuItemClick(contextMenu.itemId, menuItem)}
                            >
                                {menuItem.label}
                            </div>
                        ))}
                    </div>
                );
            })()}
        </Panel>
    );
}

