import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ticket')({
  component: Ticket,
})

function Ticket() {
  return <div>TODO Ticket</div>
}

