import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import LeftPanel from './left-panel';
import RightPanel from './right-panel';
import WorkspaceIconBar from './workspace-icon-bar';
import './panel-layout.styles.scss';

interface PanelLayoutProps {
    children: React.ReactNode;
}

export default function PanelLayout({ children }: PanelLayoutProps) {
    return (
        <div className="panel-layout-container">
            <WorkspaceIconBar />
            <PanelGroup 
                direction="horizontal" 
                className="panel-layout"
                autoSaveId="app-panel-layout"
            >
                <LeftPanel />
                <PanelResizeHandle className="panel-resize-handle" />
                <Panel defaultSize={60} minSize={30} className="main-content-panel">
                    <div className="main-content-scroll">
                        {children}
                    </div>
                </Panel>
                <PanelResizeHandle className="panel-resize-handle" />
                <RightPanel />
            </PanelGroup>
        </div>
    );
}

