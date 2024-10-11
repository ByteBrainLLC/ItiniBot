import { getAuthUrl, getTokens, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '../googleCalendar';
import { google } from 'googleapis';

jest.mock('googleapis');

describe('Google Calendar Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getAuthUrl returns a valid URL', () => {
    const mockGenerateAuthUrl = jest.fn().mockReturnValue('https://accounts.google.com/o/oauth2/auth');
    google.auth.OAuth2.mockImplementation(() => ({
      generateAuthUrl: mockGenerateAuthUrl,
    }));

    const url = getAuthUrl();
    expect(url).toBe('https://accounts.google.com/o/oauth2/auth');
    expect(mockGenerateAuthUrl).toHaveBeenCalledWith({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar'],
    });
  });

  test('getTokens exchanges code for tokens', async () => {
    const mockGetToken = jest.fn().mockResolvedValue({ tokens: { access_token: 'mock_access_token' } });
    google.auth.OAuth2.mockImplementation(() => ({
      getToken: mockGetToken,
    }));

    const tokens = await getTokens('mock_code');
    expect(tokens).toEqual({ access_token: 'mock_access_token' });
    expect(mockGetToken).toHaveBeenCalledWith('mock_code');
  });

  test('createCalendarEvent creates an event', async () => {
    const mockInsert = jest.fn().mockResolvedValue({ data: { id: 'mock_event_id' } });
    google.calendar.mockImplementation(() => ({
      events: {
        insert: mockInsert,
      },
    }));

    const event = {
      title: 'Test Event',
      description: 'Test Description',
      start_time: '2023-06-01T10:00:00Z',
      end_time: '2023-06-01T12:00:00Z',
      time_zone: 'UTC',
      location: 'Test Location',
    };

    const result = await createCalendarEvent('mock_access_token', event);
    expect(result).toEqual({ id: 'mock_event_id' });
    expect(mockInsert).toHaveBeenCalled();
  });

  // Add similar tests for updateCalendarEvent and deleteCalendarEvent
});