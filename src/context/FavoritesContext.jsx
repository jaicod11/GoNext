import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [visited, setVisited] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorites and visited on mount
  useEffect(() => {
    fetchFavorites();
    fetchVisited();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data } = await api.get('/favorites');
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVisited = async () => {
    try {
      const { data } = await api.get('/visited');
      setVisited(data);
    } catch (error) {
      console.error('Error fetching visited:', error);
    }
  };

  const addFavorite = async (place, mood) => {
    if (favorites.find(f => f.placeId === place.id)) return;
    
    try {
      const { data } = await api.post('/favorites', {
        placeId: place.id,
        name: place.name,
        address: place.address,
        category: place.category,
        lat: place.lat,
        lon: place.lon,
        rating: place.rating,
        distance: place.distance,
        isOpen: place.isOpen,
        mood: { id: mood.id, label: mood.label },
      });
      
      setFavorites(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };

  const removeFavorite = async (placeId) => {
    try {
      await api.delete(`/favorites/${placeId}`);
      setFavorites(prev => prev.filter(f => f.placeId !== placeId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const isFavorite = (placeId) => {
    return favorites.some(f => f.placeId === placeId);
  };

  const markVisited = async (place, mood) => {
    if (visited.find(v => v.placeId === place.id)) return;
    
    try {
      const { data } = await api.post('/visited', {
        placeId: place.id,
        name: place.name,
        address: place.address,
        category: place.category,
        lat: place.lat,
        lon: place.lon,
        rating: place.rating,
        mood: { id: mood.id, label: mood.label },
      });
      
      setVisited(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error marking visited:', error);
    }
  };

  const unmarkVisited = async (placeId) => {
    try {
      await api.delete(`/visited/${placeId}`);
      setVisited(prev => prev.filter(v => v.placeId !== placeId));
    } catch (error) {
      console.error('Error unmarking visited:', error);
    }
  };

  const isVisited = (placeId) => {
    return visited.some(v => v.placeId === placeId);
  };

  const mappedFavorites = favorites.map(f => ({
    id: f.placeId,
    ...f
  }));

  return (
    <FavoritesContext.Provider value={{ 
      favorites, visited, loading,
      addFavorite, removeFavorite, isFavorite,
      markVisited, unmarkVisited, isVisited 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);