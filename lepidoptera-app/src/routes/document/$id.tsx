import { createFileRoute } from '@tanstack/react-router'
import { Box, Text, Separator } from '@radix-ui/themes'
import RichTextEditor from '../../components/editor/rich-text-editor'

export const Route = createFileRoute('/document/$id')({
  component: DocumentView,
})

function DocumentView() {
  const { id } = Route.useParams()
  
  // TODO: Load document data based on id
  const title = 'Document Title' // Will be loaded from API/store
  const content = '<p>Document content will be loaded here...</p>' // Will be loaded from API/store

  return (
    <Box className="document-page" style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Title display */}
      <Box style={{ flexShrink: 0, padding: 'var(--space-3)' }}>
        <Text 
          size="6" 
          weight="bold"
          style={{ 
            display: 'block',
            padding: 'var(--space-2)',
          }}
        >
          {title || 'Untitled Document'}
        </Text>
      </Box>

      <Separator size="4" style={{ flexShrink: 0 }} />

      {/* Read-only content */}
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'auto' }}>
        <RichTextEditor
          value={content}
          placeholder="No content"
          editable={false}
          minHeight="100%"
          showToolbar={false}
          showCount={false}
          className="document-viewer"
        />
      </Box>
    </Box>
  )
}
