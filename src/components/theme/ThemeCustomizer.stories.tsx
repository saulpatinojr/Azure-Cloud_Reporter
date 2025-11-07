import type { Meta, StoryObj } from '@storybook/react';
import { ThemeCustomizer } from '../theme/ThemeCustomizer';
import { ThemeProvider } from '../../contexts/ThemeContext';

const meta: Meta<typeof ThemeCustomizer> = {
  title: 'Components/Theme/ThemeCustomizer',
  component: ThemeCustomizer,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ThemeCustomizer>;

export const Default: Story = {
  args: {},
};

export const WithCloseHandler: Story = {
  args: {
    onClose: () => console.log('Theme customizer closed'),
  },
};