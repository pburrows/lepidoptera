import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { invoke } from '@tauri-apps/api/core'
import WorkItemEdit from '../../components/work-items/work-item-edit'
import type { WorkItemData } from '../../types/work-item.types'

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
    if (!activeProjectId) {
      console.error('Cannot save work item: activeProjectId is required')
      return
    }

    try {
      // Get work item types to find priority value
      const workItemTypes = await invoke<Array<{
        id: string | null
        name: string
        allowed_priorities: Array<{ id: string; value: number }>
      }>>('get_work_item_types_by_project', {
        projectId: activeProjectId,
      })

      // Find the selected type and priority
      const selectedType = workItemTypes.find(t => (t.id || t.name) === workItem.type)
      if (!selectedType) {
        throw new Error(`Work item type not found: ${workItem.type}`)
      }

      const selectedPriority = selectedType.allowed_priorities.find(p => p.id === workItem.priority)
      if (!selectedPriority) {
        throw new Error(`Priority not found: ${workItem.priority}`)
      }

      // Convert customFields and assignmentFields to field_values
      // Include all fields that exist, even if empty (to maintain consistency and enable queries)
      // Only filter out undefined and null values
      const fieldValues = [
        // Assignment fields
        ...Object.entries(workItem.assignmentFields)
          .filter(([_, value]) => value !== undefined && value !== null) // Allow empty strings
          .map(([fieldId, value]) => {
            // Ensure value is always a string and never undefined
            const stringValue: string = String(value)
            return {
              id: null as string | null,
              project_id: activeProjectId,
              work_item_id: '', // Will be set by backend
              field_id: fieldId,
              is_assignment_field: true,
              value: stringValue, // Explicitly set as string (can be empty)
              created_at: '',
              updated_at: null as string | null,
              created_by: '',
              updated_by: null as string | null,
              is_active: true,
              field_definition: null,
            }
          }),
        // Custom fields
        ...Object.entries(workItem.customFields)
          .filter(([_, value]) => value !== undefined && value !== null) // Allow empty strings
          .map(([fieldId, value]) => {
            // Ensure value is always a string and never undefined
            // Empty strings are preserved, other types are JSON stringified
            const stringValue: string = typeof value === 'string' ? value : JSON.stringify(value)
            return {
              id: null as string | null,
              project_id: activeProjectId,
              work_item_id: '', // Will be set by backend
              field_id: fieldId,
              is_assignment_field: false,
              value: stringValue, // Explicitly set as string (can be empty)
              created_at: '',
              updated_at: null as string | null,
              created_by: '',
              updated_by: null as string | null,
              is_active: true,
              field_definition: null,
            }
          }),
      ]

      // Build WorkItemModel
      const workItemModel = {
        id: null as string | null,
        title: workItem.title,
        description: workItem.description || null,
        status: workItem.status,
        created_at: '',
        updated_at: null as string | null,
        priority: selectedPriority.value,
        created_by: '', // TODO: Get from authentication
        assigned_to: null as string | null, // TODO: Extract from assignmentFields if there's an "assigned_to" field
        project_id: activeProjectId,
        type_id: selectedType.id || selectedType.name,
        sequential_number: null as string | null,
        field_values: fieldValues,
      }

      // Validate that all field values have the required 'value' field
      fieldValues.forEach((fv, index) => {
        if (!('value' in fv) || fv.value === undefined) {
          console.error(`Field value at index ${index} is missing 'value' field:`, fv)
          throw new Error(`Field value for field_id '${fv.field_id}' is missing required 'value' field`)
        }
      })

      // Debug: Log the work item model before sending
      console.log('Work item model being sent:', JSON.stringify(workItemModel, null, 2))

      // Call create_work_item command
      // Note: sequence_prefix and machine_id are now retrieved by the command itself
      const savedWorkItem = await invoke<{
        id: string | null
        title: string
        description: string | null
        status: string
        created_at: string
        updated_at: string | null
        priority: number
        created_by: string
        assigned_to: string | null
        project_id: string
        type_id: string
        sequential_number: string | null
        field_values: Array<any>
      }>('create_work_item', {
        workItem: workItemModel,
      })

      console.log('Work item saved successfully:', savedWorkItem)

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
        if (savedWorkItem.id) {
          navigate({ 
            to: '/work-items/$id', 
            params: { id: savedWorkItem.id },
            search: { dialog: false }
          })
        }
      }
    } catch (error) {
      console.error('Failed to save work item:', error)
      // TODO: Show error message to user
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

