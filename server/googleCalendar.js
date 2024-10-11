import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/auth/google/callback';

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

export function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
  });
}

export async function getTokens(code) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export async function createCalendarEvent(accessToken, event) {
  oauth2Client.setCredentials({ access_token: accessToken });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const calendarEvent = {
    summary: event.title,
    description: event.description,
    start: {
      dateTime: event.start_time,
      timeZone: event.time_zone,
    },
    end: {
      dateTime: event.end_time,
      timeZone: event.time_zone,
    },
    location: event.location,
  };

  try {
    const res = await calendar.events.insert({
      calendarId: 'primary',
      resource: calendarEvent,
    });
    return res.data;
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    throw error;
  }
}

export async function updateCalendarEvent(accessToken, eventId, updatedEvent) {
  oauth2Client.setCredentials({ access_token: accessToken });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const calendarEvent = {
    summary: updatedEvent.title,
    description: updatedEvent.description,
    start: {
      dateTime: updatedEvent.start_time,
      timeZone: updatedEvent.time_zone,
    },
    end: {
      dateTime: updatedEvent.end_time,
      timeZone: updatedEvent.time_zone,
    },
    location: updatedEvent.location,
  };

  try {
    const res = await calendar.events.update({
      calendarId: 'primary',
      eventId: eventId,
      resource: calendarEvent,
    });
    return res.data;
  } catch (error) {
    console.error('Error updating Google Calendar event:', error);
    throw error;
  }
}

export async function deleteCalendarEvent(accessToken, eventId) {
  oauth2Client.setCredentials({ access_token: accessToken });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });
  } catch (error) {
    console.error('Error deleting Google Calendar event:', error);
    throw error;
  }
}