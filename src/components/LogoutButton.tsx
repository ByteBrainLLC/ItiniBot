import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const LogoutButton: React.FC = () => {
  const { theme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Logout successful:', data.message);
        // Redirect to login page or home page after successful logout
        window.location.href = '/login';
      } else {
        const errorData = await response.json();
        console.error('Logout failed:', errorData.error);
        alert(`Logout failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An unexpected error occurred during logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`flex items-center px-4 py-2 rounded-md ${
        theme === 'light'
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-red-700 text-white hover:bg-red-800'
      } transition-colors duration-200 ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label="Logout"
    >
      <LogOut className="w-5 h-5 mr-2" />
      {isLoggingOut ? 'Logging out...' : 'Logout'}
    </button>
  );
};

export default LogoutButton;