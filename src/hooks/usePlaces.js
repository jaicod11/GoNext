// Fetches nearby places from Geoapify API and caches results.
import { useState, useEffect, useRef } from 'react';
import { haversineDistance } from '../utils/distanceCalc';

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

export function usePlaces(mood, coords, radius = 3000) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cacheRef = useRef({});

  useEffect(() => {
    if (!mood || !coords) return;

    const cacheKey = `${mood.id}-${coords.lat.toFixed(4)}-${coords.lon.toFixed(4)}-${radius}`;

    // Return cached result if available (avoids repeat API calls)
    if (cacheRef.current[cacheKey]) {
      setPlaces(cacheRef.current[cacheKey]);
      return;
    }

    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = [
          `https://api.geoapify.com/v2/places`,
          `?categories=${mood.categories}`,
          `&filter=circle:${coords.lon},${coords.lat},${radius}`,
          `&limit=20`,
          `&apiKey=${API_KEY}`,
        ].join('');

        const res = await fetch(url);

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = await res.json();

        const mapped = data.features.map((feature) => {
          const props = feature.properties;
          const [lon, lat] = feature.geometry.coordinates;

          return {
            id: props.place_id || `${lat}-${lon}-${Math.random()}`,
            name: props.name || 'Unnamed Place',
            category: props.categories?.[0]?.replace('.', ' › ') || mood.label,
            lat,
            lon,
            distance: haversineDistance(coords.lat, coords.lon, lat, lon),
            rating: props.datasource?.raw?.['stars'] || props.datasource?.raw?.['rating'] || null,
            isOpen: props.opening_hours ? true : null,
            address: props.formatted || props.address_line1 || 'Address not available',
            phone: props.datasource?.raw?.phone || props.contact?.phone || null,
            website: props.website || props.datasource?.raw?.website || null,
          };
        });

        cacheRef.current[cacheKey] = mapped;
        setPlaces(mapped);
      } catch (err) {
        setError('Could not fetch places. Check your API key or connection.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [mood, coords, radius]);

  return { places, loading, error };
}