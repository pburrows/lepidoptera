import { createFileRoute } from '@tanstack/react-router'
import ProjectEdit from '../../components/projects/project-edit'

export const Route = createFileRoute('/projects/new/edit')({
  component: NewProjectEdit,
})

function NewProjectEdit() {
  return <ProjectEdit />
}
