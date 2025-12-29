import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Box, Button, Flex, Separator, Text } from '@radix-ui/themes'
import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import WorkItemView from '../../components/work-items/work-item-view'
import type { WorkItemModel, WorkItemTypeModel } from '../../types/work-item.types'

export const Route = createFileRoute('/work-items/$id')({
  component: WorkItemViewPage,
})

function WorkItemViewPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const [workItem, setWorkItem] = useState<WorkItemModel | null>(null)
  const [workItemType, setWorkItemType] = useState<WorkItemTypeModel | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadWorkItem = async () => {
      setIsLoading(true)
      
      try {
        const workItemData = await invoke<WorkItemModel | null>('get_work_item', { id })
        
        if (!workItemData) {
          setIsLoading(false)
          return
        }
        
        setWorkItem(workItemData)
        
        // Load work item type
        if (workItemData.type_id) {
          try {
            const types = await invoke<WorkItemTypeModel[]>('get_work_item_types_by_project', {
              projectId: workItemData.project_id,
            })
            const type = types.find(t => (t.id || t.name) === workItemData.type_id)
            if (type) {
              setWorkItemType(type)
            }
          } catch (err) {
            console.error('Failed to load work item type:', err)
          }
        }
      } catch (err) {
        console.error('Failed to load work item:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      loadWorkItem()
    }
  }, [id])

  const handleEdit = () => {
    navigate({ to: '/work-items/$id/edit', params: { id }, search: { dialog: false } })
  }

  const typeDisplayName = workItemType?.display_name || workItemType?.name || workItem?.type_id || ''

  return (
    <Box p="4">
      <Flex direction="column" gap="4">
        {/* Breadcrumbs and Title */}
        {!isLoading && workItem && (
          <>
            <Flex align="center" gap="2">
              <Text size="2" color="gray">
                {workItem.sequential_number || '—'}
              </Text>
              <Text size="2" color="gray">
                ({typeDisplayName})
              </Text>
            </Flex>
            <Box>
              <h1 style={{ 
                margin: 0, 
                fontSize: 'var(--font-size-7)', 
                fontWeight: 'bold',
                lineHeight: 'var(--line-height-7)'
              }}>
                {workItem.title || 'Untitled Work Item'}
              </h1>
            </Box>
          </>
        )}

        {/* Toolbar */}
        <Flex 
          justify="between" 
          align="center"
          style={{
            borderTop: '1px solid var(--accent-6)',
            backgroundColor: 'var(--accent-2)',
            padding: 'var(--space-2) var(--space-3)',
            borderRadius: 'var(--radius-2)',
            marginTop: 'var(--space-2)',
          }}
        >
          <Box style={{ flex: 1 }} />
          <Button onClick={handleEdit} size="2">
            Edit
          </Button>
        </Flex>

        {/* Work Item View */}
        <WorkItemView workItemId={id} />
      </Flex>
    </Box>
  )
}

