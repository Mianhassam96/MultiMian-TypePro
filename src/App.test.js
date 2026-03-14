import { render, screen } from '@testing-library/react';
import App from './App';

test('app renders without crashing', () => {
  const { container } = render(<App />);
  expect(container).toBeInTheDocument();
});

test('renders TypePro branding', () => {
  render(<App />);
  expect(screen.getByText(/TypePro/i)).toBeInTheDocument();
});
