import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/conversations/')({
  component: ConversationsIndex,
})

function ConversationsIndex() {
  return <h1>TODO: Conversations</h1>
}
