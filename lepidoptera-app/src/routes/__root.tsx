import * as React from 'react'
import { Outlet, createRootRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ThemeProvider } from 'next-themes';
import { Theme, Flex, Box } from '@radix-ui/themes';
import RightMenubar from '../layout/right-menubar';
import SearchMenubar from '../layout/search-menubar';
import TopMenubar from '../layout/top-menubar';
import PanelLayout from '../layout/panel-layout';
import DialogLayout from '../layout/dialog-layout';
import WelcomeDialog from '../components/welcome-dialog';
import "@radix-ui/themes/styles.css";
import '../App.scss';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useEffect } from 'react';

export const Route = createRootRoute({
    component: RootLayout,
    validateSearch: (search: Record<string, unknown>) => {
        return {
            dialog: (search.dialog === 'true' || search.dialog === true) as boolean,
        }
    },
})

function RootLayout() {
    const [welcomeDialogOpen, setWelcomeDialogOpen] = React.useState(true);
    const navigate = useNavigate();
    const { dialog } = useSearch({ from: '__root__' });

    const handleStartNewProject = () => {
        navigate({ to: '/projects/new/edit' });
    };

    useEffect(() => {
        if (!dialog) {
            const window = getCurrentWindow();
            window.setTitle(`Lepidoptera`).then();
        }
    }, []);

    // If this is a dialog window, use the minimal dialog layout
    if (dialog) {
        return (
            <DialogLayout>
                <Outlet />
            </DialogLayout>
        );
    }



    // Otherwise, use the full app layout
    return (
        <ThemeProvider attribute="class" defaultTheme="dark">
            <Theme appearance="dark" accentColor="purple" grayColor="olive" radius="large">
                <div className="app-layout">
                    <Flex className="app-bar" justify="between" wrap="nowrap">
                        <Box>
                            <TopMenubar />
                        </Box>
                        <Box>
                            <SearchMenubar />
                        </Box>
                        <Box>
                            <RightMenubar />
                        </Box>
                    </Flex>
                    <PanelLayout>
                        <Outlet />
                    </PanelLayout>
                    {/*<TanStackRouterDevtools />*/}
                </div>
                <WelcomeDialog
                    open={welcomeDialogOpen}
                    onOpenChange={setWelcomeDialogOpen}
                    onStartNewProject={handleStartNewProject}
                />
            </Theme>
        </ThemeProvider>
    );
}
