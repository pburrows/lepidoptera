import { ThemeProvider } from 'next-themes';
import { Theme } from '@radix-ui/themes';
import "@radix-ui/themes/styles.css";
import '../App.scss';

interface DialogLayoutProps {
    children: React.ReactNode;
}

/**
 * DialogLayout - A minimal layout for dialog windows
 * 
 * This layout is used for windows that should display content without
 * navigation panels, menus, or other app chrome. Similar to opening
 * an email in a separate window in Outlook.
 */
export default function DialogLayout({ children }: DialogLayoutProps) {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark">
            <Theme appearance="dark" accentColor="purple" grayColor="olive" radius="large">
                <div className="dialog-layout" style={{
                    width: '100%',
                    height: '100vh',
                    overflow: 'auto',
                    backgroundColor: 'var(--color-panel-solid)',
                }}>
                    {children}
                </div>
            </Theme>
        </ThemeProvider>
    );
}

