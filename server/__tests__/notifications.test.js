import { sendNotification } from '../notifications';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';

jest.mock('@sendgrid/mail');
jest.mock('twilio');

describe('Notification Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sendNotification sends an email', async () => {
    const mockSend = jest.fn().mockResolvedValue({});
    sgMail.send = mockSend;

    await sendNotification('email', 'test@example.com', {
      subject: 'Test Subject',
      text: 'Test Content',
    });

    expect(mockSend).toHaveBeenCalledWith({
      to: 'test@example.com',
      from: 'your-verified-sender@example.com',
      subject: 'Test Subject',
      text: 'Test Content',
      html: 'Test Content',
    });
  });

  test('sendNotification sends an SMS', async () => {
    const mockCreate = jest.fn().mockResolvedValue({});
    twilio.mockImplementation(() => ({
      messages: {
        create: mockCreate,
      },
    }));

    await sendNotification('sms', '+1234567890', {
      body: 'Test SMS Content',
    });

    expect(mockCreate).toHaveBeenCalledWith({
      body: 'Test SMS Content',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: '+1234567890',
    });
  });
});