import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects-manage')({
  component: ProjectsManage,
})

function ProjectsManage() {
  return <div>TODO ProjectsManage</div>
}
