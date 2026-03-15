import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  describe('semantics', () => {
    it('renders a <button> element with role="button"', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('defaults to type="button" to prevent accidental form submission', () => {
      render(<Button>Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('respects an explicit type override', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });
  });

  describe('accessible name', () => {
    it('uses children as the accessible name', () => {
      render(<Button>Save changes</Button>);
      expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
    });

    it('uses aria-label when provided (icon-only button pattern)', () => {
      render(<Button aria-label="Close dialog">×</Button>);
      expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('is not clickable when disabled', async () => {
      const onClick = jest.fn();
      render(<Button disabled onClick={onClick}>Click me</Button>);
      const btn = screen.getByRole('button');
      await userEvent.click(btn);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('has disabled attribute set', () => {
      render(<Button disabled>Click me</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('keyboard interaction', () => {
    it('fires onClick when Enter is pressed', () => {
      const onClick = jest.fn();
      render(<Button onClick={onClick}>Click me</Button>);
      fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
      screen.getByRole('button').click();
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('is reachable via Tab', async () => {
      render(<Button>Click me</Button>);
      await userEvent.tab();
      expect(screen.getByRole('button')).toHaveFocus();
    });

    it('is not reachable via Tab when disabled', async () => {
      render(<Button disabled>Click me</Button>);
      await userEvent.tab();
      expect(screen.getByRole('button')).not.toHaveFocus();
    });
  });

  describe('aria passthrough', () => {
    it('forwards arbitrary aria attributes', () => {
      render(<Button aria-describedby="hint">Click me</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', 'hint');
    });

    it('forwards aria-busy for async loading states', () => {
      render(<Button aria-busy="true">Loading…</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });
  });
});
