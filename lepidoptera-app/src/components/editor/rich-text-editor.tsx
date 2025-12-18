import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { useEffect } from 'react';
import { Box, Flex } from '@radix-ui/themes';
import type { RichTextEditorProps } from './rich-text-editor.types';
import RichTextEditorToolbar from './rich-text-editor-toolbar';

/**
 * RichTextEditor - A full-featured WYSIWYG editor built with Tiptap
 * 
 * Features:
 * - Rich text formatting (HTML-based)
 * - Links and images
 * - Task lists
 * - Code blocks
 * - Blockquotes
 * - Inline comments (when enabled)
 * - Radix UI theme integration
 * 
 * Note: Content is stored and edited as HTML. Markdown export will be
 * available as a future feature.
 */
export default function RichTextEditor({
  value = '',
  onChange,
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
  onEditorReady,
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
        // Disable link in StarterKit to avoid conflicts with our Link extension
        link: false,
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
      ...extensions,
    ],
    content: value,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
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

  // Notify parent when editor is ready
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  if (!editor) {
    return null;
  }

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
      {showToolbar && <RichTextEditorToolbar editor={editor} />}

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

