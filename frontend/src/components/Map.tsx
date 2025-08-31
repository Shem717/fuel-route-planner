import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { Station } from '../types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default icon paths for leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  stations: Station[];
}

const Map: React.FC<MapProps> = ({ stations }) => {
  if (stations.length === 0) return null;
  const center = { lat: stations[0].lat, lng: stations[0].lon };
  return (
    <MapContainer center={center} zoom={6} className="map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stations.map((s) => (
        <Marker key={`${s.lat}-${s.lon}`} position={{ lat: s.lat, lng: s.lon }}>
          <Popup>
            <div>
              <b>{s.name}</b>
              <div>{s.addr}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
