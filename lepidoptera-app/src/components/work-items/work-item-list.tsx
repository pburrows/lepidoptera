import { invoke } from '@tauri-apps/api/core';
import { FaPlus } from 'react-icons/fa6';
import { useNavigationStore } from '../../stores/navigation-store';
import './work-item-list.styles.scss';

export default function WorkItemList() {
    const { activeProjectId } = useNavigationStore();

    const handleCreateNew = async () => {
        try {
            await invoke('open_new_window', {
                route: '/work-items/new/edit',
                title: 'Create New Work Item',
                label: 'work-item-edit',
                activeProjectId: activeProjectId || undefined,
            });
        } catch (error) {
            console.error('Failed to open new window:', error);
        }
    };

    return (
        <div className="work-item-list">
            <div className="work-item-list-header">
                <h1 className="work-item-list-title">Work Items</h1>
            </div>

            <div className="work-item-list-toolbar">
                <button 
                    className="work-item-list-create-button"
                    onClick={handleCreateNew}
                >
                    <FaPlus className="work-item-list-create-icon" />
                    <span>Create New</span>
                </button>
            </div>

            <div className="work-item-list-content">
                {/* Work items list will go here */}
            </div>
        </div>
    );
}

