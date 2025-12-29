import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Panel, ImperativePanelHandle } from 'react-resizable-panels';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { FaChevronLeft, FaChevronRight, FaChevronDown, FaChevronUp, FaComment } from 'react-icons/fa6';
import {FaChevronDown as FaChevronDownSolid, FaRunning} from 'react-icons/fa';
import { FaFolder, FaFolderOpen, FaFile, FaStar, FaClock, FaUser, FaList, FaRocket, FaBook, FaEllipsisVertical, FaMessage  } from 'react-icons/fa6';
import { useNavigationStore } from '../stores/navigation-store';
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
    sequentialNumber?: string | null; // Sequential number for work items (e.g., M-0003, M-1045, etc.)
}

interface NavSection {
    id: string;
    label: string;
    icon: React.ReactNode;
    items: NavItem[];
    spacingBefore?: boolean; // Add extra vertical space before this section
    contextMenuItems?: ContextMenuItem[]; // Custom right-click menu items (optional)
    hoverMenuItems?: ContextMenuItem[]; // Custom hover menu items (optional, sections always show hover menu)
}

// Import types from store
import type { NavigationItemResponse, NavigationSectionResponse, Project } from '../stores/navigation-store';
import {BiSolidConversation, BiSolidMessageRoundedDetail} from "react-icons/bi";
import {IoIosChatbubbles} from "react-icons/io";
import {ImBubble, ImBubbles2} from "react-icons/im";

export default function LeftPanel() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['sprints', 'documents']));
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['epic-a', 'story-a']));
    const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{ itemId: string; x: number; y: number } | null>(null);
    const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
    const panelRef = useRef<ImperativePanelHandle>(null);
    const menuRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const contextMenuRef = useRef<HTMLDivElement>(null);
    const projectDropdownRef = useRef<HTMLDivElement>(null);
    const projectButtonRef = useRef<HTMLButtonElement>(null);
    const navItemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const navigationContentRef = useRef<HTMLDivElement>(null);

    // Use navigation store
    const {
        projects,
        activeProjectId,
        isLoadingProjects,
        navigation,
        isLoadingNavigation,
        fetchProjects,
        setActiveProjectId,
    } = useNavigationStore();

    // Derive selected project name from store
    const selectedProject = useMemo(() => {
        const project = projects.find(p => p.id === activeProjectId);
        return project?.name || '';
    }, [projects, activeProjectId]);

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

    // Helper function to check if an item belongs to the documents section
    const isDocumentItem = useCallback((itemId: string): boolean => {
        // Check if item is in documents section by searching navigation structure
        if (!navigation) return false;
        
        for (const section of navigation.sections) {
            if (section.id === 'documents') {
                const findItem = (items: NavigationItemResponse[]): boolean => {
                    for (const item of items) {
                        if (item.id === itemId) return true;
                        if (item.children) {
                            if (findItem(item.children)) return true;
                        }
                    }
                    return false;
                };
                return findItem(section.items);
            }
        }
        return false;
    }, [navigation]);

    // Helper function to check if an item belongs to the work items section
    const isWorkItemItem = useCallback((itemId: string): boolean => {
        // Check if itemId starts with work-item- prefix (individual work items)
        if (itemId.startsWith('work-item-')) {
            return true;
        }
        
        // Check if item is in any work items section by searching navigation structure
        if (!navigation) return false;
        
        for (const section of navigation.sections) {
            // Check if section ID starts with work-items-section- (new format)
            if (section.id.startsWith('work-items-section-')) {
                const findItem = (items: NavigationItemResponse[]): boolean => {
                    for (const item of items) {
                        if (item.id === itemId) return true;
                        if (item.children) {
                            if (findItem(item.children)) return true;
                        }
                    }
                    return false;
                };
                if (findItem(section.items)) {
                    return true;
                }
            }
        }
        return false;
    }, [navigation]);

    // Map navigation item IDs to routes
    const getRouteForItem = useCallback((itemId: string): string | null => {
        // Static route mappings
        const routeMap: Record<string, string> = {
            'overview': '/',
            'doc-tree': '/document/new/edit', // Navigate to new document creation
            'documents': '/document/new/edit', // Section header navigates to new document
            'work_items': '/work-items/list', // Work items section can navigate to backlog
            'conversations': '/conversations', // Conversations section navigates to conversations list
            'direct-messages': '/conversations/dms', // Direct messages navigates to DMs page
        };
        
        // Check static routes first
        if (routeMap[itemId]) {
            return routeMap[itemId];
        }
        
        // If itemId starts with 'work-items-section-', navigate to work items list
        if (itemId.startsWith('work-items-section-')) {
            return '/work-items/list';
        }
        
        // If itemId starts with 'conv-', navigate to specific conversation
        if (itemId.startsWith('conv-')) {
            return `/conversations/${itemId}`;
        }
        
        // If item belongs to documents section, navigate to document view
        if (isDocumentItem(itemId)) {
            return `/document/${itemId}`;
        }
        
        // If item belongs to work items section, navigate to work item view
        if (isWorkItemItem(itemId)) {
            return `/work-items/${itemId}`;
        }
        
        return null;
    }, [isDocumentItem, isWorkItemItem]);

    // Map current route to navigation item ID (reverse of getRouteForItem)
    const getActiveNavItemId = useCallback((pathname: string): string | null => {
        // Remove query parameters and hash
        const path = pathname.split('?')[0].split('#')[0];
        
        // Static route mappings (reverse)
        if (path === '/') {
            return 'overview';
        }
        if (path === '/conversations') {
            return 'conversations';
        }
        if (path === '/conversations/dms') {
            return 'direct-messages';
        }
        if (path === '/work-items/list') {
            return 'work_items';
        }
        if (path === '/document/new/edit') {
            return 'doc-tree';
        }
        
        // Match work item routes: /work-items/{id}
        const workItemMatch = path.match(/^\/work-items\/([^/]+)$/);
        if (workItemMatch) {
            const workItemId = workItemMatch[1];
            // Check if this work item exists in navigation
            if (navigation) {
                for (const section of navigation.sections) {
                    if (section.id.startsWith('work-items-section-')) {
                        const findItem = (items: NavigationItemResponse[]): string | null => {
                            for (const item of items) {
                                // Work item IDs in navigation match the work item ID from route
                                if (item.id === workItemId || item.id === `work-item-${workItemId}`) {
                                    return item.id;
                                }
                                if (item.children) {
                                    const found = findItem(item.children);
                                    if (found) return found;
                                }
                            }
                            return null;
                        };
                        const found = findItem(section.items);
                        if (found) return found;
                    }
                }
            }
            // If not found in navigation, still return the ID for highlighting
            return workItemId.startsWith('work-item-') ? workItemId : `work-item-${workItemId}`;
        }
        
        // Match document routes: /document/{id}
        const documentMatch = path.match(/^\/document\/([^/]+)$/);
        if (documentMatch) {
            const documentId = documentMatch[1];
            if (isDocumentItem(documentId)) {
                return documentId;
            }
        }
        
        // Match conversation routes: /conversations/{id}
        const conversationMatch = path.match(/^\/conversations\/([^/]+)$/);
        if (conversationMatch) {
            const conversationId = conversationMatch[1];
            return `conv-${conversationId}`;
        }
        
        // No match - route doesn't have a corresponding nav item
        return null;
    }, [navigation, isDocumentItem]);

    // Get the active navigation item ID from current route
    const activeNavItemId = useMemo(() => {
        return getActiveNavItemId(location.pathname);
    }, [location.pathname, getActiveNavItemId]);

    // Find which section contains a given item ID
    const findSectionForItem = useCallback((itemId: string): string | null => {
        if (!navigation) return null;
        
        for (const section of navigation.sections) {
            const findInItems = (items: NavigationItemResponse[]): boolean => {
                for (const item of items) {
                    if (item.id === itemId) return true;
                    if (item.children) {
                        if (findInItems(item.children)) return true;
                    }
                }
                return false;
            };
            
            if (findInItems(section.items)) {
                return section.id;
            }
        }
        
        return null;
    }, [navigation]);

    // Find all parent item IDs for a given item ID (for nested items)
    const findParentItems = useCallback((itemId: string): string[] => {
        if (!navigation) return [];
        
        const parents: string[] = [];
        
        const findInItems = (items: NavigationItemResponse[], currentPath: string[]): boolean => {
            for (const item of items) {
                const newPath = [...currentPath, item.id];
                if (item.id === itemId) {
                    // Found it - return all parents except the item itself
                    parents.push(...currentPath);
                    return true;
                }
                if (item.children) {
                    if (findInItems(item.children, newPath)) {
                        return true;
                    }
                }
            }
            return false;
        };
        
        for (const section of navigation.sections) {
            if (findInItems(section.items, [])) {
                break;
            }
        }
        
        return parents;
    }, [navigation]);

    // Auto-expand sections and parent items when activeNavItemId changes
    useEffect(() => {
        if (!activeNavItemId) return;
        
        // Check if the active item is itself a section (like "overview")
        // We check navigation.sections directly to avoid dependency on displayNavSections
        const isActiveSection = navigation?.sections.some(section => section.id === activeNavItemId) ?? false;
        
        if (isActiveSection) {
            // If it's a section, we don't need to expand anything (sections are always visible)
            return;
        }
        
        // Find the section containing this item
        const sectionId = findSectionForItem(activeNavItemId);
        if (sectionId) {
            // Expand the section
            setExpandedSections(prev => {
                if (prev.has(sectionId)) return prev;
                return new Set([...prev, sectionId]);
            });
        }
        
        // Find and expand parent items
        const parentItems = findParentItems(activeNavItemId);
        if (parentItems.length > 0) {
            setExpandedItems(prev => {
                const next = new Set(prev);
                let changed = false;
                for (const parentId of parentItems) {
                    if (!next.has(parentId)) {
                        next.add(parentId);
                        changed = true;
                    }
                }
                return changed ? next : prev;
            });
        }
    }, [activeNavItemId, findSectionForItem, findParentItems, navigation]);

    // Scroll active item into view
    useEffect(() => {
        if (!activeNavItemId || !isOpen) return;
        
        // Use setTimeout to ensure DOM is updated after expansion
        const timeoutId = setTimeout(() => {
            const activeItemElement = navItemRefs.current.get(activeNavItemId);
            if (activeItemElement && navigationContentRef.current) {
                activeItemElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'nearest',
                });
            }
        }, 100); // Small delay to allow expansion animation
        
        return () => clearTimeout(timeoutId);
    }, [activeNavItemId, isOpen, expandedSections, expandedItems]);

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

    // Get hover menu items for sections (sections always have hover menus)
    const getSectionHoverMenuItems = (section: NavSection): ContextMenuItem[] => {
        // If custom hover menu items are provided, use those
        if (section.hoverMenuItems && section.hoverMenuItems.length > 0) {
            return section.hoverMenuItems;
        }
        
        // Otherwise, return default hover menu items
        return [
            {
                id: 'mark-as-read',
                label: 'Mark as Read',
                onClick: (id) => {
                    console.log(`Mark as Read clicked for section "${id}"`);
                    // TODO: Implement mark as read functionality
                },
            },
            {
                id: 'star',
                label: 'Star',
                onClick: (id) => {
                    console.log(`Star clicked for section "${id}"`);
                    // TODO: Implement star functionality
                },
            },
        ];
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

    const handleProjectSelect = async (project: Project) => {
        await setActiveProjectId(project.id || null);
        setIsProjectDropdownOpen(false);
        console.log(`Selected project: ${project.name} (ID: ${project.id})`);
    };

    const handleManageProjects = () => {
        setIsProjectDropdownOpen(false);
        navigate({ to: '/projects-manage', search: { dialog: false } });
    };

    // Icon mapping function - maps icon string names to React components
    const mapIcon = useCallback((iconName: string | null | undefined): React.ReactNode | undefined => {
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
            'FaMessage': <ImBubble   />,
            'FaComment': <ImBubbles2    />,
        };
        
        return iconMap[iconName] || undefined;
    }, []);

    // Map Rust response types to TypeScript types
    const mapNavigationItem = useCallback((item: NavigationItemResponse): NavItem => {
        return {
            id: item.id,
            label: item.label,
            icon: mapIcon(item.icon),
            children: item.children ? item.children.map(mapNavigationItem) : undefined,
            showHoverMenu: item.show_hover_menu ?? undefined,
            unread: item.unread ?? undefined,
            sequentialNumber: item.sequential_number ?? undefined,
        };
    }, [mapIcon]);

    const mapNavigationSection = useCallback((section: NavigationSectionResponse): NavSection => {
        return {
            id: section.id,
            label: section.label,
            icon: mapIcon(section.icon) || <FaFolder />, // Default icon if none provided
            items: section.items.map(mapNavigationItem),
            spacingBefore: section.spacing_before ?? undefined,
        };
    }, [mapIcon, mapNavigationItem]);

    // Fetch projects on mount
    useEffect(() => {
        fetchProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // fetchProjects is stable from Zustand store

    // Map navigation data from store to NavSection format
    const navSections = useMemo(() => {
        if (!navigation) {
            return [];
        }
        return navigation.sections.map(mapNavigationSection);
    }, [navigation, mapNavigationSection]);

    // Fallback navigation sections (used during loading or if fetch fails)
    const fallbackNavSections: NavSection[] = [
        { id: 'overview', label: 'Overview', icon: <FaFolder />, items: [] },
        { id: 'for-you', label: 'For You', icon: <FaUser />, items: [] },
        { id: 'recent', label: 'Recent', icon: <FaClock />, items: [] },
        { id: 'starred', label: 'Starred', icon: <FaStar />, items: [] },
        {
            id: 'conversations',
            label: 'Conversations',
            icon: <FaComment />,
            spacingBefore: true, // Extra space before Documents
            items: [
                { id: 'conv-1', label: 'General' },
            ],
        },
        {
            id: 'work_items',
            label: 'Work Items',
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
    // TODO: Remove this filter once conversations are fully implemented
    const displayNavSections = (navSections.length > 0 ? navSections : fallbackNavSections).filter(
        section => section.id !== 'conversations' && section.id !== 'direct-messages'
    );

    const renderNavItem = (item: NavItem, level: number = 0): React.ReactNode => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems.has(item.id);
        const indentLevel = level * 16;
        const isHovered = hoveredItemId === item.id;
        const isMenuOpen = openMenuId === item.id;
        const isWorkItem = isWorkItemItem(item.id);
        const isActive = activeNavItemId === item.id;
        
        // Work items should always show hover menu
        const showHoverMenu = item.showHoverMenu || isWorkItem;
        
        // Format label for work items: <sequential_number> - <title>
        const displayLabel = isWorkItem && item.sequentialNumber
            ? `${item.sequentialNumber} - ${item.label}`
            : item.label;

        return (
            <div 
                key={item.id} 
                className="nav-item-wrapper"
                ref={(el) => {
                    if (el) {
                        navItemRefs.current.set(item.id, el);
                    } else {
                        navItemRefs.current.delete(item.id);
                    }
                }}
            >
                <div
                    className={`nav-item ${hasChildren ? 'nav-item-parent' : ''} ${showHoverMenu ? 'nav-item-with-menu' : ''} ${isWorkItem ? 'nav-item-work-item' : ''} ${isActive ? 'nav-item-active' : ''}`}
                    style={{ paddingLeft: `${indentLevel + 8}px` }}
                    onMouseEnter={() => showHoverMenu && setHoveredItemId(item.id)}
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
                        <span className={`nav-item-label ${item.unread ? 'nav-item-label-unread' : ''}`}>{displayLabel}</span>
                    </div>
                    {showHoverMenu && (
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
                                {isLoadingProjects ? (
                                    <div className="panel-title-dropdown-item">Loading projects...</div>
                                ) : projects.length === 0 ? (
                                    <div className="panel-title-dropdown-item">No projects</div>
                                ) : (
                                    projects.map(project => (
                                        <div
                                            key={project.id || project.name}
                                            className={`panel-title-dropdown-item ${project.id === activeProjectId ? 'panel-title-dropdown-item-selected' : ''}`}
                                            onClick={() => handleProjectSelect(project)}
                                        >
                                            {project.name}
                                        </div>
                                    ))
                                )}
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
                <div ref={navigationContentRef} className="panel-content navigation-content">
                    {isLoadingNavigation && (
                        <div style={{ padding: '8px', color: '#666' }}>Loading navigation...</div>
                    )}
                    {displayNavSections.map(section => {
                        // If section has no items, render it as a simple clickable item
                        if (section.items.length === 0) {
                            const isSectionHovered = hoveredItemId === section.id;
                            const isSectionMenuOpen = openMenuId === section.id;
                            const isSectionActive = activeNavItemId === section.id;
                            return (
                                <div 
                                    key={section.id} 
                                    className={`nav-item-wrapper ${section.spacingBefore ? 'nav-item-wrapper-spacing-before' : ''}`}
                                    ref={(el) => {
                                        if (el) {
                                            navItemRefs.current.set(section.id, el);
                                        } else {
                                            navItemRefs.current.delete(section.id);
                                        }
                                    }}
                                >
                                    <div
                                        className={`nav-item nav-item-with-menu ${isSectionActive ? 'nav-item-active' : ''}`}
                                        onMouseEnter={() => setHoveredItemId(section.id)}
                                        onMouseLeave={() => setHoveredItemId(null)}
                                        onContextMenu={(e) => handleContextMenu(e, section.id, section)}
                                        onClick={() => handleNavClick(section.id)}
                                    >
                                        {section.icon && (
                                            <span className="nav-item-icon">{section.icon}</span>
                                        )}
                                        <span className="nav-item-label">{section.label}</span>
                                        <button
                                            className={`nav-item-menu-button ${isSectionHovered ? 'nav-item-menu-button-visible' : ''}`}
                                            data-menu-button={section.id}
                                            onClick={(e) => handleMenuClick(section.id, e)}
                                            aria-label="More options"
                                        >
                                            <FaEllipsisVertical />
                                        </button>
                                    </div>
                                    {isSectionMenuOpen && (() => {
                                        const menuItems = getSectionHoverMenuItems(section);
                                        return (
                                            <div
                                                ref={(el) => {
                                                    if (el) {
                                                        menuRefs.current.set(section.id, el);
                                                    } else {
                                                        menuRefs.current.delete(section.id);
                                                    }
                                                }}
                                                className="nav-item-menu"
                                            >
                                                {menuItems.map(menuItem => (
                                                    <div
                                                        key={menuItem.id}
                                                        className="nav-item-menu-item"
                                                        onClick={() => {
                                                            menuItem.onClick(section.id);
                                                            setOpenMenuId(null);
                                                        }}
                                                    >
                                                        {menuItem.label}
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </div>
                            );
                        }

                        // Otherwise, render as an expandable section
                        const isSectionExpanded = expandedSections.has(section.id);
                        const isSectionHovered = hoveredItemId === section.id;
                        const isSectionMenuOpen = openMenuId === section.id;
                        const isSectionActive = activeNavItemId === section.id;
                        return (
                            <div 
                                key={section.id} 
                                className={`nav-section ${section.spacingBefore ? 'nav-section-spacing-before' : ''}`}
                                ref={(el) => {
                                    if (el) {
                                        navItemRefs.current.set(section.id, el);
                                    } else {
                                        navItemRefs.current.delete(section.id);
                                    }
                                }}
                            >
                                <div className="nav-section-header-wrapper">
                                    <div
                                        className={`nav-section-header nav-section-header-with-menu ${isSectionActive ? 'nav-section-header-active' : ''}`}
                                        onMouseEnter={() => setHoveredItemId(section.id)}
                                        onMouseLeave={() => setHoveredItemId(null)}
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
                                        <button
                                            className={`nav-item-menu-button ${isSectionHovered ? 'nav-item-menu-button-visible' : ''}`}
                                            data-menu-button={section.id}
                                            onClick={(e) => handleMenuClick(section.id, e)}
                                            aria-label="More options"
                                        >
                                            <FaEllipsisVertical />
                                        </button>
                                    </div>
                                    {isSectionMenuOpen && (() => {
                                        const menuItems = getSectionHoverMenuItems(section);
                                        return (
                                            <div
                                                ref={(el) => {
                                                    if (el) {
                                                        menuRefs.current.set(section.id, el);
                                                    } else {
                                                        menuRefs.current.delete(section.id);
                                                    }
                                                }}
                                                className="nav-item-menu"
                                            >
                                                {menuItems.map(menuItem => (
                                                    <div
                                                        key={menuItem.id}
                                                        className="nav-item-menu-item"
                                                        onClick={() => {
                                                            menuItem.onClick(section.id);
                                                            setOpenMenuId(null);
                                                        }}
                                                    >
                                                        {menuItem.label}
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}
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

