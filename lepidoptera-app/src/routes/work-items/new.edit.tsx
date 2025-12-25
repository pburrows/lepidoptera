import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { getCurrentWindow } from '@tauri-apps/api/window'
import WorkItemEdit, { WorkItemData } from '../../components/work-items/work-item-edit'

export const Route = createFileRoute('/work-items/new/edit')({
  component: NewWorkItemEdit,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      dialog: (search.dialog === 'true' || search.dialog === true) as boolean,
      activeProjectId: (search.activeProjectId as string | undefined) || undefined,
    }
  },
})

function NewWorkItemEdit() {
  const navigate = useNavigate()
  const { dialog, activeProjectId } = useSearch({ from: '/work-items/new/edit' })

  const handleSave = async (workItem: WorkItemData) => {
    // TODO: Save work item to API/store
    console.log('Saving new work item:', workItem)
    
    // If in dialog mode, close the window after saving
    if (dialog) {
      try {
        const window = getCurrentWindow()
        await window.close()
      } catch (error) {
        console.error('Failed to close window:', error)
      }
    } else {
      // Otherwise, navigate to the work item view
      // navigate({ to: '/work-items/$id', params: { id: savedWorkItemId } })
    }
  }

  const handleCancel = async () => {
    // If in dialog mode, close the window
    if (dialog) {
      try {
        const window = getCurrentWindow()
        await window.close()
      } catch (error) {
        console.error('Failed to close window:', error)
      }
    } else {
      // Otherwise, navigate back to backlog
      navigate({ to: '/work-items/backlog', search: { dialog: false } })
    }
  }

  return (
    <WorkItemEdit
      activeProjectId={activeProjectId}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  )
}

