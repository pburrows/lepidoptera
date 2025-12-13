import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/document')({
  component: Document,
})

function Document() {
  return <div>TODO Document</div>
}
