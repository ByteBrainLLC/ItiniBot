import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Mail, Twitch, Play } from 'lucide-react';
import MasterDashboard from './MasterDashboard';

const LandingPage: React.FC = () => {
  const { theme } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      const response = await fetch('/auth/google', { 
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.authUrl) {
          window.location.href = data.authUrl;
        } else {
          throw new Error('No authentication URL provided');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to initiate Google login');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError('Authentication failed. Please try again.');
    }
  };

  const handleTwitchLogin = async () => {
    try {
      const response = await fetch('/auth/twitch', { 
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.authUrl) {
          window.location.href = data.authUrl;
        } else {
          throw new Error('No authentication URL provided');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to initiate Twitch login');
      }
    } catch (error) {
      console.error('Twitch login error:', error);
      setError('Authentication failed. Please try again.');
    }
  };

  const handleDemoMode = () => {
    setIsDemoMode(true);
  };

  if (isDemoMode) {
    return <MasterDashboard isDemoMode={true} />;
  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="absolute top-4 right-4">
        <button
          onClick={handleDemoMode}
          className={`flex items-center px-4 py-2 rounded-md ${
            theme === 'dark'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-green-500 hover:bg-green-600'
          } text-white transition-colors duration-200`}
        >
          <Play className="w-5 h-5 mr-2" />
          Try Demo
        </button>
      </div>
      <div className={`p-8 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome to ItiniBot</h1>
        <p className="text-center mb-8">ItiniBot helps you effortlessly schedule and manage your live-stream events. Join or host events across platforms like Twitch and YouTube.</p>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-center">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'}`}
          >
            <Mail className="w-5 h-5 mr-2" />
            Login with Google
          </button>
          <button
            onClick={handleTwitchLogin}
            className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'}`}
          >
            <Twitch className="w-5 h-5 mr-2" />
            Login with Twitch
          </button>
        </div>
      </div>
      <footer className="mt-8 text-center">
        <a href="#" className="text-sm text-blue-500 hover:text-blue-600 mr-4">Terms of Service</a>
        <a href="#" className="text-sm text-blue-500 hover:text-blue-600">Privacy Policy</a>
      </footer>
    </div>
  );
};

export default LandingPage;