import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { Calendar } from 'lucide-react';

interface EventRSVPProps {
  eventId: number;
  startTime: string;
  endTime: string;
  timeZone: string;
}

const EventRSVP: React.FC<EventRSVPProps> = ({ eventId, startTime, endTime, timeZone }) => {
  const [rsvpStatus, setRsvpStatus] = useState<string>('not_responded');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    fetchRSVPStatus();
    generateTimeSlots();
  }, [eventId]);

  const fetchRSVPStatus = async () => {
    try {
      const response = await fetch(`/api/rsvp/${eventId}`);
      if (response.ok) {
        const data = await response.json();
        setRsvpStatus(data.status);
        setSelectedTimeSlot(data.time_slot);
      }
    } catch (error) {
      console.error('Error fetching RSVP status:', error);
    }
  };

  const generateTimeSlots = () => {
    const start = moment.tz(startTime, timeZone);
    const end = moment.tz(endTime, timeZone);
    const slots = [];

    while (start.isBefore(end)) {
      slots.push(start.format());
      start.add(1, 'hour');
    }

    setTimeSlots(slots);
  };

  const handleRSVP = async (status: string) => {
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          status,
          timeSlot: selectedTimeSlot,
        }),
      });

      if (response.ok) {
        setRsvpStatus(status);
      } else {
        console.error('Failed to update RSVP');
      }
    } catch (error) {
      console.error('Error updating RSVP:', error);
    }
  };

  const handleTimeSlotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTimeSlot(e.target.value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">RSVP to this event</h3>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleRSVP('attending')}
          className={`px-4 py-2 rounded-md ${
            rsvpStatus === 'attending'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Attending
        </button>
        <button
          onClick={() => handleRSVP('maybe')}
          className={`px-4 py-2 rounded-md ${
            rsvpStatus === 'maybe'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Maybe
        </button>
        <button
          onClick={() => handleRSVP('not_attending')}
          className={`px-4 py-2 rounded-md ${
            rsvpStatus === 'not_attending'
              ? 'bg-red-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Not Attending
        </button>
      </div>
      {rsvpStatus === 'attending' && timeSlots.length > 1 && (
        <div className="mt-4">
          <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 mb-1">
            Select a time slot
          </label>
          <div className="relative">
            <select
              id="timeSlot"
              value={selectedTimeSlot || ''}
              onChange={handleTimeSlotChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a time slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {moment.tz(slot, timeZone).format('MMMM D, YYYY h:mm A')}
                </option>
              ))}
            </select>
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRSVP;