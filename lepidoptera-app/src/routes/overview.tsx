import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/overview')({
  component: Overview,
})

function Overview() {
  return <div>TODO Overview</div>
}
