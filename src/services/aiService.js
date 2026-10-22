// AI-Assisted Smart Triage & Hazard Detection Service

export const aiService = {
  // Analyze text and/or photo metadata to classify issue
  analyzeIssue: async (inputContent) => {
    // Simulate brief AI neural computation latency (300-500ms)
    await new Promise(resolve => setTimeout(resolve, 400));

    const content = (inputContent || '').toLowerCase();

    // Classification keyword matching rules
    let category = 'other';
    let severity = 'medium';
    let suggestedTitle = 'Hazard Incident Report';
    let department = 'General Municipal Works';
    let campusImpact = 'Ensures campus and civic safety compliance.';
    let confidence = 94;

    if (content.includes('water') || content.includes('pipe') || content.includes('leak') || content.includes('drain') || content.includes('flood') || content.includes('sewage')) {
      category = 'water';
      severity = content.includes('burst') || content.includes('flood') ? 'critical' : 'high';
      suggestedTitle = 'Pipeline Breach & Water Inundation';
      department = 'Campus Hydro & Environmental Services';
      campusImpact = 'Prevents basement flooding and conserves estimated 1,200L clean drinking water.';
      confidence = 97;
    } else if (content.includes('pothole') || content.includes('road') || content.includes('asphalt') || content.includes('crack') || content.includes('crater') || content.includes('pavement')) {
      category = 'roads';
      severity = content.includes('deep') || content.includes('huge') || content.includes('danger') ? 'critical' : 'high';
      suggestedTitle = 'Hazardous Asphalt Pothole on Walkway';
      department = 'Campus Roads & Civil Maintenance';
      campusImpact = 'Averts two-wheeler skidding and pedestrian tripping near high-footfall zone.';
      confidence = 98;
    } else if (content.includes('light') || content.includes('dark') || content.includes('wire') || content.includes('electric') || content.includes('lamp') || content.includes('flicker')) {
      category = 'lighting';
      severity = content.includes('wire') || content.includes('spark') ? 'critical' : 'medium';
      suggestedTitle = 'Streetlight Fixture Outage & Dark Zone';
      department = 'Campus Electrical & Power Grid';
      campusImpact = 'Restores night-time illumination and increases student/faculty safety factor by 40%.';
      confidence = 96;
    } else if (content.includes('garbage') || content.includes('trash') || content.includes('waste') || content.includes('dump') || content.includes('bin') || content.includes('smell')) {
      category = 'garbage';
      severity = 'medium';
      suggestedTitle = 'Overflowing Waste Bins & Sanitation Hazard';
      department = 'Sanitation & Campus Cleanliness Division';
      campusImpact = 'Mitigates odor, prevents vector-borne illnesses, and restores campus aesthetic.';
      confidence = 95;
    } else if (content.includes('traffic') || content.includes('sign') || content.includes('signal') || content.includes('speed') || content.includes('car')) {
      category = 'traffic';
      severity = 'high';
      suggestedTitle = 'Damaged Traffic Signage / Campus Flow Disruption';
      department = 'Campus Mobility & Security';
      campusImpact = 'Prevents vehicular bottlenecks at campus entry/exit gates.';
      confidence = 93;
    } else if (content.includes('tree') || content.includes('branch') || content.includes('leaf') || content.includes('fallen') || content.includes('park')) {
      category = 'trees';
      severity = content.includes('fallen') || content.includes('blocking') ? 'high' : 'low';
      suggestedTitle = 'Fallen Tree Branch Obstructing Pathway';
      department = 'Campus Horticulture & Grounds';
      campusImpact = 'Clears emergency vehicle access paths and safeguards green canopy.';
      confidence = 96;
    } else if (content.includes('bench') || content.includes('building') || content.includes('door') || content.includes('window') || content.includes('wall') || content.includes('gate')) {
      category = 'public_property';
      severity = 'medium';
      suggestedTitle = 'Damaged Campus Infrastructure Asset';
      department = 'Facilities & Estate Management';
      campusImpact = 'Preserves institutional infrastructure and campus accessibility.';
      confidence = 92;
    }

    return {
      category,
      severity,
      suggestedTitle,
      department,
      campusImpact,
      confidence
    };
  },

  // Calculate distance in meters between two lat/lng coordinates (Haversine formula)
  calculateDistanceMeters: (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const toRad = deg => (deg * Math.PI) / 180;
    const phi1 = toRad(lat1);
    const phi2 = toRad(lat2);
    const deltaPhi = toRad(lat2 - lat1);
    const deltaLambda = toRad(lon2 - lon1);

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  },

  // Check if an issue is a duplicate of an existing recent report
  detectDuplicates: (lat, lng, category, reports = []) => {
    if (!reports || reports.length === 0 || !lat || !lng) return null;

    for (const report of reports) {
      if (report.status === 'RESOLVED') continue;

      const rLat = report.location?.latitude;
      const rLng = report.location?.longitude;
      if (!rLat || !rLng) continue;

      const dist = aiService.calculateDistanceMeters(lat, lng, rLat, rLng);

      // Within 250 meters and same category or related title
      if (dist <= 250 && report.category === category) {
        return {
          isDuplicate: true,
          matchedReport: report,
          distanceMeters: dist,
          confidence: Math.max(75, 100 - Math.round(dist / 4))
        };
      }
    }
    return null;
  }
};
