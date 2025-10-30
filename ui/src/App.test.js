import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

global.fetch = jest.fn();

test('renders app title', () => {
  render(<App />);
  expect(screen.getByText(/Avalpha Technologies/i)).toBeInTheDocument();
  expect(screen.getByText(/Commission Calculator/i)).toBeInTheDocument();
});

test('calculates commission correctly', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      avalphaLocal: 200,
      avalphaForeign: 350,
      avalphaTotal: 550,
      competitorLocal: 20,
      competitorForeign: 75.5,
      competitorTotal: 95.5
    })
  });

  render(<App />);
  
  await userEvent.type(screen.getByLabelText(/local sales count/i), '10');
  await userEvent.type(screen.getByLabelText(/foreign sales count/i), '10');
  await userEvent.type(screen.getByLabelText(/average sale amount/i), '100');
  
  await userEvent.click(screen.getByRole('button', { name: /calculate commission/i }));
  
  await waitFor(() => {
    expect(screen.getByText('£550.00')).toBeInTheDocument();
    expect(screen.getByText('£95.50')).toBeInTheDocument();
  });
});

test('shows error on network failure', async () => {
  fetch.mockRejectedValueOnce(new Error('Network error'));

  render(<App />);
  
  await userEvent.type(screen.getByLabelText(/local sales count/i), '10');
  await userEvent.type(screen.getByLabelText(/foreign sales count/i), '10');
  await userEvent.type(screen.getByLabelText(/average sale amount/i), '100');
  await userEvent.click(screen.getByRole('button', { name: /calculate commission/i }));
  
  await waitFor(() => {
    expect(screen.getByText(/unable to connect to server/i)).toBeInTheDocument();
  });
});
