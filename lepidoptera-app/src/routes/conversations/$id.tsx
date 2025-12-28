import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/conversations/$id')({
  component: ConversationView,
})

function ConversationView() {
  return <h1>TODO: Specific Conversation</h1>
}
