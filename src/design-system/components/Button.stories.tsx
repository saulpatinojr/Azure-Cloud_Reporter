import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Primary action',
  },
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary action',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost button',
  },
};

export const FullWidth: Story = {
  args: {
    block: true,
  },
};
