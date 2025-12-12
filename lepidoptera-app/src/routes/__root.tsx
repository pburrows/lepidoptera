import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ThemeProvider } from 'next-themes';
import { Theme, Flex, Box } from '@radix-ui/themes';
import RightMenubar from '../layout/right-menubar';
import SearchMenubar from '../layout/search-menubar';
import TopMenubar from '../layout/top-menubar';
import PanelLayout from '../layout/panel-layout';
import "@radix-ui/themes/styles.css";
import '../App.scss';

export const Route = createRootRoute({
    component: RootLayout,
})

function RootLayout() {
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
            </Theme>
        </ThemeProvider>
    );
}
