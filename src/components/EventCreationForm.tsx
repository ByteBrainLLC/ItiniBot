import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import moment from 'moment-timezone';
import { useTheme } from '../contexts/ThemeContext';

// Import time zones data
import timeZones from '../data/timezones';

interface EventFormData {
  title: string;
  startDate: Date | null;
  endDate: Date | null;
  timeZone: string;
  location: string;
  maxAttendees: number;
}

interface EventCreationFormProps {
  onCreateEvent: (event: any) => void;
  onCancel: () => void;
  isDemoMode?: boolean;
}

const EventCreationForm: React.FC<EventCreationFormProps> = ({ onCreateEvent, onCancel, isDemoMode = false }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    startDate: null,
    endDate: null,
    timeZone: moment.tz.guess(),
    location: '',
    maxAttendees: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date: Date | null, field: 'startDate' | 'endDate') => {
    setFormData({ ...formData, [field]: date });
  };

  const handleTimeZoneChange = (selectedOption: any) => {
    setFormData({ ...formData, timeZone: selectedOption.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields.');
      return;
    }

    const eventData = {
      title: formData.title,
      start: formData.startDate,
      end: formData.endDate,
      extendedProps: {
        timeZone: formData.timeZone,
        location: formData.location,
        maxAttendees: formData.maxAttendees,
        isHosting: true,
      },
    };

    onCreateEvent(eventData);
  };

  return (
    <form onSubmit={handleSubmit} className={`max-w-2xl mx-auto p-8 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Event</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {isDemoMode && (
        <div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          Demo Mode: This event will not be saved
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium mb-1">Event Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium mb-1">Start Date & Time</label>
          <div className="relative">
            <DatePicker
              id="startDate"
              selected={formData.startDate}
              onChange={(date) => handleDateChange(date, 'startDate')}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              className={`w-full px-3 py-2 border rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium mb-1">End Date & Time</label>
          <div className="relative">
            <DatePicker
              id="endDate"
              selected={formData.endDate}
              onChange={(date) => handleDateChange(date, 'endDate')}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              className={`w-full px-3 py-2 border rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
            <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="timeZone" className="block text-sm font-medium mb-1">Time Zone</label>
        <Select
          options={timeZones.map(tz => ({ value: tz, label: tz }))}
          value={{ value: formData.timeZone, label: formData.timeZone }}
          onChange={handleTimeZoneChange}
          className="react-select-container"
          classNamePrefix="react-select"
          styles={{
            control: (provided) => ({
              ...provided,
              backgroundColor: theme === 'dark' ? '#374151' : 'white',
              borderColor: theme === 'dark' ? '#4B5563' : '#D1D5DB',
            }),
            singleValue: (provided) => ({
              ...provided,
              color: theme === 'dark' ? 'white' : 'black',
            }),
            menu: (provided) => ({
              ...provided,
              backgroundColor: theme === 'dark' ? '#374151' : 'white',
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused
                ? theme === 'dark' ? '#4B5563' : '#E5E7EB'
                : theme === 'dark' ? '#374151' : 'white',
              color: theme === 'dark' ? 'white' : 'black',
            }),
          }}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
        <div className="relative">
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 pl-10 border rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="maxAttendees" className="block text-sm font-medium mb-1">Max Attendees</label>
        <div className="relative">
          <input
            type="number"
            id="maxAttendees"
            name="maxAttendees"
            value={formData.maxAttendees}
            onChange={handleInputChange}
            min="0"
            className={`w-full px-3 py-2 pl-10 border rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} transition-colors duration-200`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors duration-200`}
        >
          Create Event
        </button>
      </div>
    </form>
  );
};

export default EventCreationForm;