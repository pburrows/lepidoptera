import { useState, useRef } from 'react';
import { Panel, ImperativePanelHandle } from 'react-resizable-panels';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import './panel-layout.styles.scss';

const COLLAPSED_SIZE = 0;
const MIN_SIZE = 15;

export default function RightPanel() {
    const [isOpen, setIsOpen] = useState(false);
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
            defaultSize={COLLAPSED_SIZE}
            minSize={MIN_SIZE}
            maxSize={50}
            collapsible={true}
            collapsedSize={COLLAPSED_SIZE}
            className="right-panel"
            onResize={(size) => {
                setIsOpen(size > COLLAPSED_SIZE);
            }}
        >
            {isOpen ? (
                <>
                    <div className="panel-header">
                        <span className="panel-title">Context</span>
                        <button 
                            className="panel-toggle-button"
                            onClick={handleToggle}
                            aria-label="Collapse context panel"
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                    <div className="panel-content">
                        <div className="context-placeholder">
                            <p>Context panel content will appear here</p>
                        </div>
                    </div>
                </>
            ) : (
                <div className="panel-header-collapsed">
                    <button 
                        className="panel-toggle-button"
                        onClick={handleToggle}
                        aria-label="Expand context panel"
                    >
                        <FaChevronLeft />
                    </button>
                </div>
            )}
        </Panel>
    );
}

