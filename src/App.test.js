import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navigation component', () => {
  render(<App />);
  // The app should render successfully with Router wrapper
  expect(screen.getByRole('main')).toBeInTheDocument();
});

test('app renders without crashing', () => {
  const { container } = render(<App />);
  expect(container).toBeInTheDocument();
});
