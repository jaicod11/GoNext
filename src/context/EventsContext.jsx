import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const EventsContext = createContext(null);

const MOOD_MESSAGES = {
  work: {
    emoji: '💼',
    title: 'Time to Focus!',
    message: 'Your productive space awaits. Let\'s crush those goals today!',
    color: '#7c3aed'
  },
  date: {
    emoji: '🌹',
    title: 'Romance is in the Air!',
    message: 'Your special evening awaits. Make tonight unforgettable! 💕',
    color: '#f06292'
  },
  quickbite: {
    emoji: '🍔',
    title: 'Time to Refuel!',
    message: 'Your favorite quick bite spot is calling. Bon appétit!',
    color: '#ff9800'
  },
  budget: {
    emoji: '💸',
    title: 'Smart Spending Time!',
    message: 'Great food doesn\'t need a big budget. Enjoy your value meal!',
    color: '#4caf50'
  },
  explore: {
    emoji: '🗺️',
    title: 'Adventure Awaits!',
    message: 'Time to discover something new. Let curiosity be your guide!',
    color: '#29b6f6'
  }
};

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [todayNotification, setTodayNotification] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    checkTodayEvents();
    const interval = setInterval(checkTodayEvents, 60000);
    return () => clearInterval(interval);
  }, [events]);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/events');
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const checkTodayEvents = async () => {
    const today = new Date().toISOString().split('T')[0];
    const todayEvents = events.filter(e => e.date === today && !e.notified);

    if (todayEvents.length > 0) {
      const event = todayEvents[0];
      const moodData = MOOD_MESSAGES[event.mood] || MOOD_MESSAGES.explore;
      
      setTodayNotification({
        ...event,
        ...moodData,
        show: true
      });

      // Mark as notified in backend
      try {
        await api.patch(`/events/${event._id}`, { notified: true });
        setEvents(prev => prev.map(e => 
          e._id === event._id ? { ...e, notified: true } : e
        ));
      } catch (error) {
        console.error('Error marking event as notified:', error);
      }
    }
  };

  const addEvent = async (event) => {
    try {
      const { data } = await api.post('/events', event);
      setEvents(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await api.delete(`/events/${eventId}`);
      setEvents(prev => prev.filter(e => e._id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const dismissNotification = () => {
    setTodayNotification(null);
  };

  return (
    <EventsContext.Provider value={{ events, addEvent, deleteEvent, todayNotification, dismissNotification }}>
      {children}
    </EventsContext.Provider>
  );
}

export const useEvents = () => useContext(EventsContext);