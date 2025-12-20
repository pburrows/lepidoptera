import { createFileRoute } from '@tanstack/react-router'
import { ProjectList } from '../components/projects'

export const Route = createFileRoute('/projects-manage')({
  component: ProjectsManage,
})

function ProjectsManage() {
  return <ProjectList />
}
