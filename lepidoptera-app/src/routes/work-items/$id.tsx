import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Box, Text, Separator, Button, Flex, Grid } from '@radix-ui/themes'
import RichTextEditor from '../../components/editor/rich-text-editor'

export const Route = createFileRoute('/work-items/$id')({
  component: WorkItemView,
})

function WorkItemView() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  
  // TODO: Load work item data based on id
  const workItem = {
    title: 'Sample Work Item Title',
    description: '<p>Work item description will be loaded here...</p>',
    type: 'task',
    priority: 'medium',
    status: 'open',
    assignee: 'John Doe',
    project: 'Project Alpha',
    labels: ['bug', 'urgent'],
    dueDate: '2024-12-31',
  }

  const handleEdit = () => {
    navigate({ to: '/work-items/$id/edit', params: { id } })
  }

  return (
    <Box p="4">
      <Flex direction="column" gap="4">
        {/* Header */}
        <Flex justify="between" align="center">
          <Text size="6" weight="bold">
            {workItem.title || 'Untitled Work Item'}
          </Text>
          <Button onClick={handleEdit} size="3">
            Edit
          </Button>
        </Flex>

        <Separator size="4" />

        {/* Main Content Grid */}
        <Grid columns={{ initial: "1", md: "2" }} gap="4">
          {/* Left Column - Main Content */}
          <Flex direction="column" gap="4">
            {/* Description */}
            <Box>
              <Text size="2" weight="medium" mb="2" as="label">
                Description
              </Text>
              <RichTextEditor
                value={workItem.description}
                placeholder="No description"
                editable={false}
                minHeight="200px"
                showToolbar={false}
                showCount={false}
              />
            </Box>

            {/* Labels */}
            {workItem.labels && workItem.labels.length > 0 && (
              <Box>
                <Text size="2" weight="medium" mb="2" as="label">
                  Labels
                </Text>
                <Flex gap="2" wrap="wrap">
                  {workItem.labels.map((label) => (
                    <Box
                      key={label}
                      style={{
                        padding: "4px 8px",
                        backgroundColor: "var(--accent-3)",
                        borderRadius: "var(--radius-2)",
                        fontSize: "var(--font-size-1)",
                      }}
                    >
                      <Text size="1">{label}</Text>
                    </Box>
                  ))}
                </Flex>
              </Box>
            )}
          </Flex>

          {/* Right Column - Metadata */}
          <Flex direction="column" gap="4">
            {/* Type */}
            <Box>
              <Text size="2" weight="medium" mb="2" as="label">
                Type
              </Text>
              <Text size="3" style={{ textTransform: 'capitalize' }}>
                {workItem.type}
              </Text>
            </Box>

            {/* Priority */}
            <Box>
              <Text size="2" weight="medium" mb="2" as="label">
                Priority
              </Text>
              <Text size="3" style={{ textTransform: 'capitalize' }}>
                {workItem.priority}
              </Text>
            </Box>

            {/* Status */}
            <Box>
              <Text size="2" weight="medium" mb="2" as="label">
                Status
              </Text>
              <Text size="3" style={{ textTransform: 'capitalize' }}>
                {workItem.status}
              </Text>
            </Box>

            {/* Assignee */}
            {workItem.assignee && (
              <Box>
                <Text size="2" weight="medium" mb="2" as="label">
                  Assignee
                </Text>
                <Text size="3">{workItem.assignee}</Text>
              </Box>
            )}

            {/* Project */}
            {workItem.project && (
              <Box>
                <Text size="2" weight="medium" mb="2" as="label">
                  Project
                </Text>
                <Text size="3">{workItem.project}</Text>
              </Box>
            )}

            {/* Due Date */}
            {workItem.dueDate && (
              <Box>
                <Text size="2" weight="medium" mb="2" as="label">
                  Due Date
                </Text>
                <Text size="3">
                  {new Date(workItem.dueDate).toLocaleDateString()}
                </Text>
              </Box>
            )}
          </Flex>
        </Grid>
      </Flex>
    </Box>
  )
}

