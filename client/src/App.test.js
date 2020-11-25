import { render, screen } from '@testing-library/react';
import Pages from './pages';

test('renders learn react link', () => {
  render(<Pages />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
