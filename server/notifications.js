import sgMail from '@sendgrid/mail';
import twilio from 'twilio';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendNotification(type, recipient, content) {
  try {
    if (type === 'email') {
      const msg = {
        to: recipient,
        from: 'your-verified-sender@example.com', // Change to your verified sender
        subject: content.subject,
        text: content.text,
        html: content.html || content.text,
      };
      await sgMail.send(msg);
      console.log(`Email sent to ${recipient}`);
    } else if (type === 'sms') {
      await twilioClient.messages.create({
        body: content.body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: recipient
      });
      console.log(`SMS sent to ${recipient}`);
    }
  } catch (error) {
    console.error(`Error sending ${type} notification:`, error);
  }
}