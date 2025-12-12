import {useState, useEffect} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {Box, Flex, Button, TextField, Text, Theme} from '@radix-ui/themes';
import {FaXmark} from 'react-icons/fa6';

export interface LinkDialogProps {
    /**
     * Whether the dialog is open
     */
    open: boolean;

    /**
     * Callback when dialog should close
     */
    onOpenChange: (open: boolean) => void;

    /**
     * Callback when link is confirmed
     * @param url - The URL to link to
     * @param text - Optional link text (if provided, replaces selected text)
     */
    onConfirm: (url: string, text?: string) => void;

    /**
     * Initial URL value (e.g., from existing link)
     */
    initialUrl?: string;

    /**
     * Initial link text value (e.g., selected text in editor)
     */
    initialText?: string;
}

/**
 * LinkDialog - A dialog component for inserting/editing links in the rich text editor
 *
 * Features:
 * - URL input (required)
 * - Optional link text input
 * - Validates URL format
 * - Can be extended in the future to link to internal documents
 */
export default function LinkDialog({
                                       open,
                                       onOpenChange,
                                       onConfirm,
                                       initialUrl = '',
                                       initialText = '',
                                   }: LinkDialogProps) {
    const [url, setUrl] = useState(initialUrl);
    const [text, setText] = useState(initialText);
    const [urlError, setUrlError] = useState('');

    // Reset form when dialog opens/closes or initial values change
    useEffect(() => {
        if (open) {
            setUrl(initialUrl);
            setText(initialText);
            setUrlError('');
        }
    }, [open, initialUrl, initialText]);

    const validateUrl = (urlValue: string): boolean => {
        if (!urlValue.trim()) {
            setUrlError('URL is required');
            return false;
        }

        // Basic URL validation - allows http://, https://, mailto:, and relative URLs
        const urlPattern = /^(https?:\/\/|mailto:|#|\/)/i;
        const isValid = urlPattern.test(urlValue.trim()) || urlValue.trim().startsWith('/');

        if (!isValid) {
            // Try to auto-fix by prepending https://
            const fixedUrl = `https://${urlValue.trim()}`;
            try {
                new URL(fixedUrl);
                setUrlError('');
                return true;
            } catch {
                setUrlError('Please enter a valid URL (e.g., https://example.com)');
                return false;
            }
        }

        setUrlError('');
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const urlToUse = url.trim();
        if (!validateUrl(urlToUse)) {
            return;
        }

        // Auto-fix URL if it doesn't have a protocol
        let finalUrl = urlToUse;
        if (!/^(https?:\/\/|mailto:|#|\/)/i.test(urlToUse)) {
            finalUrl = `https://${urlToUse}`;
        }

        onConfirm(finalUrl, text.trim() || undefined);
        onOpenChange(false);
    };

    const handleCancel = () => {
        setUrlError('');
        onOpenChange(false);
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>

                <Theme>
                    <Dialog.Overlay className="link-dialog-overlay"/>
                    <Dialog.Content className="link-dialog-content">
                        <Dialog.Title className="link-dialog-title">
                            Insert Link
                        </Dialog.Title>

                        <Dialog.Description className="link-dialog-description">
                            Enter the URL and optionally specify link text.
                        </Dialog.Description>

                        <form onSubmit={handleSubmit}>
                            <Flex direction="column" gap="3" mt="4">
                                {/* URL Input */}
                                <Box>
                                    <Text size="2" weight="medium" mb="2" as="label" htmlFor="link-url">
                                        URL <Text color="red">*</Text>
                                    </Text>
                                    <TextField.Root
                                        id="link-url"
                                        type="url"
                                        placeholder="https://example.com"
                                        value={url}
                                        onChange={(e) => {
                                            setUrl(e.target.value);
                                            if (urlError) setUrlError('');
                                        }}
                                        onBlur={(e) => validateUrl(e.target.value)}
                                        color={urlError ? 'red' : undefined}
                                        size="3"
                                        autoFocus
                                    />
                                    {urlError && (
                                        <Text size="1" color="red" mt="1" as="p">
                                            {urlError}
                                        </Text>
                                    )}
                                </Box>

                                {/* Link Text Input */}
                                <Box>
                                    <Text size="2" weight="medium" mb="2" as="label" htmlFor="link-text">
                                        Link Text (optional)
                                    </Text>
                                    <TextField.Root
                                        id="link-text"
                                        placeholder="Display text for the link"
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        size="3"
                                    />
                                    <Text size="1" color="gray" mt="1" as="p">
                                        Leave empty to use selected text or URL
                                    </Text>
                                </Box>

                                {/* Action Buttons */}
                                <Flex justify="end" gap="3" mt="2">
                                    <Dialog.Close asChild>
                                        <Button type="button" variant="soft" onClick={handleCancel} size="3">
                                            Cancel
                                        </Button>
                                    </Dialog.Close>
                                    <Button type="submit" size="3">
                                        Insert Link
                                    </Button>
                                </Flex>
                            </Flex>
                        </form>

                        <Dialog.Close asChild>
                            <button className="link-dialog-close-button" aria-label="Close">
                                <FaXmark/>
                            </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Theme>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

