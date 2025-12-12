import { createFileRoute } from '@tanstack/react-router'
import TicketEdit from '../tickets/ticket-edit'
import TicketList from '../tickets/ticket-list'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <>
  <TicketEdit />
  <TicketList />
  </>
)
}
