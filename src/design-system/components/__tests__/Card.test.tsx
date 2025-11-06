import { render, screen } from '@testing-library/react';
import { Card, CardHeader } from '../Card';

describe('Card', () => {
  it('renders header and content', () => {
    render(
      <Card>
        <CardHeader title="Card title" subtitle="Subtitle" />
        <p>Body content</p>
      </Card>,
    );

    expect(screen.getByText('Card title')).toBeInTheDocument();
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });
});
