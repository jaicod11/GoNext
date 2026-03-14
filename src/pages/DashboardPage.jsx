import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useEvents } from '../context/EventsContext';
import FilterBar from '../components/FilterBar';
import PlaceCard from '../components/PlaceCard';
import MapView from '../components/MapView';
import ViewToggle from '../components/ViewToggle';
import CalendarModal from '../components/CalendarModal';
import EventNotification from '../components/EventNotification';
import { useGeolocation } from '../hooks/useGeolocation';
import { usePlaces } from '../hooks/usePlaces';
import { filterAndSort } from '../utils/filterSort';
import { formatDistance } from '../utils/distanceCalc';

const DEFAULT_FILTERS = {
  maxDistance: 3000,
  minRating: 0,
  openNow: false,
  sortBy: 'distance',
  priceRange: [1, 2, 3], // All prices by default
  category: 'all'
};

function StarRating({ rating }) {
  if (!rating) return <span className="text-slate-600 text-xs">No rating</span>;
  const stars = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`text-xs ${i <= stars ? 'text-amber-400' : 'text-slate-700'}`}>★</span>
      ))}
      <span className="text-xs text-slate-500 ml-1">{rating}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { favorites, visited } = useFavorites();
  const [selectedMood, setSelectedMood] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showVisited, setShowVisited] = useState(false);
  const [view, setView] = useState('split'); // 'split', 'list', 'map'

  const { coords, error: geoError, loading: geoLoading } = useGeolocation();
  const { places, loading: placesLoading } = usePlaces(selectedMood, coords, filters.maxDistance);
  const filtered = useMemo(() => filterAndSort(places, filters), [places, filters]);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setSelectedPlace(null);
    setShowFilters(false);
    setShowFavorites(false);
    setShowVisited(false);
  };

  const displayPlaces = showFavorites ? favorites : showVisited ? visited : filtered;

  return (
    <>
      <EventNotification />
      {showCalendar && <CalendarModal onClose={() => setShowCalendar(false)} />}

      <div className="flex h-screen bg-surface-900 font-sans overflow-hidden">

        {/* ══ SIDEBAR ══ */}
        <aside className={`flex flex-col bg-surface-800 border-r border-surface-300/10 shrink-0 overflow-hidden transition-all duration-300
          ${view === 'map' ? 'w-0 border-none' : 'w-72'}`}
        >
          {view !== 'map' && (
            <>
              {/* Sidebar Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-surface-300/10">
                <button onClick={() => navigate('/home')} className="flex items-center gap-2 group">
                  <div className="w-7 h-7 rounded-lg overflow-hidden shadow-glow-sm">
                    <img src="/logo.png" alt="GoNext" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-display text-lg font-bold text-white">Go<span className="text-brand-400">Next</span></span>
                </button>
                <button onClick={logout} title="Sign out"
                  className="text-slate-600 hover:text-red-400 transition-colors text-sm"
                >⏻</button>
              </div>

              {/* User greeting + Calendar */}
              <div className="px-5 py-4 border-b border-surface-300/10">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs text-slate-600 mb-0.5">Exploring as</p>
                    <p className="text-sm font-semibold text-slate-300">👤 {user?.name}</p>
                  </div>
                  <button
                    onClick={() => setShowCalendar(true)}
                    className="w-9 h-9 rounded-xl bg-surface-600/50 border border-surface-300/20 hover:border-brand-500/40 hover:bg-brand-600/10 flex items-center justify-center transition-all text-lg"
                    title="My Events"
                  >
                    📅
                  </button>
                </div>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto scrollbar-custom px-4 py-4 flex flex-col gap-4">

                {/* Search/Favorites/Visited Toggle - only show in split mode */}
                {view === 'split' && (
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-1 p-1 bg-surface-600/30 rounded-xl">
                      <button
                        onClick={() => { setShowFavorites(false); setShowVisited(false); }}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                          !showFavorites && !showVisited ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        🔍 Search
                      </button>
                      <button
                        onClick={() => { setShowFavorites(true); setShowVisited(false); }}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                          showFavorites ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        ❤️ Saved
                      </button>
                    </div>
                    <button
                      onClick={() => { setShowVisited(true); setShowFavorites(false); }}
                      className={`w-full py-2 rounded-lg text-xs font-semibold transition-all ${
                        showVisited ? 'bg-brand-600 text-white' : 'bg-surface-600/30 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      ✅ Visited ({visited.length})
                    </button>
                  </div>
                )}

                {/* SEARCH VIEW */}
                {!showFavorites && !showVisited && (
                  <>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                      Choose your vibe
                    </p>

                    <div className="flex flex-col gap-1.5">
                      {[
                        { id: 'work', label: '💼 Work', categories: 'catering.cafe', sortBy: 'rating' },
                        { id: 'date', label: '🌹 Date Night', categories: 'catering.restaurant', sortBy: 'rating' },
                        { id: 'quickbite', label: '🍔 Quick Bite', categories: 'catering.fast_food,catering.food_court', sortBy: 'distance' },
                        { id: 'budget', label: '💸 Budget', categories: 'catering.restaurant,catering.cafe', sortBy: 'distance' },
                        { id: 'explore', label: '🗺️ Explore', categories: 'tourism.attraction,leisure.park', sortBy: 'rating' },
                      ].map(mood => (
                        <button
                          key={mood.id}
                          onClick={() => handleMoodSelect(mood)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left
                            ${selectedMood?.id === mood.id
                              ? 'bg-brand-600/20 border border-brand-500/40 text-white shadow-glow-sm'
                              : 'text-slate-400 border border-transparent hover:bg-surface-600/50 hover:text-slate-200'
                            }`}
                        >
                          <span className="text-base">{mood.label.split(' ')[0]}</span>
                          <span>{mood.label.split(' ').slice(1).join(' ')}</span>
                          {selectedMood?.id === mood.id && <span className="ml-auto text-brand-400">✓</span>}
                        </button>
                      ))}
                    </div>

                    {selectedMood && (
                      <div className="anim-slide-left">
                        <button
                          onClick={() => setShowFilters(v => !v)}
                          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-surface-600/40 border border-surface-300/10 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                        >
                          <span>⚙️ Filters</span>
                          <span>{showFilters ? '▲' : '▼'}</span>
                        </button>
                        {showFilters && (
                          <div className="mt-2 anim-fade-up">
                            <FilterBar filters={filters} onChange={setFilters} />
                          </div>
                        )}
                      </div>
                    )}

                    {geoLoading && <p className="text-xs text-slate-600 text-center py-2 animate-pulse">📡 Getting location...</p>}
                    {geoError && <p className="text-xs text-red-400 text-center py-2">❌ Location error</p>}
                    
                    {placesLoading && (
                      <div className="flex flex-col gap-2">
                        {[1,2,3].map(i => (
                          <div key={i} className="h-40 rounded-xl bg-surface-600/30 animate-pulse" style={{ animationDelay: `${i*0.1}s` }} />
                        ))}
                      </div>
                    )}

                    {/* Show place cards in split mode */}
                    {!placesLoading && filtered.length > 0 && view === 'split' && (
                      <div className="flex flex-col gap-2">
                        <p className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold">
                          {filtered.length} place{filtered.length !== 1 ? 's' : ''} found
                        </p>
                        {filtered.map((place, i) => (
                          <PlaceCard
                            key={place.id}
                            place={place}
                            index={i}
                            isHighlighted={selectedPlace?.id === place.id}
                            onClick={setSelectedPlace}
                            mood={selectedMood}
                          />
                        ))}
                      </div>
                    )}

                    {/* Better empty state with actionable suggestions */}
                    {!placesLoading && selectedMood && coords && filtered.length === 0 && (
                      <div className="text-center py-8 px-4 rounded-2xl bg-surface-600/20 border border-surface-300/10">
                        <div className="text-4xl mb-3">😕</div>
                        <p className="text-sm font-semibold text-slate-300 mb-2">No perfect match found</p>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                          Try expanding your distance or lowering rating filter.
                        </p>
                        <div className="flex flex-col gap-2">
                          {filters.maxDistance < 20000 && (
                            <button
                              onClick={() => setFilters(f => ({ ...f, maxDistance: Math.min(f.maxDistance + 5000, 20000) }))}
                              className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
                            >
                              📏 Expand distance to {Math.min(filters.maxDistance + 5000, 20000) / 1000}km
                            </button>
                          )}
                          {filters.minRating > 0 && (
                            <button
                              onClick={() => setFilters(f => ({ ...f, minRating: Math.max(f.minRating - 0.5, 0) }))}
                              className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
                            >
                              ⭐ Lower minimum rating to {Math.max(filters.minRating - 0.5, 0) || 'Any'}
                            </button>
                          )}
                          {filters.priceRange && filters.priceRange.length < 3 && (
                            <button
                              onClick={() => setFilters(f => ({ ...f, priceRange: [1, 2, 3] }))}
                              className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
                            >
                              💰 Include all price ranges
                            </button>
                          )}
                          <button
                            onClick={() => setFilters(DEFAULT_FILTERS)}
                            className="text-xs text-slate-500 hover:text-slate-300 font-medium transition-colors"
                          >
                            ↺ Reset all filters
                          </button>
                        </div>
                      </div>
                    )}

                    {!selectedMood && (
                      <div className="text-center py-10">
                        <div className="text-3xl mb-3">👆</div>
                        <p className="text-sm text-slate-500">Pick a vibe to start</p>
                      </div>
                    )}
                  </>
                )}

                {/* FAVORITES VIEW */}
                {showFavorites && view === 'split' && (
                  <div className="flex flex-col gap-2">
                    {favorites.length === 0 ? (
                      <div className="text-center py-10">
                        <div className="text-4xl mb-3">💔</div>
                        <p className="text-sm text-slate-500">No favorites yet</p>
                        <p className="text-xs text-slate-600 mt-1">Tap the heart icon on places you love</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold">
                          {favorites.length} saved place{favorites.length !== 1 ? 's' : ''}
                        </p>
                        {favorites.map((place, i) => (
                          <PlaceCard
                            key={place.id}
                            place={place}
                            index={i}
                            isHighlighted={selectedPlace?.id === place.id}
                            onClick={setSelectedPlace}
                            mood={place.mood}
                          />
                        ))}
                      </>
                    )}
                  </div>
                )}

                {/* VISITED VIEW */}
                {showVisited && view === 'split' && (
                  <div className="flex flex-col gap-2">
                    {visited.length === 0 ? (
                      <div className="text-center py-10">
                        <div className="text-4xl mb-3">📍</div>
                        <p className="text-sm text-slate-500">No visited places yet</p>
                        <p className="text-xs text-slate-600 mt-1">Mark places you've been to</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold">
                          {visited.length} visited place{visited.length !== 1 ? 's' : ''}
                        </p>
                        {visited.map((place, i) => (
                          <PlaceCard
                            key={place.id}
                            place={place}
                            index={i}
                            isHighlighted={selectedPlace?.id === place.id}
                            onClick={setSelectedPlace}
                            mood={place.mood}
                          />
                        ))}
                      </>
                    )}
                  </div>
                )}

              </div>

              {/* Back to home */}
              <div className="p-4 border-t border-surface-300/10">
                <button
                  onClick={() => navigate('/home')}
                  className="w-full py-2.5 rounded-xl text-xs text-slate-500 hover:text-slate-300 border border-surface-300/10 hover:border-surface-300/20 transition-colors font-medium"
                >
                  ← Back to Home
                </button>
              </div>
            </>
          )}
        </aside>

        {/* ══ MAIN AREA ══ */}
        <main className="flex-1 relative flex flex-col">
          {/* View Toggle Bar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400]">
            <ViewToggle view={view} onChange={setView} />
          </div>

          {/* Selected place card */}
          {selectedPlace && view !== 'list' && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] w-80 anim-fade-up">
              <div className="glass-dark rounded-2xl p-4 shadow-card border border-brand-500/20">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-white text-sm truncate">{selectedPlace.name}</h3>
                    <p className="text-xs text-slate-500 truncate">{selectedPlace.address}</p>
                  </div>
                  <button onClick={() => setSelectedPlace(null)} className="text-slate-600 hover:text-white ml-2 text-lg leading-none">×</button>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs bg-surface-400/50 text-slate-400 px-2 py-0.5 rounded-full">
                    📏 {formatDistance(selectedPlace.distance)}
                  </span>
                  {selectedPlace.isOpen !== null && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      selectedPlace.isOpen ? 'text-emerald-400 bg-emerald-900/30' : 'text-red-400 bg-red-900/30'
                    }`}>
                      {selectedPlace.isOpen ? '● Open' : '● Closed'}
                    </span>
                  )}
                </div>
                <StarRating rating={selectedPlace.rating} />
                <div className="flex gap-3 mt-3 pt-3 border-t border-surface-300/10">
                  {selectedPlace.website && (
                    <a href={selectedPlace.website} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-brand-400 hover:text-brand-300 font-medium">🌐 Website</a>
                  )}
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.lat},${selectedPlace.lon}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-xs text-sky-400 hover:text-sky-300 font-medium">🗺️ Directions</a>
                </div>
              </div>
            </div>
          )}

          {/* Map or List */}
          {view === 'list' ? (
            <div className="flex-1 overflow-y-auto scrollbar-custom p-6">
              <div className="max-w-6xl mx-auto">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-4">
                  {displayPlaces.length} place{displayPlaces.length !== 1 ? 's' : ''} found
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayPlaces.map((place, i) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      index={i}
                      isHighlighted={selectedPlace?.id === place.id}
                      onClick={setSelectedPlace}
                      mood={showFavorites || showVisited ? place.mood : selectedMood}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <MapView
              coords={coords}
              places={displayPlaces}
              highlightedId={selectedPlace?.id}
              onMarkerClick={(place) => setSelectedPlace(selectedPlace?.id === place.id ? null : place)}
            />
          )}
        </main>
      </div>
    </>
  );
}