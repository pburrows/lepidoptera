import { createFileRoute } from '@tanstack/react-router';
import { Box, Flex, Text } from '@radix-ui/themes';
import ProjectGeneralSettings from '../../components/projects/project-general-settings';

export const Route = createFileRoute('/projects/$id/edit')({
  component: ProjectSettings,
});

function ProjectSettings() {
  const { id } = Route.useParams();

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box p="4" style={{ borderBottom: '1px solid var(--gray-6)', backgroundColor: 'var(--color-panel-solid)' }}>
        <Text size="6" weight="bold" as="h1">
          Project Settings
        </Text>
      </Box>
      <Box flex="1" style={{ overflow: 'hidden' }}>
        <ProjectGeneralSettings projectId={id} />
      </Box>
    </div>
  );
}
