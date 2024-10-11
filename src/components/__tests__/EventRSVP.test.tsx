import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EventRSVP from '../EventRSVP';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/rsvp/:eventId', (req, res, ctx) => {
    return res(ctx.json({ status: 'not_responded', time_slot: null }));
  }),
  rest.post('/api/rsvp', (req, res, ctx) => {
    return res(ctx.json({ message: 'RSVP updated successfully' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('EventRSVP', () => {
  const mockProps = {
    eventId: 1,
    startTime: '2023-06-01T10:00:00Z',
    endTime: '2023-06-01T12:00:00Z',
    timeZone: 'UTC',
  };

  test('renders RSVP options', async () => {
    render(<EventRSVP {...mockProps} />);
    
    expect(screen.getByText('RSVP to this event')).toBeInTheDocument();
    expect(screen.getByText('Attending')).toBeInTheDocument();
    expect(screen.getByText('Maybe')).toBeInTheDocument();
    expect(screen.getByText('Not Attending')).toBeInTheDocument();
  });

  test('updates RSVP status when clicking on an option', async () => {
    render(<EventRSVP {...mockProps} />);
    
    fireEvent.click(screen.getByText('Attending'));
    
    await waitFor(() => {
      expect(screen.getByText('Attending')).toHaveClass('bg-green-500');
    });
  });

  test('shows time slot selection when attending a multi-day event', async () => {
    const multiDayProps = {
      ...mockProps,
      startTime: '2023-06-01T10:00:00Z',
      endTime: '2023-06-03T12:00:00Z',
    };

    render(<EventRSVP {...multiDayProps} />);
    
    fireEvent.click(screen.getByText('Attending'));
    
    await waitFor(() => {
      expect(screen.getByText('Select a time slot')).toBeInTheDocument();
    });
  });
});