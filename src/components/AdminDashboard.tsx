import React, { useState, useEffect } from 'react';
import { Calendar, Users, Edit, Trash2, BarChart2 } from 'lucide-react';
import moment from 'moment-timezone';

interface Event {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  location: string;
  max_attendees: number;
  rsvp_count: number;
}

const AdminDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    // Open edit modal or navigate to edit page
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`/api/admin/events/${eventId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setEvents(events.filter(event => event.id !== eventId));
        }
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleViewRSVPs = (eventId: number) => {
    // Navigate to RSVP details page or open modal
    console.log('View RSVPs for event:', eventId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Your Events</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Event</th>
                <th className="px-4 py-2 text-left">Date & Time</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-center">RSVPs</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b">
                  <td className="px-4 py-2">{event.title}</td>
                  <td className="px-4 py-2">
                    {moment(event.start_time).format('MMM D, YYYY h:mm A')}
                  </td>
                  <td className="px-4 py-2">{event.location}</td>
                  <td className="px-4 py-2 text-center">
                    {event.rsvp_count} / {event.max_attendees}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleViewRSVPs(event.id)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      title="View RSVPs"
                    >
                      <Users size={20} />
                    </button>
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="text-green-500 hover:text-green-700 mr-2"
                      title="Edit Event"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete Event"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Event Statistics</h2>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Total Events</span>
            <span className="text-2xl font-bold">{events.length}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Total RSVPs</span>
            <span className="text-2xl font-bold">
              {events.reduce((sum, event) => sum + event.rsvp_count, 0)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Average Attendance Rate</span>
            <span className="text-2xl font-bold">
              {events.length > 0
                ? `${Math.round(
                    (events.reduce((sum, event) => sum + event.rsvp_count, 0) /
                      events.reduce((sum, event) => sum + event.max_attendees, 0)) *
                      100
                  )}%`
                : 'N/A'}
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
          <ul className="space-y-4">
            {events
              .filter((event) => moment(event.start_time).isAfter(moment()))
              .slice(0, 5)
              .map((event) => (
                <li key={event.id} className="flex items-center">
                  <Calendar className="mr-2" size={20} />
                  <span>{event.title}</span>
                  <span className="ml-auto text-gray-600">
                    {moment(event.start_time).format('MMM D, YYYY')}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;