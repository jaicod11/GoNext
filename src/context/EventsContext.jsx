import { createContext, useContext, useState, useEffect } from 'react';

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
    const stored = localStorage.getItem('gonext_events');
    if (stored) setEvents(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('gonext_events', JSON.stringify(events));
  }, [events]);

  // Check for today's events on mount and daily
  useEffect(() => {
    checkTodayEvents();
    const interval = setInterval(checkTodayEvents, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [events]);

  const checkTodayEvents = () => {
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

      // Mark as notified
      setEvents(prev => prev.map(e => 
        e.id === event.id ? { ...e, notified: true } : e
      ));
    }
  };

  const addEvent = (event) => {
    const newEvent = {
      ...event,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      notified: false
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const deleteEvent = (eventId) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
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