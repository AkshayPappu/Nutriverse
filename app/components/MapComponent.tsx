'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet/dist/leaflet.css';

interface Supermarket {
  name: string;
  lat: number;
  lon: number;
  address: string;
  distance: number; // Distance from the user's location
}

interface MapComponentProps {
  setSupermarkets: (supermarkets: Supermarket[]) => void;
  supermarkets: Supermarket[];
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d; // Distance in km
};

const MapComponent: React.FC<MapComponentProps> = ({ setSupermarkets, supermarkets }) => {
  const [location, setLocation] = useState<{ lat: number, lon: number } | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const defaultCenter: [number, number] = [51.505, -0.09]; // Default center
  const [center, setCenter] = useState<[number, number]>(defaultCenter);

  const MapUpdater = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
  };

  useEffect(() => {
    if (location) {
      fetchSupermarkets(location.lat, location.lon);
      setCenter([location.lat, location.lon]);
    }
  }, [location]);

  const fetchSupermarkets = async (lat: number, lon: number) => {
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node[shop=supermarket](around:5000,${lat},${lon});out;`;
    const response = await fetch(overpassUrl);
    const data = await response.json();
    const fetchedSupermarkets = data.elements.map((element: any) => ({
      name: element.tags.name || 'Unnamed Supermarket',
      lat: element.lat,
      lon: element.lon,
      address: element.tags['addr:street'] || 'Address not available',
      distance: calculateDistance(lat, lon, element.lat, element.lon)
    }));
    setSupermarkets(fetchedSupermarkets);
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleLocationSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${userInput}&format=json&limit=1`;
    const response = await fetch(geocodeUrl);
    const data = await response.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      setLocation({ lat: parseFloat(lat), lon: parseFloat(lon) });
    }
  };

  return (
    <div>
      <div className="mb-4">
        <form onSubmit={handleLocationSubmit} className="flex flex-col space-y-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter a location"
            className="border rounded p-2 w-full bg-white text-black"
          />
          <div className="flex space-x-2">
            <button onClick={handleGeolocation} type="button" 
              className="bg-black hover:bg-gray-700 text-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Use My Location
            </button>
            <button
              type="submit"
              className="bg-gradient-to-tr from-green-300 to-green-200 hover:from-green-400 hover:to-green-300 text-green-800 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      <div className="w-full h-[200px]">
        <MapContainer center={center} zoom={13} style={{ width: '100%', height: '100%' }}>
          <MapUpdater center={center} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {supermarkets.map((supermarket, index) => (
            <Marker key={index} position={[supermarket.lat, supermarket.lon] as [number, number]}>
              <Popup>{supermarket.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;
