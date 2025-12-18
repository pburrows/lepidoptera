import { createFileRoute, useNavigate } from '@tanstack/react-router'
import WorkItemEdit, { WorkItemData } from '../../components/work-items/work-item-edit'

export const Route = createFileRoute('/work-items/new/edit')({
  component: NewWorkItemEdit,
})

function NewWorkItemEdit() {
  const navigate = useNavigate()

  const handleSave = (workItem: WorkItemData) => {
    // TODO: Save work item to API/store
    console.log('Saving new work item:', workItem)
    // After saving, navigate to the work item view
    // navigate({ to: '/work-items/$id', params: { id: savedWorkItemId } })
  }

  const handleCancel = () => {
    // Navigate back to backlog
    navigate({ to: '/work-items/backlog' })
  }

  return (
    <WorkItemEdit
      onSave={handleSave}
      onCancel={handleCancel}
    />
  )
}

