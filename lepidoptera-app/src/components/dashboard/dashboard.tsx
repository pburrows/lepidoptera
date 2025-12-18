import { useEffect, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { FaPlus, FaTicketAlt, FaFile } from 'react-icons/fa';
import { useNavigationStore } from '../../stores/navigation-store';
import type { NavigationItemResponse } from '../../stores/navigation-store';
import './dashboard.styles.scss';

// Dummy ticket data for charts
const dummyTickets = [
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

    // Calculate ticket statistics from dummy data
    const ticketCount = dummyTickets.length;
    
    const ticketsByStatus = dummyTickets.reduce((acc, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const ticketsByPriority = dummyTickets.reduce((acc, ticket) => {
        acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Prepare data for pie charts
    const statusChartData = Object.entries(ticketsByStatus).map(([name, value]) => ({
        name,
        value,
    }));

    const priorityChartData = Object.entries(ticketsByPriority).map(([name, value]) => ({
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

    const handleCreateTicket = () => {
        navigate({ to: '/backlog' });
    };

    const handleCreateDocument = () => {
        navigate({ to: '/document' });
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Dashboard</h1>
            </div>

            <div className="dashboard-content">
                {/* CTA Blocks */}
                <div className="dashboard-cta-section">
                    <button className="dashboard-cta-block" onClick={handleCreateTicket}>
                        <div className="dashboard-cta-icon">
                            <FaPlus />
                        </div>
                        <div className="dashboard-cta-content">
                            <h3 className="dashboard-cta-title">Create New Ticket</h3>
                            <p className="dashboard-cta-description">Add a new ticket to track work</p>
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
                            <div className="dashboard-stat-value">{ticketCount}</div>
                            <div className="dashboard-stat-label">Active Tickets</div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="dashboard-charts-section">
                    <div className="dashboard-chart-card">
                        <h3 className="dashboard-chart-title">Tickets by Status</h3>
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
                        <h3 className="dashboard-chart-title">Tickets by Priority</h3>
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

