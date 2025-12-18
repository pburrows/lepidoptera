import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Box, TextField, Separator } from '@radix-ui/themes'
import type { Editor } from '@tiptap/react'
import RichTextEditor from '../../components/editor/rich-text-editor'
import RichTextEditorToolbar from '../../components/editor/rich-text-editor-toolbar'

export const Route = createFileRoute('/document/$id/edit')({
  component: DocumentEdit,
})

function DocumentEdit() {
  const { id } = Route.useParams()
  
  // TODO: Load document data based on id
  const [content, setContent] = useState<string>('<p>Document content will be loaded here...</p>')
  const [title, setTitle] = useState<string>('Document Title')
  const [editor, setEditor] = useState<Editor | null>(null)

  const handleContentChange = (html: string) => {
    setContent(html)
    // TODO: Save to API/store
  }

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    // TODO: Save to API/store
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
