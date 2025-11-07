import type { Meta, StoryObj } from '@storybook/react';
import { ThemePreview } from '../theme/ThemePreview';
import { ThemeProvider } from '../../contexts/ThemeContext';

const meta: Meta<typeof ThemePreview> = {
  title: 'Components/Theme/ThemePreview',
  component: ThemePreview,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ThemePreview>;

export const Default: Story = {
  args: {},
};

export const WithCustomStyling: Story = {
  args: {
    className: 'max-w-4xl mx-auto',
  },
};