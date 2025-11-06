import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  it('renders label', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click callback', async () => {
    const user = userEvent.setup();
    const handler = jest.fn();
    render(<Button onClick={handler}>Do it</Button>);
    await user.click(screen.getByRole('button', { name: /do it/i }));
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
