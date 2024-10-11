import React, { useState, useEffect } from 'react';
import { Bell, Mail, Phone } from 'lucide-react';
import GoogleCalendarSync from './GoogleCalendarSync';

interface UserPreferences {
  email_notifications: boolean;
  sms_notifications: boolean;
  phone_number: string;
}

const UserProfile: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    email_notifications: true,
    sms_notifications: false,
    phone_number: '',
  });

  useEffect(() => {
    fetchUserPreferences();
  }, []);

  const fetchUserPreferences = async () => {
    try {
      const response = await fetch('/api/user/notification-preferences');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/notification-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });
      if (response.ok) {
        alert('Notification preferences updated successfully');
      }
    } catch (error) {
      console.error('Error updating notification preferences:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="email_notifications"
                checked={preferences.email_notifications}
                onChange={handleInputChange}
                className="mr-2"
              />
              <Mail size={20} className="mr-2" />
              Receive email notifications
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="sms_notifications"
                checked={preferences.sms_notifications}
                onChange={handleInputChange}
                className="mr-2"
              />
              <Phone size={20} className="mr-2" />
              Receive SMS notifications
            </label>
          </div>
          {preferences.sms_notifications && (
            <div className="mb-4">
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={preferences.phone_number}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Preferences
          </button>
        </form>
      </div>
      <GoogleCalendarSync />
    </div>
  );
};

export default UserProfile;