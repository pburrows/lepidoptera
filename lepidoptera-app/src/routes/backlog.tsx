import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/backlog')({
  component: Backlog,
})

function Backlog() {
  return <div>TODO Backlog</div>
}
