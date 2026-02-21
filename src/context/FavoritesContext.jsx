import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('gonext_favorites');
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('gonext_favorites', JSON.stringify(favorites));
  }, [favorites]);

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

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);