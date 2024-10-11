import express from 'express';
import session from 'express-session';
import { pool } from './db.js';
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from './googleCalendar.js';
import { sendNotification } from './notifications.js';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const app = express();

// ... (previous middleware and routes)

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Google OAuth configuration
const googleOAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/auth/google/callback'
);

// Twitch OAuth configuration
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const TWITCH_REDIRECT_URI = 'http://localhost:3000/auth/twitch/callback';

// Google OAuth routes
app.get('/auth/google', (req, res) => {
  try {
    const authUrl = googleOAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
    });
    res.json({ authUrl });
  } catch (error) {
    console.error('Error generating Google auth URL:', error);
    res.status(500).json({ message: 'Failed to generate authentication URL' });
  }
});

app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await googleOAuth2Client.getToken(code);
    googleOAuth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: googleOAuth2Client });
    const { data } = await oauth2.userinfo.get();

    // Here you would typically create or update a user in your database
    // and set up a session for the authenticated user

    res.redirect('/dashboard'); // Redirect to the main dashboard after successful login
  } catch (error) {
    console.error('Error during Google authentication:', error);
    res.redirect('/?error=authentication_failed');
  }
});

// Twitch OAuth routes
app.get('/auth/twitch', (req, res) => {
  try {
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${TWITCH_REDIRECT_URI}&response_type=code&scope=user:read:email`;
    res.json({ authUrl });
  } catch (error) {
    console.error('Error generating Twitch auth URL:', error);
    res.status(500).json({ message: 'Failed to generate authentication URL' });
  }
});

// ... (rest of the server code remains the same)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'An unexpected error occurred', message: err.message });
});

export { app };