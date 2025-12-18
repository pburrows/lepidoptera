import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Box, TextField, Separator } from '@radix-ui/themes'
import type { Editor } from '@tiptap/react'
import RichTextEditor from '../../components/editor/rich-text-editor'
import RichTextEditorToolbar from '../../components/editor/rich-text-editor-toolbar'

export const Route = createFileRoute('/document/new/edit')({
  component: NewDocumentEdit,
})

function NewDocumentEdit() {
  const [content, setContent] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [editor, setEditor] = useState<Editor | null>(null)

  const handleContentChange = (html: string) => {
    setContent(html)
    // TODO: Auto-save draft or save on explicit save action
  }

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    // TODO: Auto-save draft or save on explicit save action
  }

  const handleEditorReady = (editorInstance: Editor) => {
    setEditor(editorInstance)
  }

  return (
    <Box className="document-page" style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Toolbar at the top */}
      <Box style={{ flexShrink: 0 }}>
        <RichTextEditorToolbar editor={editor} />
      </Box>

      {/* Title field */}
      <Box style={{ flexShrink: 0, padding: 'var(--space-3)' }}>
        <TextField.Root
          placeholder="Document title..."
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          size="3"
          style={{ 
            fontSize: 'var(--font-size-4)',
            fontWeight: 'var(--font-weight-medium)',
            border: 'none',
            boxShadow: 'none',
            padding: 'var(--space-2)',
          }}
        />
      </Box>

      <Separator size="4" style={{ flexShrink: 0 }} />

      {/* Editor body */}
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <RichTextEditor
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing your document..."
          editable={true}
          minHeight="100%"
          showToolbar={false}
          showCount={true}
          className="document-editor"
          onEditorReady={handleEditorReady}
        />
      </Box>
    </Box>
  )
}
