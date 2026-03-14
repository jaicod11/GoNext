import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [visited, setVisited] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const storedFavs = localStorage.getItem('gonext_favorites');
    const storedVisited = localStorage.getItem('gonext_visited');
    if (storedFavs) setFavorites(JSON.parse(storedFavs));
    if (storedVisited) setVisited(JSON.parse(storedVisited));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('gonext_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('gonext_visited', JSON.stringify(visited));
  }, [visited]);

  const addFavorite = (place, mood) => {
    if (favorites.find(f => f.id === place.id)) return;
    setFavorites(prev => [...prev, { ...place, mood, savedAt: new Date().toISOString() }]);
  };

  const removeFavorite = (placeId) => {
    setFavorites(prev => prev.filter(f => f.id !== placeId));
  };

  const isFavorite = (placeId) => {
    return favorites.some(f => f.id === placeId);
  };

  // ✅ NEW: Visited tracking
  const markVisited = (place, mood) => {
    if (visited.find(v => v.id === place.id)) return;
    setVisited(prev => [...prev, { ...place, mood, visitedAt: new Date().toISOString() }]);
  };

  const unmarkVisited = (placeId) => {
    setVisited(prev => prev.filter(v => v.id !== placeId));
  };

  const isVisited = (placeId) => {
    return visited.some(v => v.id === placeId);
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, addFavorite, removeFavorite, isFavorite,
      visited, markVisited, unmarkVisited, isVisited 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);