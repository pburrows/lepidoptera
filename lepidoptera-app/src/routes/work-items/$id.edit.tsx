import { createFileRoute, useNavigate } from '@tanstack/react-router'
import WorkItemEdit, { WorkItemData } from '../../components/work-items/work-item-edit'

export const Route = createFileRoute('/work-items/$id/edit')({
  component: WorkItemEditView,
})

function WorkItemEditView() {
  const { id } = Route.useParams()
  const navigate = useNavigate()

  // TODO: Load work item data based on id
  const workItem: WorkItemData = {
    title: 'Sample Work Item Title',
    description: '<p>Work item description will be loaded here...</p>',
    type: 'task',
    priority: 'medium',
    status: 'open',
    assignee: 'user1',
    project: 'project1',
    labels: ['bug', 'urgent'],
    dueDate: '2024-12-31',
  }

  const handleSave = (updatedWorkItem: WorkItemData) => {
    // TODO: Update work item in API/store
    console.log('Updating work item:', id, updatedWorkItem)
    // After saving, navigate to the work item view
    navigate({ to: '/work-items/$id', params: { id } })
  }

  const handleCancel = () => {
    // Navigate back to work item view
    navigate({ to: '/work-items/$id', params: { id } })
  }

  return (
    <WorkItemEdit
      workItem={workItem}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  )
}

