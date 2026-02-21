import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const highlightIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

function FlyTo({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo([coords.lat, coords.lon], 15, { duration: 1.5 });
  }, [coords, map]);
  return null;
}

export default function MapView({ coords, places, highlightedId, onMarkerClick }) {
  if (!coords) {
    return (
      <div className="h-full bg-surface-800 flex flex-col items-center justify-center gap-3 text-center px-6">
        <div className="w-14 h-14 rounded-2xl bg-surface-600 border border-surface-400/40 flex items-center justify-center text-2xl animate-pulse-slow">
          📡
        </div>
        <p className="text-slate-400 font-medium">Waiting for location access</p>
        <p className="text-slate-600 text-sm">Please allow location permissions in your browser</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[coords.lat, coords.lon]}
      zoom={15}
      style={{ height: '100%', width: '100%' }}
    >
      {/* ✅ Light map tile */}
      <TileLayer
        url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${API_KEY}`}
        attribution='© <a href="https://www.geoapify.com/">Geoapify</a> © <a href="https://www.openstreetmap.org/copyright">OSM</a>'
      />

      <FlyTo coords={coords} />

      {/* ✅ Current location — glowing blue dot */}
      <CircleMarker
        center={[coords.lat, coords.lon]}
        radius={10}
        pathOptions={{
          color: '#7c3aed',
          fillColor: '#8b5cf6',
          fillOpacity: 0.9,
          weight: 3,
        }}
      >
        <Popup>
          <strong>📍 You are here</strong>
        </Popup>
      </CircleMarker>

      {/* Outer pulse ring */}
      <CircleMarker
        center={[coords.lat, coords.lon]}
        radius={20}
        pathOptions={{
          color: '#8b5cf6',
          fillColor: '#8b5cf6',
          fillOpacity: 0.15,
          weight: 1.5,
        }}
        interactive={false}
      />

      {/* Place markers */}
      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lon]}
          icon={place.id === highlightedId ? highlightIcon : new L.Icon.Default()}
          eventHandlers={{ click: () => onMarkerClick(place) }}
        >
          <Popup>
            <strong>{place.name}</strong><br />
            <small>{place.address}</small>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}