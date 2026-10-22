import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ISSUE_CATEGORIES, STATUS_TYPES } from '../constants/categories';
import { Layers, Navigation, Info } from 'lucide-react';

export default function CityIssuesMap({ reports, onSelectReport }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const [mapType, setMapType] = useState('streets');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');

  const renderMarkers = useCallback(() => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return;

    markersLayerRef.current.clearLayers();

    const filtered = activeCategoryFilter === 'ALL'
      ? reports
      : reports.filter(r => r.category === activeCategoryFilter);

    filtered.forEach((report) => {
      const lat = report.location?.latitude;
      const lng = report.location?.longitude;
      if (!lat || !lng) return;

      const cat = ISSUE_CATEGORIES.find(c => c.id === report.category) || { color: '#2563EB', name: 'Issue' };
      const status = STATUS_TYPES[report.status] || { label: report.status, color: '#64748B' };

      const pinIcon = L.divIcon({
        className: 'city-issue-pin',
        html: `
          <div style="position: relative; width: 34px; height: 34px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 30px; height: 30px; background: ${cat.color}35; border-radius: 50%;"></div>
            <div style="width: 26px; height: 26px; background: ${cat.color}; border: 2.5px solid #ffffff; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.35);">
              <div style="width: 6px; height: 6px; background: #ffffff; border-radius: 50%;"></div>
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 30]
      });

      const marker = L.marker([lat, lng], { icon: pinIcon });

      const popupDiv = document.createElement('div');
      popupDiv.style.fontFamily = 'inherit';
      popupDiv.style.width = '200px';
      popupDiv.style.padding = '4px';

      popupDiv.innerHTML = `
        <div style="font-size: 10px; font-weight: 800; color: ${cat.color}; text-transform: uppercase;">
          ${cat.name}
        </div>
        <div style="font-size: 12px; font-weight: 700; color: #0F172A; margin: 2px 0 4px;">
          ${report.title}
        </div>
        <div style="font-size: 11px; color: #64748B; margin-bottom: 6px;">
          ${report.location?.address || ''}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 10px; font-weight: 700; background: ${status.color}20; color: ${status.color}; padding: 2px 6px; border-radius: 4px;">
            ${status.label}
          </span>
          <button id="view-report-${report.id}" style="background: #2563EB; color: #FFFFFF; border: none; border-radius: 6px; font-size: 10px; font-weight: 700; padding: 3px 8px; cursor: pointer;">
            View Details
          </button>
        </div>
      `;

      marker.bindPopup(popupDiv);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-report-${report.id}`);
        if (btn && onSelectReport) {
          btn.onclick = () => onSelectReport(report);
        }
      });

      markersLayerRef.current.addLayer(marker);
    });
  }, [activeCategoryFilter, reports, onSelectReport]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const defaultLat = reports[0]?.location?.latitude || 28.6139;
      const defaultLng = reports[0]?.location?.longitude || 77.2090;

      const map = L.map(mapContainerRef.current, {
        center: [defaultLat, defaultLng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      const tileUrl = mapType === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tiles = L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);
      mapInstanceRef.current = map;
      mapInstanceRef.current._tileLayer = tiles;

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;

      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }

    renderMarkers();
  }, [reports, activeCategoryFilter, mapType, renderMarkers]);

  const toggleLayer = () => {
    if (!mapInstanceRef.current) return;
    const next = mapType === 'streets' ? 'satellite' : 'streets';
    setMapType(next);

    const tileUrl = next === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    if (mapInstanceRef.current._tileLayer) {
      mapInstanceRef.current.removeLayer(mapInstanceRef.current._tileLayer);
    }
    const newTiles = L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(mapInstanceRef.current);
    mapInstanceRef.current._tileLayer = newTiles;
  };

  const handleFitBounds = () => {
    if (!mapInstanceRef.current || reports.length === 0) return;
    const points = reports
      .filter(r => r.location?.latitude && r.location?.longitude)
      .map(r => [r.location.latitude, r.location.longitude]);
    
    if (points.length > 0) {
      mapInstanceRef.current.fitBounds(points, { padding: [40, 40] });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100% - 10px)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Category filter strip */}
      <div style={{
        padding: '10px 14px',
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        zIndex: 20
      }}>
        <button
          type="button"
          onClick={() => setActiveCategoryFilter('ALL')}
          style={{
            padding: '4px 10px',
            borderRadius: '16px',
            border: activeCategoryFilter === 'ALL' ? '1px solid #2563EB' : '1px solid #E2E8F0',
            background: activeCategoryFilter === 'ALL' ? '#2563EB' : '#FFFFFF',
            color: activeCategoryFilter === 'ALL' ? '#FFFFFF' : '#64748B',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          All Categories ({reports.length})
        </button>

        {ISSUE_CATEGORIES.map(cat => {
          const count = reports.filter(r => r.category === cat.id).length;
          const isActive = activeCategoryFilter === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategoryFilter(cat.id)}
              style={{
                padding: '4px 10px',
                borderRadius: '16px',
                border: isActive ? `1.5px solid ${cat.color}` : '1px solid #E2E8F0',
                background: isActive ? cat.bgColor : '#FFFFFF',
                color: isActive ? cat.color : '#64748B',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Map container */}
      <div style={{ position: 'relative', flex: 1, minHeight: '360px' }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* Map Floating Controls */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 400, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            type="button"
            onClick={toggleLayer}
            title="Toggle Satellite / Streets"
            style={{
              background: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              color: '#1E293B'
            }}
          >
            <Layers size={17} />
          </button>

          <button
            type="button"
            onClick={handleFitBounds}
            title="Fit All Pinned Issues"
            style={{
              background: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              color: '#2563EB'
            }}
          >
            <Navigation size={17} />
          </button>
        </div>

        {/* Map Legend Banner */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          zIndex: 400,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(6px)',
          color: '#FFFFFF',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '11px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Info size={13} color="#60A5FA" />
          <span>Tap pins to view ticket preview & status</span>
        </div>
      </div>
    </div>
  );
}
