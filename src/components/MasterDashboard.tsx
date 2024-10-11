import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Calendar, Users } from 'lucide-react';
import EventCreationForm from './EventCreationForm';
import { useTheme } from '../contexts/ThemeContext';

interface Event {
  id: number;
  title: string;
  start: string;
  end: string;
  extendedProps: {
    isHosting: boolean;
  };
}

interface MasterDashboardProps {
  isDemoMode?: boolean;
}

const MasterDashboard: React.FC<MasterDashboardProps> = ({ isDemoMode = false }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [viewType, setViewType] = useState<'all' | 'hosting' | 'participating'>('all');
  const [showEventForm, setShowEventForm] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (isDemoMode) {
      // Load demo events
      setEvents([
        {
          id: 1,
          title: 'Demo Event 1',
          start: '2023-06-15T10:00:00',
          end: '2023-06-15T12:00:00',
          extendedProps: { isHosting: true },
        },
        {
          id: 2,
          title: 'Demo Event 2',
          start: '2023-06-16T14:00:00',
          end: '2023-06-16T16:00:00',
          extendedProps: { isHosting: false },
        },
      ]);
    } else {
      fetchEvents();
    }
  }, [isDemoMode]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        const formattedEvents = data.map((event: any) => ({
          id: event.id,
          title: event.title,
          start: event.start_time,
          end: event.end_time,
          extendedProps: {
            isHosting: event.creator_id === 1, // Replace 1 with the actual user ID
          },
        }));
        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const filteredEvents = events.filter((event) => {
    if (viewType === 'all') return true;
    if (viewType === 'hosting') return event.extendedProps.isHosting;
    if (viewType === 'participating') return !event.extendedProps.isHosting;
    return true;
  });

  const handleCreateEvent = (newEvent: Event) => {
    if (isDemoMode) {
      setEvents([...events, { ...newEvent, id: events.length + 1 }]);
    } else {
      // Handle actual event creation
    }
    setShowEventForm(false);
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <h1 className="text-3xl font-bold mb-6">Event Dashboard</h1>
      {isDemoMode && (
        <div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          Demo Mode: Changes will not be saved
        </div>
      )}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => setViewType('all')}
            className={`px-4 py-2 rounded-md ${
              viewType === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setViewType('hosting')}
            className={`px-4 py-2 rounded-md ${
              viewType === 'hosting' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Hosting
          </button>
          <button
            onClick={() => setViewType('participating')}
            className={`px-4 py-2 rounded-md ${
              viewType === 'participating' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Participating
          </button>
        </div>
        <button
          onClick={() => setShowEventForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Create Event
        </button>
      </div>
      <div className={`bg-white p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={filteredEvents}
          eventContent={(eventInfo) => (
            <div className="flex items-center">
              {eventInfo.event.extendedProps.isHosting ? (
                <Calendar className="mr-2" size={16} />
              ) : (
                <Users className="mr-2" size={16} />
              )}
              <span>{eventInfo.event.title}</span>
            </div>
          )}
        />
      </div>
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className={`bg-white p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <EventCreationForm onCreateEvent={handleCreateEvent} onCancel={() => setShowEventForm(false)} isDemoMode={isDemoMode} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterDashboard;