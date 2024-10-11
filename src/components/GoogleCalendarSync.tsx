import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

const GoogleCalendarSync: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkGoogleCalendarConnection();
  }, []);

  const checkGoogleCalendarConnection = async () => {
    try {
      const response = await fetch('/api/user/google-calendar-status');
      if (response.ok) {
        const data = await response.json();
        setIsConnected(data.isConnected);
      }
    } catch (error) {
      console.error('Error checking Google Calendar connection:', error);
    }
  };

  const handleConnect = () => {
    window.location.href = '/auth/google/calendar';
  };

  const handleDisconnect = async () => {
    try {
      const response = await fetch('/api/user/disconnect-google-calendar', { method: 'POST' });
      if (response.ok) {
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error disconnecting Google Calendar:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Google Calendar Sync</h2>
      {isConnected ? (
        <div>
          <p className="text-green-600 mb-4">
            <Calendar className="inline-block mr-2" size={20} />
            Your Google Calendar is connected
          </p>
          <button
            onClick={handleDisconnect}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Disconnect Google Calendar
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">Connect your Google Calendar to sync events automatically</p>
          <button
            onClick={handleConnect}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Connect Google Calendar
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleCalendarSync;