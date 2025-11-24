import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Layers as LayersIcon,
  SatelliteAlt as SatelliteIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Close as CloseIcon,
  MyLocation as MyLocationIcon,
  Assessment as AssessmentIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Style, Circle, Fill, Stroke, Icon } from 'ol/style';
import { Pointer } from 'ol/interaction';
import GeoJSON from 'ol/format/GeoJSON';
import 'ol/ol.css';
import LegendPopup from './LegendPopup';

interface LayerState {
  floodRisk: boolean;
  weatherStations: boolean;
  reportsHeatmap: boolean;
}

interface MapAreaProps {
  layers: LayerState;
  setLayers: React.Dispatch<React.SetStateAction<LayerState>>;
  onReportsClick: () => void;
  onNavigationReady?: (navigateFn: (lat: number, lng: number) => void) => void;
}

const MapArea: React.FC<MapAreaProps> = ({
  layers,
  setLayers,
  onReportsClick,
  onNavigationReady,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const reportsHeatmapSourceRef = useRef<VectorSource | null>(null);
  const weatherStationSourceRef = useRef<VectorSource | null>(null);
  const floodRiskLayerRef = useRef<VectorLayer | null>(null);
  const weatherStationLayerRef = useRef<VectorLayer | null>(null);
  const reportsHeatmapLayerRef = useRef<VectorLayer | null>(null);
  const [layersMenuAnchor, setLayersMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [clickPopup, setClickPopup] = useState<{
    lat: number;
    lng: number;
    visible: boolean;
    x: number;
    y: number;
  } | null>(null);
  const [currentZoom, setCurrentZoom] = useState(12);
  const [showGeocodeSearch, setShowGeocodeSearch] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Create sample data for layers
  const createFloodRiskFeatures = (): Feature[] => {
    const features: Feature[] = [];
    const center = fromLonLat([78.4772, 17.4065]);

    // Create sample flood risk points
    const riskPoints = [
      { coord: [center[0] - 0.01, center[1] - 0.01], risk: 'high' },
      { coord: [center[0] + 0.01, center[1] - 0.01], risk: 'moderate' },
      { coord: [center[0] - 0.01, center[1] + 0.01], risk: 'low' },
      { coord: [center[0] + 0.01, center[1] + 0.01], risk: 'high' },
    ];

    riskPoints.forEach((point) => {
      const feature = new Feature({
        geometry: new Point(point.coord),
        risk: point.risk,
      });

      const color =
        point.risk === 'high'
          ? '#d32f2f'
          : point.risk === 'moderate'
            ? '#ff9800'
            : '#ffeb3b';

      feature.setStyle(
        new Style({
          image: new Circle({
            radius: 8,
            fill: new Fill({ color }),
            stroke: new Stroke({ color: '#fff', width: 2 }),
          }),
        })
      );

      features.push(feature);
    });

    return features;
  };

  // Generate weather station icon SVG data URL
  const createWeatherStationIcon = (): string => {
    const svg = `<svg id="Weather-Station--Streamline-Carbon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="16" width="16"><desc>Weather Station Streamline Icon: https://streamlinehq.com</desc><defs></defs><path d="M8.5 14V8.5h0.5a1.00115 1.00115 0 0 0 1 -1v-2a1.00115 1.00115 0 0 0 -1 -1h-2a1.00115 1.00115 0 0 0 -1 1v2a1.00115 1.00115 0 0 0 1 1h0.5v5.5H1v1h14v-1Zm-1.5 -8.5h2l0.00075 2H7Z" fill="#1976d2" stroke-width="0.5"></path><path d="M4.66625 9.1084a3.50035 3.50035 0 0 1 0 -5.21705l0.667 0.745a2.5 2.5 0 0 0 0 3.72685Z" fill="#1976d2" stroke-width="0.5"></path><path d="m11.3335 9.1084 -0.667 -0.745a2.49975 2.49975 0 0 0 0 -3.72685l0.667 -0.745a3.5 3.5 0 0 1 0 5.21705Z" fill="#1976d2" stroke-width="0.5"></path><path d="M3.1997 10.9004a5.50095 5.50095 0 0 1 0 -8.8003L3.8 2.9a4.50045 4.50045 0 0 0 0 7.2007Z" fill="#1976d2" stroke-width="0.5"></path><path d="m12.8003 10.9004 -0.6006 -0.8a4.5005 4.5005 0 0 0 0 -7.20095l0.6006 -0.8a5.501 5.501 0 0 1 0 8.80055Z" fill="#1976d2" stroke-width="0.5"></path><path id="_Transparent_Rectangle_" d="M0 0h16v16H0Z" fill="none" stroke-width="0.5"></path></svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  // Fetch and load weather stations GeoJSON
  const loadWeatherStationsData = useCallback(async () => {
    if (!weatherStationSourceRef.current) return;

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/rain-gauge`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather stations data');
      }

      const geoJsonData = await response.json();
      const geoJsonFormat = new GeoJSON();
      const features = geoJsonFormat.readFeatures(geoJsonData, {
        featureProjection: 'EPSG:3857',
      });

      // Style features with weather station icon
      const iconUrl = createWeatherStationIcon();
      features.forEach((feature) => {
        feature.setStyle(
          new Style({
            image: new Icon({
              src: iconUrl,
              scale: 1.5,
              anchor: [0.5, 0.5],
            }),
          })
        );
      });

      weatherStationSourceRef.current.clear();
      weatherStationSourceRef.current.addFeatures(features);
    } catch (error) {
      console.error('Error loading weather stations data:', error);
    }
  }, []);

  // Get color based on severity
  const getSeverityColor = (severity: string): string => {
    const severityLower = severity.toLowerCase();
    switch (severityLower) {
      case 'high':
        return '#d32f2f';
      case 'moderate':
        return '#ff9800';
      case 'low':
        return '#ffeb3b';
      default:
        return '#9c27b0';
    }
  };

  // Generate SVG alert icon data URL
  const createAlertIcon = (color: string): string => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${color}"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  // Navigate to a location on the map
  const navigateToLocation = useCallback((lat: number, lng: number) => {
    if (mapInstanceRef.current) {
      const view = mapInstanceRef.current.getView();
      view.animate({
        center: fromLonLat([lng, lat]),
        zoom: 15,
        duration: 1000,
      });
    }
  }, []);

  // Expose navigation function to parent component
  useEffect(() => {
    if (onNavigationReady) {
      onNavigationReady(navigateToLocation);
    }
  }, [onNavigationReady, navigateToLocation]);

  // Fetch and load reports heatmap GeoJSON
  const loadReportsHeatmapData = useCallback(async () => {
    if (!reportsHeatmapSourceRef.current) return;

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(
        `${apiUrl}/api/reported-floods-geojsonlayer`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch reports heatmap data');
      }

      const geoJsonData = await response.json();
      const geoJsonFormat = new GeoJSON();
      const features = geoJsonFormat.readFeatures(geoJsonData, {
        featureProjection: 'EPSG:3857',
      });

      // Style features based on severity with alert icons
      features.forEach((feature) => {
        const severity = feature.get('severity') || 'low';
        const color = getSeverityColor(severity);
        const iconUrl = createAlertIcon(color);

        feature.setStyle(
          new Style({
            image: new Icon({
              src: iconUrl,
              scale: 1.2,
              anchor: [0.5, 1],
            }),
          })
        );
      });

      reportsHeatmapSourceRef.current.clear();
      reportsHeatmapSourceRef.current.addFeatures(features);
    } catch (error) {
      console.error('Error loading reports heatmap data:', error);
    }
  }, []);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Create layer sources
      const floodRiskSource = new VectorSource({
        features: createFloodRiskFeatures(),
      });

      const weatherStationSource = new VectorSource();
      weatherStationSourceRef.current = weatherStationSource;

      const reportsHeatmapSource = new VectorSource();
      reportsHeatmapSourceRef.current = reportsHeatmapSource;

      // Create layers
      const baseLayer = new TileLayer({
        source: new OSM(),
      });

      const floodRiskLayer = new VectorLayer({
        source: floodRiskSource,
        visible: layers.floodRisk,
      });
      floodRiskLayerRef.current = floodRiskLayer;

      const weatherStationLayer = new VectorLayer({
        source: weatherStationSource,
        visible: layers.weatherStations,
      });
      weatherStationLayerRef.current = weatherStationLayer;

      const reportsHeatmapLayer = new VectorLayer({
        source: reportsHeatmapSource,
        visible: layers.reportsHeatmap,
      });
      reportsHeatmapLayerRef.current = reportsHeatmapLayer;

      // Initialize OpenLayers map
      const map = new Map({
        target: mapRef.current,
        layers: [
          baseLayer,
          floodRiskLayer,
          weatherStationLayer,
          reportsHeatmapLayer,
        ],
        view: new View({
          center: fromLonLat([78.4772, 17.4065]), // Hyderabad coordinates
          zoom: 12,
        }),
      });

      // Add click interaction
      const clickInteraction = new Pointer({
        handleEvent: (event: any) => {
          // Only show popup on click, not hover
          if (event.type === 'click') {
            const coordinate = event.coordinate;
            const [lng, lat] = toLonLat(coordinate);
            const pixel = event.pixel;

            setClickPopup({
              lat: parseFloat(lat.toFixed(6)),
              lng: parseFloat(lng.toFixed(6)),
              visible: true,
              x: pixel[0],
              y: pixel[1],
            });
          }
          return true;
        },
      });

      map.addInteraction(clickInteraction);

      // Update zoom level on view change
      map.getView().on('change:resolution', () => {
        setCurrentZoom(Math.round(map.getView().getZoom() || 12));
      });

      mapInstanceRef.current = map;

      // Load reports heatmap data if layer is enabled
      if (layers.reportsHeatmap) {
        loadReportsHeatmapData();
      }

      // Weather stations data will be loaded by the useEffect below

      // Cleanup function
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setTarget(undefined);
          mapInstanceRef.current = null;
        }
        reportsHeatmapSourceRef.current = null;
        weatherStationSourceRef.current = null;
        floodRiskLayerRef.current = null;
        weatherStationLayerRef.current = null;
        reportsHeatmapLayerRef.current = null;
      };
    }
  }, [loadReportsHeatmapData, loadWeatherStationsData]);

  // Update layer visibility when layers state changes
  useEffect(() => {
    if (floodRiskLayerRef.current) {
      floodRiskLayerRef.current.setVisible(layers.floodRisk);
    }
    if (weatherStationLayerRef.current) {
      weatherStationLayerRef.current.setVisible(layers.weatherStations);
    }
    if (reportsHeatmapLayerRef.current) {
      reportsHeatmapLayerRef.current.setVisible(layers.reportsHeatmap);
    }
  }, [layers.floodRisk, layers.weatherStations, layers.reportsHeatmap]);

  // Load reports heatmap data when layer is enabled
  useEffect(() => {
    if (layers.reportsHeatmap && reportsHeatmapSourceRef.current) {
      loadReportsHeatmapData();
    }
  }, [layers.reportsHeatmap, loadReportsHeatmapData]);

  // Load weather stations data when layer is enabled or on initial mount
  useEffect(() => {
    if (
      layers.weatherStations &&
      weatherStationSourceRef.current &&
      mapInstanceRef.current
    ) {
      loadWeatherStationsData();
    }
  }, [layers.weatherStations, loadWeatherStationsData]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      const view = mapInstanceRef.current.getView();
      const currentZoom = view.getZoom() || 12;
      view.setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      const view = mapInstanceRef.current.getView();
      const currentZoom = view.getZoom() || 12;
      view.setZoom(currentZoom - 1);
    }
  };

  const handleLayersMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLayersMenuAnchor(event.currentTarget);
  };

  const handleLayersMenuClose = () => {
    setLayersMenuAnchor(null);
  };

  const handleLayerToggle = (layer: keyof LayerState) => {
    setLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  const handleCloseClickPopup = () => {
    setClickPopup(null);
  };

  const handleGeocodeSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&addressdetails=1`
      );
      const results = await response.json();
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Geocode search error:', error);
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSearchResultClick = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    if (mapInstanceRef.current) {
      const view = mapInstanceRef.current.getView();
      view.animate({
        center: fromLonLat([lng, lat]),
        zoom: 15,
        duration: 1000,
      });
    }

    setSearchQuery(result.display_name);
    setShowSearchResults(false);
  };

  return (
    <Box
      sx={{
        flex: 1,
        position: 'relative',
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* Map Container */}
      <Box
        ref={mapRef}
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      />

      {/* Center Top Search Bar */}
      <Box
        sx={{
          position: 'absolute',
          top: isMobile ? 10 : 20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: isMobile ? '90%' : 400,
          zIndex: 1000,
          px: isMobile ? 2 : 0,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search location or address..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(e.target.value);
            handleGeocodeSearch(e.target.value);
          }}
          onFocus={() => {
            if (searchResults.length > 0) {
              setShowSearchResults(true);
            }
          }}
          onBlur={() => {
            // Delay hiding to allow clicking on results
            setTimeout(() => setShowSearchResults(false), 200);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '& fieldset': {
                border: 'none',
              },
            },
          }}
        />

        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <Paper
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 1,
              maxHeight: 200,
              overflow: 'auto',
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              borderRadius: 2,
              zIndex: 1001,
            }}
          >
            {searchResults.map((result, index) => (
              <Box
                key={index}
                onClick={() => handleSearchResultClick(result)}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  borderBottom:
                    index < searchResults.length - 1
                      ? '1px solid #e0e0e0'
                      : 'none',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {result.display_name}
                </Typography>
                {result.address && (
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary' }}
                  >
                    {result.address.city ||
                      result.address.town ||
                      result.address.village ||
                      ''}
                    {result.address.state && `, ${result.address.state}`}
                    {result.address.country && `, ${result.address.country}`}
                  </Typography>
                )}
              </Box>
            ))}
          </Paper>
        )}
      </Box>

      {/* Map Controls - Top Right */}
      <Box
        sx={{
          position: 'absolute',
          right: isMobile ? 8 : 16,
          top: isMobile ? 8 : 16,
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? 0.5 : 1,
        }}
      >
        {/* Control Buttons */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? 0.5 : 1,
          }}
        >
          <IconButton
            onClick={() => setShowGeocodeSearch(!showGeocodeSearch)}
            sx={{
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              borderRadius: 1,
              width: isMobile ? 36 : 44,
              height: isMobile ? 36 : 44,
              '&:hover': {
                backgroundColor: '#f8f9fa',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <SearchIcon
              sx={{ fontSize: isMobile ? 16 : 20, color: '#1976d2' }}
            />
          </IconButton>
          <IconButton
            onClick={handleLayersMenuOpen}
            sx={{
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              borderRadius: 1,
              width: isMobile ? 36 : 44,
              height: isMobile ? 36 : 44,
              '&:hover': {
                backgroundColor: '#f8f9fa',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <LayersIcon
              sx={{ fontSize: isMobile ? 16 : 20, color: '#1976d2' }}
            />
          </IconButton>
          <IconButton
            sx={{
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              borderRadius: 1,
              width: isMobile ? 36 : 44,
              height: isMobile ? 36 : 44,
              '&:hover': {
                backgroundColor: '#f8f9fa',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <SatelliteIcon
              sx={{ fontSize: isMobile ? 16 : 20, color: '#1976d2' }}
            />
          </IconButton>
          <IconButton
            onClick={() => setShowLegend(!showLegend)}
            sx={{
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              borderRadius: 1,
              width: isMobile ? 36 : 44,
              height: isMobile ? 36 : 44,
              '&:hover': {
                backgroundColor: '#f8f9fa',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <InfoIcon sx={{ fontSize: isMobile ? 16 : 20, color: '#1976d2' }} />
          </IconButton>
        </Box>

        {/* Zoom Controls */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? 0.5 : 1,
          }}
        >
          <IconButton
            onClick={handleZoomIn}
            sx={{
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              borderRadius: 1,
              width: isMobile ? 36 : 44,
              height: isMobile ? 36 : 44,
              '&:hover': {
                backgroundColor: '#f8f9fa',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <ZoomInIcon
              sx={{ fontSize: isMobile ? 16 : 20, color: '#1976d2' }}
            />
          </IconButton>
          <IconButton
            onClick={handleZoomOut}
            sx={{
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              borderRadius: 1,
              width: isMobile ? 36 : 44,
              height: isMobile ? 36 : 44,
              '&:hover': {
                backgroundColor: '#f8f9fa',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <ZoomOutIcon
              sx={{ fontSize: isMobile ? 16 : 20, color: '#1976d2' }}
            />
          </IconButton>
        </Box>
      </Box>

      {/* Zoom Level Info - Bottom Right */}
      <Paper
        sx={{
          position: 'absolute',
          bottom: isMobile ? 8 : 16,
          right: isMobile ? 8 : 16,
          p: isMobile ? 0.5 : 1,
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderRadius: 1,
          minWidth: isMobile ? 60 : 80,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: isMobile ? '0.65rem' : '0.75rem',
            textAlign: 'center',
          }}
        >
          Zoom: {currentZoom}
        </Typography>
      </Paper>

      {/* Geocode Search FAB - Bottom Left */}
      <IconButton
        onClick={() => setShowGeocodeSearch(!showGeocodeSearch)}
        sx={{
          position: 'absolute',
          bottom: isMobile ? 8 : 16,
          left: isMobile ? 8 : 16,
          backgroundColor: '#1976d2',
          color: 'white',
          width: isMobile ? 48 : 56,
          height: isMobile ? 48 : 56,
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
          '&:hover': {
            backgroundColor: '#1565c0',
            boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <MyLocationIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
      </IconButton>

      {/* Reports FAB - Bottom Left (above geocode) */}
      <IconButton
        onClick={onReportsClick}
        sx={{
          position: 'absolute',
          bottom: isMobile ? 64 : 80,
          left: isMobile ? 8 : 16,
          backgroundColor: '#9c27b0',
          color: 'white',
          width: isMobile ? 48 : 56,
          height: isMobile ? 48 : 56,
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
          '&:hover': {
            backgroundColor: '#7b1fa2',
            boxShadow: '0 6px 16px rgba(156, 39, 176, 0.4)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <AssessmentIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
      </IconButton>

      {/* Layers Menu */}
      <Menu
        anchorEl={layersMenuAnchor}
        open={Boolean(layersMenuAnchor)}
        onClose={handleLayersMenuClose}
        PaperProps={{
          sx: {
            minWidth: 200,
            mt: 1,
          },
        }}
      >
        <MenuItem onClick={() => handleLayerToggle('floodRisk')}>
          <ListItemIcon>
            <Checkbox checked={layers.floodRisk} size="small" />
          </ListItemIcon>
          <ListItemText primary="Flood Risk Areas" />
        </MenuItem>
        <MenuItem onClick={() => handleLayerToggle('weatherStations')}>
          <ListItemIcon>
            <Checkbox checked={layers.weatherStations} size="small" />
          </ListItemIcon>
          <ListItemText primary="Weather Stations" />
        </MenuItem>
        <MenuItem onClick={() => handleLayerToggle('reportsHeatmap')}>
          <ListItemIcon>
            <Checkbox checked={layers.reportsHeatmap} size="small" />
          </ListItemIcon>
          <ListItemText primary="Reports Heatmap" />
        </MenuItem>
      </Menu>

      {/* Click Popup - Only one popup now */}
      {clickPopup && (
        <Paper
          sx={{
            position: 'absolute',
            left: clickPopup.x,
            top: clickPopup.y,
            transform: 'translate(-50%, -100%)',
            p: 2,
            backgroundColor: 'white',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            borderRadius: 2,
            minWidth: 200,
            zIndex: 1000,
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid white',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Clicked Location
            </Typography>
            <IconButton
              size="small"
              onClick={handleCloseClickPopup}
              sx={{ p: 0 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
            Lat: {clickPopup.lat}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
            Lng: {clickPopup.lng}
          </Typography>
        </Paper>
      )}

      {/* Geocode Search Panel */}
      {showGeocodeSearch && (
        <Paper
          sx={{
            position: 'absolute',
            bottom: 80,
            left: 80,
            p: 2,
            backgroundColor: 'white',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            borderRadius: 2,
            minWidth: 250,
            zIndex: 1000,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Search Location
            </Typography>
            <IconButton
              size="small"
              onClick={() => setShowGeocodeSearch(false)}
              sx={{ p: 0 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography
            variant="body2"
            sx={{ fontSize: '0.75rem', color: 'text.secondary' }}
          >
            Enter address or coordinates to search
          </Typography>
        </Paper>
      )}

      {/* Legend Popup */}
      <LegendPopup
        isOpen={showLegend}
        onClose={() => setShowLegend(false)}
        layers={layers}
      />
    </Box>
  );
};

export default MapArea;
