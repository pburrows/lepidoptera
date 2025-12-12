import { useState, useRef } from 'react';
import { Panel, ImperativePanelHandle } from 'react-resizable-panels';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import './panel-layout.styles.scss';

const COLLAPSED_SIZE = 5;

export default function LeftPanel() {
    const [isOpen, setIsOpen] = useState(true);
    const panelRef = useRef<ImperativePanelHandle>(null);

    const handleToggle = () => {
        if (panelRef.current) {
            if (isOpen) {
                panelRef.current.collapse();
            } else {
                panelRef.current.expand();
            }
        }
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
                {isOpen && <span className="panel-title">Navigation</span>}
            </div>
            {isOpen && (
                <div className="panel-content">
                    <div className="navigation-placeholder">
                        <p>Navigation Todo</p>
                    </div>
                </div>
            )}
        </Panel>
    );
}

