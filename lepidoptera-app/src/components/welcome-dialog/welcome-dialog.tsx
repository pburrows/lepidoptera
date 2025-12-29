import * as Dialog from '@radix-ui/react-dialog';
import { Box, Flex, Button, Theme } from '@radix-ui/themes';
import { FaXmark } from 'react-icons/fa6';
import './welcome-dialog.styles.scss';

export interface WelcomeDialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean;

  /**
   * Callback when dialog should close
   */
  onOpenChange: (open: boolean) => void;

  /**
   * Callback when "Start a New Project" button is clicked
   */
  onStartNewProject?: () => void;

  /**
   * Callback when "Sync with an Existing Project" button is clicked
   */
  onSyncExistingProject?: () => void;
}

/**
 * WelcomeDialog - A welcome dialog shown when the app first opens
 *
 * Features:
 * - Displays background image on the left
 * - Welcome message and action buttons on the right
 */
export default function WelcomeDialog({
  open,
  onOpenChange,
  onStartNewProject,
  onSyncExistingProject,
}: WelcomeDialogProps) {
  const handleStartNewProject = () => {
    onStartNewProject?.();
    onOpenChange(false);
  };

  const handleSyncExistingProject = () => {
    onSyncExistingProject?.();
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Theme>
          <Dialog.Overlay className="welcome-dialog-overlay" />
          <Dialog.Content className="welcome-dialog-content">
            <Flex className="welcome-dialog-layout">
              {/* Left side - Background image */}
              <Box className="welcome-dialog-image-container">
                <img
                  src="/background.png"
                  alt="Welcome background"
                  className="welcome-dialog-image"
                />
              </Box>

              {/* Right side - Welcome message and buttons */}
              <Box className="welcome-dialog-content-container">
                <Dialog.Title className="welcome-dialog-title">
                  Welcome to Lepidoptera
                </Dialog.Title>

                <Flex direction="column" gap="4" mt="6">
                  <Button
                    size="4"
                    onClick={handleStartNewProject}
                    className="welcome-dialog-button"
                  >
                    Start a New Project
                  </Button>
                  <Button
                    size="4"
                    variant="soft"
                    onClick={handleSyncExistingProject}
                    className="welcome-dialog-button"
                  >
                    Sync with an Existing Project
                  </Button>
                </Flex>
              </Box>
            </Flex>

            <Dialog.Close asChild>
              <button className="welcome-dialog-close-button" aria-label="Close">
                <FaXmark />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Theme>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

