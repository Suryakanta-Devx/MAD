import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Layers, Compass } from 'lucide-react';

export default function LocationPickerMap({ 
  latitude, 
  longitude, 
  onLocationChange,
  isDetecting
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [mapType, setMapType] = useState('streets'); // 'streets' | 'satellite'

  // Initialize or update Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const lat = latitude || 28.6139;
    const lng = longitude || 77.2090;

    if (!mapInstanceRef.current) {
      // Create map
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: false,
        attributionControl: false
      });

      // Tile layer
      const tileUrl = mapType === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tiles = L.tileLayer(tileUrl, {
        maxZoom: 19
      }).addTo(map);

      // Custom pulse Pin marker
      const pinIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; width: 36px; height: 36px; background: rgba(37, 99, 235, 0.25); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 32px; height: 32px; background: #2563EB; border: 3px solid #ffffff; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
              <div style="width: 8px; height: 8px; background: #ffffff; border-radius: 50%; transform: rotate(45deg);"></div>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 36],
      });

      const marker = L.marker([lat, lng], {
        draggable: true,
        icon: pinIcon
      }).addTo(map);

      // On pin drag
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        onLocationChange({
          latitude: position.lat,
          longitude: position.lng,
          source: 'Map Pin Drag'
        });
      });

      // On map click
      map.on('click', (e) => {
        marker.setLatLng(e.latlng);
        onLocationChange({
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
          source: 'Map Click'
        });
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
      mapInstanceRef.current._tileLayer = tiles;

      // Force resize calculation after mount
      setTimeout(() => {
        map.invalidateSize();
      }, 200);

    } else {
      // Update existing map and marker
      const map = mapInstanceRef.current;
      const marker = markerRef.current;
      if (marker && (marker.getLatLng().lat !== lat || marker.getLatLng().lng !== lng)) {
        marker.setLatLng([lat, lng]);
        map.setView([lat, lng], map.getZoom(), { animate: true });
      }
    }
  }, [latitude, longitude, onLocationChange]);

  // Handle Map Type toggle
  const toggleMapLayer = () => {
    if (!mapInstanceRef.current) return;
    const newType = mapType === 'streets' ? 'satellite' : 'streets';
    setMapType(newType);

    const newUrl = newType === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    if (mapInstanceRef.current._tileLayer) {
      mapInstanceRef.current.removeLayer(mapInstanceRef.current._tileLayer);
    }
    const newLayer = L.tileLayer(newUrl, { maxZoom: 19 }).addTo(mapInstanceRef.current);
    mapInstanceRef.current._tileLayer = newLayer;
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current && latitude && longitude) {
      mapInstanceRef.current.setView([latitude, longitude], 16, { animate: true });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '210px', borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating Map Controls */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 400, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button
          type="button"
          onClick={toggleMapLayer}
          title="Toggle Satellite / Street View"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            borderRadius: '8px',
            padding: '7px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1E293B',
            transition: 'all 0.2s ease'
          }}
        >
          <Layers size={17} />
        </button>

        <button
          type="button"
          onClick={handleRecenter}
          title="Center on Pin"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            borderRadius: '8px',
            padding: '7px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563EB',
            transition: 'all 0.2s ease'
          }}
        >
          <Navigation size={17} />
        </button>
      </div>

      {/* Pin Guidance Banner */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        left: '10px',
        zIndex: 400,
        background: 'rgba(15, 23, 42, 0.78)',
        backdropFilter: 'blur(6px)',
        color: '#ffffff',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        pointerEvents: 'none'
      }}>
        <MapPin size={12} color="#60A5FA" />
        <span>Tap map or drag pin to adjust exact location</span>
      </div>

      {isDetecting && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(2px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          zIndex: 410,
          fontSize: '13px',
          color: '#1E40AF',
          fontWeight: 600
        }}>
          <Compass className="spin-animation" size={20} />
          Locking GPS Coordinates...
        </div>
      )}
    </div>
  );
}
