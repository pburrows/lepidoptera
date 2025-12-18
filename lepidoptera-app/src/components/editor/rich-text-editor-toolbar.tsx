import { useCallback, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { 
  FaBold, 
  FaItalic, 
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaListCheck,
  FaLink,
  FaImage,
  FaCode,
  FaQuoteRight,
  FaHeading
} from 'react-icons/fa6';
import {
  FaUndo,
  FaRedo,
} from 'react-icons/fa';
import { Box, Flex, Button, Separator } from '@radix-ui/themes';
import LinkDialog from './dialogs/link-dialog';

export interface RichTextEditorToolbarProps {
  /**
   * The Tiptap editor instance
   */
  editor: Editor | null;
  
  /**
   * Additional CSS class name
   */
  className?: string;
}

/**
 * RichTextEditorToolbar - A toolbar component for the rich text editor
 * 
 * Can be used separately from the editor or integrated within it.
 */
export default function RichTextEditorToolbar({ 
  editor, 
  className = '' 
}: RichTextEditorToolbarProps) {
  // All hooks must be called unconditionally and in the same order
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkDialogProps, setLinkDialogProps] = useState({ initialUrl: '', initialText: '' });

  // Toolbar button handlers - all hooks must be called before any conditional returns
  const toggleBold = useCallback(() => editor?.chain().focus().toggleBold().run(), [editor]);
  const toggleItalic = useCallback(() => editor?.chain().focus().toggleItalic().run(), [editor]);
  const toggleStrike = useCallback(() => editor?.chain().focus().toggleStrike().run(), [editor]);
  
  const toggleHeading = useCallback((level: 1 | 2 | 3) => {
    editor?.chain().focus().toggleHeading({ level }).run();
  }, [editor]);
  
  const toggleBulletList = useCallback(() => editor?.chain().focus().toggleBulletList().run(), [editor]);
  const toggleOrderedList = useCallback(() => editor?.chain().focus().toggleOrderedList().run(), [editor]);
  const toggleTaskList = useCallback(() => editor?.chain().focus().toggleTaskList().run(), [editor]);
  const toggleBlockquote = useCallback(() => editor?.chain().focus().toggleBlockquote().run(), [editor]);
  const toggleCodeBlock = useCallback(() => editor?.chain().focus().toggleCodeBlock().run(), [editor]);
  
  const setLink = useCallback(() => {
    if (!editor) return;
    
    // Capture current selection and existing link when opening dialog
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);
    const existingLinkUrl = editor.getAttributes('link').href || '';
    
    setLinkDialogProps({
      initialUrl: existingLinkUrl,
      initialText: selectedText,
    });
    setIsLinkDialogOpen(true);
  }, [editor]);

  const handleLinkConfirm = useCallback((url: string, text?: string) => {
    if (!editor) return;

    if (!url || url.trim() === '') {
      // Remove link if URL is empty
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);

    if (text && text.trim() !== '') {
      // Replace selected text with new text and add link
      editor
        .chain()
        .focus()
        .deleteRange({ from, to })
        .insertContent(`<a href="${url}">${text}</a>`)
        .run();
    } else if (selectedText) {
      // Use selected text with link
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    } else {
      // No selection, insert link with URL as text
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${url}">${url}</a>`)
        .run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('Image URL');

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const undo = useCallback(() => editor?.chain().focus().undo().run(), [editor]);
  const redo = useCallback(() => editor?.chain().focus().redo().run(), [editor]);

  // Early return after all hooks are called
  if (!editor) {
    return null;
  }

  // Editor state checks (these are not hooks, so they can be conditional)
  const isBold = editor.isActive('bold');
  const isItalic = editor.isActive('italic');
  const isStrike = editor.isActive('strike');
  const isHeading1 = editor.isActive('heading', { level: 1 });
  const isHeading2 = editor.isActive('heading', { level: 2 });
  const isHeading3 = editor.isActive('heading', { level: 3 });
  const isBulletList = editor.isActive('bulletList');
  const isOrderedList = editor.isActive('orderedList');
  const isTaskList = editor.isActive('taskList');
  const isBlockquote = editor.isActive('blockquote');
  const isCodeBlock = editor.isActive('codeBlock');
  const isLink = editor.isActive('link');

  return (
    <>
      <Box className={`rich-text-editor-toolbar ${className}`}>
        <Flex gap="1" align="center" wrap="wrap" p="2">
          {/* Text Formatting */}
          <Flex gap="1">
            <Button
              type="button"
              variant={isBold ? 'solid' : 'soft'}
              size="2"
              onClick={toggleBold}
              aria-label="Bold"
              title="Bold (Ctrl+B)"
            >
              <FaBold />
            </Button>
            <Button
              type="button"
              variant={isItalic ? 'solid' : 'soft'}
              size="2"
              onClick={toggleItalic}
              aria-label="Italic"
              title="Italic (Ctrl+I)"
            >
              <FaItalic />
            </Button>
            <Button
              type="button"
              variant={isStrike ? 'solid' : 'soft'}
              size="2"
              onClick={toggleStrike}
              aria-label="Strikethrough"
              title="Strikethrough"
            >
              <FaStrikethrough />
            </Button>
          </Flex>

          <Separator orientation="vertical" />

          {/* Headings */}
          <Flex gap="1">
            <Button
              type="button"
              variant={isHeading1 ? 'solid' : 'soft'}
              size="2"
              onClick={() => toggleHeading(1)}
              aria-label="Heading 1"
              title="Heading 1"
            >
              <FaHeading /> 1
            </Button>
            <Button
              type="button"
              variant={isHeading2 ? 'solid' : 'soft'}
              size="2"
              onClick={() => toggleHeading(2)}
              aria-label="Heading 2"
              title="Heading 2"
            >
              <FaHeading /> 2
            </Button>
            <Button
              type="button"
              variant={isHeading3 ? 'solid' : 'soft'}
              size="2"
              onClick={() => toggleHeading(3)}
              aria-label="Heading 3"
              title="Heading 3"
            >
              <FaHeading /> 3
            </Button>
          </Flex>

          <Separator orientation="vertical" />

          {/* Lists */}
          <Flex gap="1">
            <Button
              type="button"
              variant={isBulletList ? 'solid' : 'soft'}
              size="2"
              onClick={toggleBulletList}
              aria-label="Bullet List"
              title="Bullet List"
            >
              <FaListUl />
            </Button>
            <Button
              type="button"
              variant={isOrderedList ? 'solid' : 'soft'}
              size="2"
              onClick={toggleOrderedList}
              aria-label="Numbered List"
              title="Numbered List"
            >
              <FaListOl />
            </Button>
            <Button
              type="button"
              variant={isTaskList ? 'solid' : 'soft'}
              size="2"
              onClick={toggleTaskList}
              aria-label="Task List"
              title="Task List"
            >
              <FaListCheck />
            </Button>
          </Flex>

          <Separator orientation="vertical" />

          {/* Other Formatting */}
          <Flex gap="1">
            <Button
              type="button"
              variant={isBlockquote ? 'solid' : 'soft'}
              size="2"
              onClick={toggleBlockquote}
              aria-label="Blockquote"
              title="Blockquote"
            >
              <FaQuoteRight />
            </Button>
            <Button
              type="button"
              variant={isCodeBlock ? 'solid' : 'soft'}
              size="2"
              onClick={toggleCodeBlock}
              aria-label="Code Block"
              title="Code Block"
            >
              <FaCode />
            </Button>
          </Flex>

          <Separator orientation="vertical" />

          {/* Links and Media */}
          <Flex gap="1">
            <Button
              type="button"
              variant={isLink ? 'solid' : 'soft'}
              size="2"
              onClick={setLink}
              aria-label="Link"
              title="Add Link"
            >
              <FaLink />
            </Button>
            <Button
              type="button"
              variant="soft"
              size="2"
              onClick={addImage}
              aria-label="Image"
              title="Add Image"
            >
              <FaImage />
            </Button>
          </Flex>

          <Separator orientation="vertical" />

          {/* Undo/Redo */}
          <Flex gap="1">
            <Button
              type="button"
              variant="soft"
              size="2"
              onClick={undo}
              disabled={!editor.can().undo()}
              aria-label="Undo"
              title="Undo (Ctrl+Z)"
            >
              <FaUndo />
            </Button>
            <Button
              type="button"
              variant="soft"
              size="2"
              onClick={redo}
              disabled={!editor.can().redo()}
              aria-label="Redo"
              title="Redo (Ctrl+Y)"
            >
              <FaRedo />
            </Button>
          </Flex>
        </Flex>
      </Box>

      <LinkDialog
        open={isLinkDialogOpen}
        onOpenChange={setIsLinkDialogOpen}
        onConfirm={handleLinkConfirm}
        {...linkDialogProps}
      />
    </>
  );
}

