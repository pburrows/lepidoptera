import { createFileRoute } from '@tanstack/react-router'
import WorkItemList from '../../components/work-items/work-item-list'

export const Route = createFileRoute('/work-items/list')({
  component: WorkItemListPage,
})

function WorkItemListPage() {
  return <WorkItemList />
}
