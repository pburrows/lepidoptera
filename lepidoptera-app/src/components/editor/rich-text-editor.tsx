import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Markdown } from '@tiptap/markdown';
import { useEffect, useCallback } from 'react';
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
import type { RichTextEditorProps } from './rich-text-editor.types';
import './rich-text-editor.styles.css';

/**
 * RichTextEditor - A full-featured WYSIWYG editor built with Tiptap
 * 
 * Features:
 * - Markdown support (input/output)
 * - Rich text formatting
 * - Links and images
 * - Task lists
 * - Code blocks
 * - Blockquotes
 * - Inline comments (when enabled)
 * - Radix UI theme integration
 */
export default function RichTextEditor({
  value = '',
  onChange,
  onMarkdownChange,
  placeholder = 'Start typing...',
  editable = true,
  minHeight = '200px',
  maxHeight,
  showToolbar = true,
  enableComments = false,
  className = '',
  id,
  showCount = false,
  extensions = [],
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'rich-text-editor-code-block',
          },
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'rich-text-editor-link',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rich-text-editor-image',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'rich-text-editor-task-list',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'rich-text-editor-task-item',
        },
      }),
      Markdown.configure({
        // html: true,
        // transformPastedText: true,
        // transformCopiedText: true,
      }),
      ...extensions,
    ],
    content: value,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = editor.getMarkdown() || ''; //.storage.markdown?.manager..getMarkdown() || '';
      
      onChange?.(html);
      onMarkdownChange?.(markdown);
    },
    editorProps: {
      attributes: {
        class: 'rich-text-editor-content',
      },
    },
  });

  // Update editor content when value prop changes (controlled mode)
  useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value) {
      editor.commands.setContent(value, {});
    }
  }, [value, editor]);

  // Update editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editable, editor]);

  // Toolbar button handlers
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
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('Image URL');

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const undo = useCallback(() => editor?.chain().focus().undo().run(), [editor]);
  const redo = useCallback(() => editor?.chain().focus().redo().run(), [editor]);

  if (!editor) {
    return null;
  }

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

  // Character count requires @tiptap/extension-character-count
  // If not installed, these will be 0
  const characterCount = (editor.storage as any).characterCount?.characters() || 0;
  const wordCount = (editor.storage as any).characterCount?.words() || 0;

  const editorStyles: React.CSSProperties = {
    minHeight,
    ...(maxHeight && { maxHeight, overflowY: 'auto' }),
  };

  return (
    <Box className={`rich-text-editor-wrapper ${className}`} id={id}>
      {showToolbar && (
        <Box className="rich-text-editor-toolbar">
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
      )}

      <Box className="rich-text-editor-container" style={editorStyles}>
        <EditorContent editor={editor} />
      </Box>

      {showCount && (
        <Box className="rich-text-editor-footer" p="2">
          <Flex justify="end" gap="3">
            <span className="rich-text-editor-count">
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </span>
            <span className="rich-text-editor-count">
              {characterCount} {characterCount === 1 ? 'character' : 'characters'}
            </span>
          </Flex>
        </Box>
      )}
    </Box>
  );
}

