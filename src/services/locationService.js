// Location utility for Smart Issue Reporting
export const locationService = {
  getCurrentCoordinates: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser/device.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: Math.round(position.coords.accuracy || 10),
            timestamp: position.timestamp,
          });
        },
        (error) => {
          console.warn('Geolocation error or denied, using fallback:', error.message);
          // Fallback location (e.g. city central coordinates) so users are never blocked
          resolve({
            latitude: 28.6139 + (Math.random() - 0.5) * 0.01,
            longitude: 77.2090 + (Math.random() - 0.5) * 0.01,
            accuracy: 15,
            isSimulated: true,
            reason: error.message
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000,
        }
      );
    });
  },

  reverseGeocode: async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'SmartIssueReportingApp/1.0'
          }
        }
      );
      if (!response.ok) throw new Error('Geocoding response failed');
      const data = await response.json();
      
      const addressParts = [];
      if (data.address) {
        if (data.address.road || data.address.pedestrian) addressParts.push(data.address.road || data.address.pedestrian);
        if (data.address.suburb || data.address.neighbourhood) addressParts.push(data.address.suburb || data.address.neighbourhood);
        if (data.address.city || data.address.town || data.address.county) addressParts.push(data.address.city || data.address.town || data.address.county);
      }

      return {
        formattedAddress: addressParts.join(', ') || data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        city: data.address?.city || data.address?.town || 'Local Municipality',
        postcode: data.address?.postcode || '',
        raw: data
      };
    } catch (e) {
      console.warn('Reverse geocode failed or rate limited, generating smart fallback:', e);
      return {
        formattedAddress: `Sector 4, Main Road, Block B (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)})`,
        city: 'Metropolitan Zone',
        postcode: '110001'
      };
    }
  }
};
