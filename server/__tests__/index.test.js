import request from 'supertest';
import express from 'express';
import { app } from '../index';

jest.mock('../googleCalendar');
jest.mock('../notifications');

describe('API Endpoints', () => {
  test('POST /api/events creates a new event', async () => {
    const response = await request(app)
      .post('/api/events')
      .send({
        title: 'Test Event',
        description: 'Test Description',
        start_time: '2023-06-01T10:00:00Z',
        end_time: '2023-06-01T12:00:00Z',
        time_zone: 'UTC',
        location: 'Test Location',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.message).toBe('Event created successfully');
  });

  test('PUT /api/events/:id updates an event', async () => {
    const response = await request(app)
      .put('/api/events/1')
      .send({
        title: 'Updated Test Event',
        description: 'Updated Test Description',
        start_time: '2023-06-01T11:00:00Z',
        end_time: '2023-06-01T13:00:00Z',
        time_zone: 'UTC',
        location: 'Updated Test Location',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Event updated successfully');
  });

  test('DELETE /api/events/:id deletes an event', async () => {
    const response = await request(app).delete('/api/events/1');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Event deleted successfully');
  });

  // Add more tests for other endpoints (RSVP, user preferences, etc.)
});