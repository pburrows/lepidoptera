import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ThemeProvider } from 'next-themes';
import { Theme, Flex, Box, Container } from '@radix-ui/themes';
import RightMenubar from '../layout/right-menubar';
import SearchMenubar from '../layout/search-menubar';
import TopMenubar from '../layout/top-menubar';
import "@radix-ui/themes/styles.css";
import '../App.css';

export const Route = createRootRoute({
    component: RootLayout,
})

function RootLayout() {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark">
            <Theme appearance="dark" accentColor="purple" grayColor="olive" radius="large">
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
                <Container>
                    <Outlet />
                </Container>
                <TanStackRouterDevtools />
            </Theme>
        </ThemeProvider>
    );
}
