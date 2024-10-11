import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GoogleCalendarSync from '../GoogleCalendarSync';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/user/google-calendar-status', (req, res, ctx) => {
    return res(ctx.json({ isConnected: false }));
  }),
  rest.post('/api/user/disconnect-google-calendar', (req, res, ctx) => {
    return res(ctx.json({ message: 'Disconnected successfully' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('GoogleCalendarSync', () => {
  test('renders connect button when not connected', async () => {
    render(<GoogleCalendarSync />);
    
    await waitFor(() => {
      expect(screen.getByText('Connect Google Calendar')).toBeInTheDocument();
    });
  });

  test('renders disconnect button when connected', async () => {
    server.use(
      rest.get('/api/user/google-calendar-status', (req, res, ctx) => {
        return res(ctx.json({ isConnected: true }));
      })
    );

    render(<GoogleCalendarSync />);
    
    await waitFor(() => {
      expect(screen.getByText('Disconnect Google Calendar')).toBeInTheDocument();
    });
  });

  test('handles disconnect action', async () => {
    server.use(
      rest.get('/api/user/google-calendar-status', (req, res, ctx) => {
        return res(ctx.json({ isConnected: true }));
      })
    );

    render(<GoogleCalendarSync />);
    
    const disconnectButton = await screen.findByText('Disconnect Google Calendar');
    fireEvent.click(disconnectButton);

    await waitFor(() => {
      expect(screen.getByText('Connect Google Calendar')).toBeInTheDocument();
    });
  });
});