import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/conversations/dms')({
  component: DirectMessagesView,
})

function DirectMessagesView() {
  return <h1>TODO: Direct Messages</h1>
}
