// Mock seed data for Smart Issue Reporter
export const INITIAL_REPORTS = [
  {
    id: 'SIR-2026-4821',
    title: 'Severe Pothole on Main Boulevard',
    category: 'roads',
    severity: 'critical',
    description: 'Deep pothole roughly 2 feet wide right next to the pedestrian crossing. Several two-wheelers have nearly lost balance. Dangerous at night.',
    location: {
      address: 'Near City Central Mall, Grand Trunk Road',
      landmark: 'Opposite Metro Pillar #42',
      latitude: 28.6139,
      longitude: 77.2090,
      accuracy: 8,
      source: 'GPS'
    },
    evidence: {
      hasPhoto: true,
      imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
      timestamp: '2026-09-25T14:32:00.000Z',
      notes: 'Captured via mobile camera near zebra crossing'
    },
    status: 'IN_PROGRESS',
    reporter: {
      name: 'Aarav Sharma',
      contact: '+91 98765 43210',
      isAnonymous: false
    },
    createdAt: '2026-09-25T14:35:00.000Z',
    timeline: [
      { status: 'SUBMITTED', time: '2026-09-25 14:35', note: 'Issue logged with GPS coordinates and evidence.' },
      { status: 'UNDER_REVIEW', time: '2026-09-25 16:10', note: 'Municipal Highway Works Division reviewed the hazard level.' },
      { status: 'IN_PROGRESS', time: '2026-09-26 09:30', note: 'Maintenance crew dispatched with cold-mix asphalt patch team.' }
    ]
  },
  {
    id: 'SIR-2026-3914',
    title: 'Continuous Water Pipeline Burst',
    category: 'water',
    severity: 'high',
    description: 'Clean drinking water pipe leaking continuously for 18 hours. Water is accumulating on sidewalk and flooding adjacent basement.',
    location: {
      address: 'Lane 4, Green Valley Residential Colony',
      landmark: 'Behind Community Center',
      latitude: 28.6180,
      longitude: 77.2150,
      accuracy: 12,
      source: 'GPS'
    },
    evidence: {
      hasPhoto: true,
      imageUrl: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=600&q=80',
      timestamp: '2026-09-24T18:15:00.000Z',
      notes: 'Water pressure is strong, valve shutoff needed'
    },
    status: 'UNDER_REVIEW',
    reporter: {
      name: 'Priya Verma',
      contact: 'priya.v@example.com',
      isAnonymous: false
    },
    createdAt: '2026-09-24T18:20:00.000Z',
    timeline: [
      { status: 'SUBMITTED', time: '2026-09-24 18:20', note: 'Issue submitted via Smart Issue Reporting App.' },
      { status: 'UNDER_REVIEW', time: '2026-09-25 08:45', note: 'Forwarded to City Water Supply & Sewerage Board (Division 3).' }
    ]
  },
  {
    id: 'SIR-2026-2105',
    title: 'Faulty Streetlights Creating Dark Zone',
    category: 'lighting',
    severity: 'medium',
    description: 'Four consecutive LED streetlights along the park perimeter path have been flickering and completely off after 8 PM.',
    location: {
      address: 'Ring Road Walkway, Sector 9',
      landmark: 'Near North Gate of Sector Park',
      latitude: 28.6250,
      longitude: 77.2020,
      accuracy: 6,
      source: 'Manual Pin'
    },
    evidence: {
      hasPhoto: true,
      imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
      timestamp: '2026-09-22T20:45:00.000Z',
      notes: 'Safety concern for late evening commuters'
    },
    status: 'RESOLVED',
    reporter: {
      name: 'Anonymous Citizen',
      contact: '',
      isAnonymous: true
    },
    createdAt: '2026-09-22T20:50:00.000Z',
    timeline: [
      { status: 'SUBMITTED', time: '2026-09-22 20:50', note: 'Citizen reported outage.' },
      { status: 'UNDER_REVIEW', time: '2026-09-23 09:15', note: 'Electrical maintenance ticket generated (#EL-882).' },
      { status: 'IN_PROGRESS', time: '2026-09-23 14:00', note: 'Technician team replaced faulty circuit fuses and 2 drivers.' },
      { status: 'RESOLVED', time: '2026-09-23 18:30', note: 'All 4 lights tested and operational.' }
    ]
  }
];

// Sample images that users can click to quickly attach demo evidence
export const SAMPLE_EVIDENCE_PRESETS = [
  {
    name: 'Road Pothole',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    description: 'Asphalt crater with exposed gravel'
  },
  {
    name: 'Water Leak',
    url: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=600&q=80',
    description: 'Sidewalk pipe flooding'
  },
  {
    name: 'Garbage Dump',
    url: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80',
    description: 'Overflowing public bins'
  },
  {
    name: 'Broken Streetlight',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    description: 'Dark alleyway light fixture damaged'
  }
];
