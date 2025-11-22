export interface FloodReport {
  id: string;
  location: string;
  severity: 'High' | 'Moderate' | 'Low';
  category: 'Flooding' | 'Waterlogging' | 'Drainage' | 'Road Blocked';
  description: string;
  reporter: string;
  confidence: number;
  timestamp: string;
  verified: boolean;
  imageUrl?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Alert {
  id: string;
  location: string;
  severity: 'High' | 'Moderate' | 'Low';
  type: 'Flood' | 'Rainfall' | 'Weather' | 'Evacuation';
  message: string;
  timestamp: string;
  icon: string;
}

export const sampleFloodReports: FloodReport[] = [
  {
    id: '1',
    location: 'Banjara Hills',
    severity: 'Moderate',
    category: 'Flooding',
    description:
      'Water accumulation near Banjara Hills metro station. Road partially blocked.',
    reporter: 'Raj Kumar',
    confidence: 85,
    timestamp: '2h ago',
    verified: true,
    imageUrl: '/api/placeholder/300/200',
    coordinates: {
      lat: 17.4065,
      lng: 78.4772,
    },
  },
  {
    id: '2',
    location: 'Kukatpally',
    severity: 'High',
    category: 'Flooding',
    description:
      'Severe flooding in residential areas. Water level rising rapidly.',
    reporter: 'Priya Sharma',
    confidence: 92,
    timestamp: '1h ago',
    verified: true,
    imageUrl: '/api/placeholder/300/200',
    coordinates: {
      lat: 17.4849,
      lng: 78.4138,
    },
  },
  {
    id: '3',
    location: 'Madhapur',
    severity: 'Low',
    category: 'Waterlogging',
    description: 'Minor waterlogging on main road near IT companies.',
    reporter: 'Anonymous',
    confidence: 78,
    timestamp: '3h ago',
    verified: false,
    coordinates: {
      lat: 17.4482,
      lng: 78.3908,
    },
  },
];

export const sampleAlerts: Alert[] = [
  {
    id: '1',
    location: 'Kukatpally',
    severity: 'High',
    type: 'Flood',
    message: 'Flash flood warning - immediate evacuation recommended',
    timestamp: '2 min ago',
    icon: 'warning',
  },
  {
    id: '2',
    location: 'Banjara Hills',
    severity: 'Moderate',
    type: 'Rainfall',
    message: 'Heavy rainfall causing waterlogging on main roads',
    timestamp: '15 min ago',
    icon: 'warning',
  },
  {
    id: '3',
    location: 'Madhapur',
    severity: 'Low',
    type: 'Flood',
    message: 'Minor flooding reported in low-lying areas',
    timestamp: '32 min ago',
    icon: 'warning',
  },
  {
    id: '4',
    location: 'Jubilee Hills',
    severity: 'Moderate',
    type: 'Flood',
    message: 'River discharge levels approaching threshold',
    timestamp: '45 min ago',
    icon: 'warning',
  },
  {
    id: '5',
    location: 'Secunderabad',
    severity: 'High',
    type: 'Evacuation',
    message: 'Emergency evacuation order issued for low-lying areas',
    timestamp: '1h ago',
    icon: 'warning',
  },
  {
    id: '6',
    location: 'Hyderabad Central',
    severity: 'Moderate',
    type: 'Weather',
    message: 'Heavy rainfall expected to continue for next 2 hours',
    timestamp: '1h 15min ago',
    icon: 'warning',
  },
  {
    id: '7',
    location: 'Gachibowli',
    severity: 'Low',
    type: 'Rainfall',
    message: 'Light to moderate rainfall in the area',
    timestamp: '1h 30min ago',
    icon: 'warning',
  },
  {
    id: '8',
    location: 'HITEC City',
    severity: 'Moderate',
    type: 'Flood',
    message: 'Water accumulation near tech parks causing traffic delays',
    timestamp: '2h ago',
    icon: 'warning',
  },
];

export const currentStatus = {
  alertLevel: 'Orange',
  description:
    'Moderate rainfall, risk of localized flooding in low-lying wards.',
  activeAlerts: 8,
};
