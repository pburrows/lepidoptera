import { createFileRoute } from '@tanstack/react-router'
import WorkItemList from '../../components/work-items/work-item-list'

export const Route = createFileRoute('/work-items/backlog')({
  component: WorkItemBacklog,
})

function WorkItemBacklog() {
  return <WorkItemList />
}

