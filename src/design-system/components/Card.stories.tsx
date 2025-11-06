import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader title="Workspace preview" subtitle="Use cards to segment content." />
      <p className="text-sm text-slate-600">
        Cards present grouped content with consistent padding and shadows. Combine with header, lists,
        and actions to highlight key data.
      </p>
    </Card>
  ),
};

export const Muted: Story = {
  render: () => (
    <Card variant="muted">
      <p className="text-sm text-slate-600">Muted variant for secondary information blocks.</p>
    </Card>
  ),
};
