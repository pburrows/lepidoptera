import { useEffect, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { FaPlus, FaTicketAlt, FaFile } from 'react-icons/fa';
import { useNavigationStore } from '../../stores/navigation-store';
import type { NavigationItemResponse } from '../../stores/navigation-store';
import './dashboard.styles.scss';

// Dummy work item data for charts
const dummyWorkItems = [
    { id: '1', status: 'Open', priority: 'High' },
    { id: '2', status: 'In Progress', priority: 'Medium' },
    { id: '3', status: 'Open', priority: 'Low' },
    { id: '4', status: 'Done', priority: 'High' },
    { id: '5', status: 'In Progress', priority: 'High' },
    { id: '6', status: 'Open', priority: 'Medium' },
    { id: '7', status: 'Done', priority: 'Low' },
    { id: '8', status: 'In Progress', priority: 'Medium' },
    { id: '9', status: 'Open', priority: 'Low' },
    { id: '10', status: 'Done', priority: 'Medium' },
];

// Colors for charts
const CHART_COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

export default function Dashboard() {
    const navigate = useNavigate();
    
    // Use navigation store
    const {
        activeProjectId,
        navigation,
        isLoadingNavigation,
        fetchProjects,
    } = useNavigationStore();

    // Calculate work item statistics from dummy data
    const workItemCount = dummyWorkItems.length;
    
    const workItemsByStatus = dummyWorkItems.reduce((acc, workItem) => {
        acc[workItem.status] = (acc[workItem.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const workItemsByPriority = dummyWorkItems.reduce((acc, workItem) => {
        acc[workItem.priority] = (acc[workItem.priority] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Prepare data for pie charts
    const statusChartData = Object.entries(workItemsByStatus).map(([name, value]) => ({
        name,
        value,
    }));

    const priorityChartData = Object.entries(workItemsByPriority).map(([name, value]) => ({
        name,
        value,
    }));

    // Fetch projects on mount
    useEffect(() => {
        fetchProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // fetchProjects is stable from Zustand store

    // Count documents from navigation data
    const documentCount = useMemo(() => {
        if (!navigation) {
            return 0;
        }
        
        // Find the documents section and count all documents recursively
        const documentsSection = navigation.sections.find(section => section.id === 'documents');
        if (!documentsSection) {
            return 0;
        }
        
        const countDocuments = (items: NavigationItemResponse[]): number => {
            let count = 0;
            for (const item of items) {
                count += 1; // Count the item itself
                if (item.children) {
                    count += countDocuments(item.children);
                }
            }
            return count;
        };
        
        return countDocuments(documentsSection.items);
    }, [navigation]);

    const handleCreateWorkItem = () => {
        navigate({ to: '/work-items/new/edit' });
    };

    const handleCreateDocument = () => {
        navigate({ to: '/document/new/edit' });
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Dashboard</h1>
            </div>

            <div className="dashboard-content">
                {/* CTA Blocks */}
                <div className="dashboard-cta-section">
                    <button className="dashboard-cta-block" onClick={handleCreateWorkItem}>
                        <div className="dashboard-cta-icon">
                            <FaPlus />
                        </div>
                        <div className="dashboard-cta-content">
                            <h3 className="dashboard-cta-title">Create New Work Item</h3>
                            <p className="dashboard-cta-description">Add a new work item to track work</p>
                        </div>
                        <FaTicketAlt className="dashboard-cta-arrow" />
                    </button>

                    <button className="dashboard-cta-block" onClick={handleCreateDocument}>
                        <div className="dashboard-cta-icon">
                            <FaPlus />
                        </div>
                        <div className="dashboard-cta-content">
                            <h3 className="dashboard-cta-title">Create New Document</h3>
                            <p className="dashboard-cta-description">Create a new document</p>
                        </div>
                        <FaFile className="dashboard-cta-arrow" />
                    </button>
                </div>

                {/* Statistics Blocks */}
                <div className="dashboard-stats-section">
                    <div className="dashboard-stat-block">
                        <div className="dashboard-stat-icon">
                            <FaFile />
                        </div>
                        <div className="dashboard-stat-content">
                            <div className="dashboard-stat-value">
                                {isLoadingNavigation ? '...' : documentCount}
                            </div>
                            <div className="dashboard-stat-label">Active Documents</div>
                        </div>
                    </div>

                    <div className="dashboard-stat-block">
                        <div className="dashboard-stat-icon">
                            <FaTicketAlt />
                        </div>
                        <div className="dashboard-stat-content">
                            <div className="dashboard-stat-value">{workItemCount}</div>
                            <div className="dashboard-stat-label">Active Work Items</div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="dashboard-charts-section">
                    <div className="dashboard-chart-card">
                        <h3 className="dashboard-chart-title">Work Items by Status</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statusChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="dashboard-chart-card">
                        <h3 className="dashboard-chart-title">Work Items by Priority</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={priorityChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {priorityChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

