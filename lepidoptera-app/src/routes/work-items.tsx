import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/work-items')({
  component: WorkItemsLayout,
})

function WorkItemsLayout() {
  return <Outlet />
}

