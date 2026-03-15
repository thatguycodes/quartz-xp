import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button } from './Button';

const withBackground = (Story: React.ComponentType) => (
  <div
    style={{
      background: 'var(--color-background-base)',
      padding: '1.5rem',
      minHeight: '100px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.75rem',
      alignItems: 'center',
    }}
  >
    <Story />
  </div>
);

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Shared/Button',
  tags: ['autodocs'],
  decorators: [withBackground],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'large',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    size: 'medium',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
    size: 'medium',
  },
};

export const Small: Story = {
  args: {
    children: 'Small Button',
    variant: 'primary',
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    variant: 'primary',
    size: 'large',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    size: 'medium',
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <>
      <Button variant="primary" size="medium">
        Primary
      </Button>
      <Button variant="secondary" size="medium">
        Secondary
      </Button>
      <Button variant="outline" size="medium">
        Outline
      </Button>
      <Button variant="primary" size="medium" disabled>
        Disabled
      </Button>
    </>
  ),
};
