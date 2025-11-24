import React, { useState, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Header from './components/Header';
import MapArea from './components/MapArea';
import Footer from './components/Footer';
import ReportsPane from './components/ReportsPane';
import AlertsPane from './components/AlertsPane';
import './App.css';

interface LayerState {
  floodRisk: boolean;
  weatherStations: boolean;
  reportsHeatmap: boolean;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
});

function App() {
  const [layers, setLayers] = useState<LayerState>({
    floodRisk: true,
    weatherStations: true,
    reportsHeatmap: true,
  });
  const [showReportsPane, setShowReportsPane] = useState(false);
  const [showAlertsPane, setShowAlertsPane] = useState(false);
  const [navigateToLocation, setNavigateToLocation] = useState<
    ((lat: number, lng: number) => void) | null
  >(null);

  const handleNavigationReady = useCallback(
    (navigateFn: (lat: number, lng: number) => void) => {
      setNavigateToLocation(() => navigateFn);
    },
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <Header
          showTime={true}
          onAlertsClick={() => setShowAlertsPane(!showAlertsPane)}
        />
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <MapArea
            layers={layers}
            setLayers={setLayers}
            onReportsClick={() => setShowReportsPane(!showReportsPane)}
            onNavigationReady={handleNavigationReady}
          />
        </Box>
        {layers.floodRisk && <Footer showTimeline={layers.floodRisk} />}

        {/* Right Side Panes */}
        <ReportsPane
          isOpen={showReportsPane}
          onClose={() => setShowReportsPane(false)}
          navigateToLocation={navigateToLocation}
        />
        <AlertsPane
          isOpen={showAlertsPane}
          onClose={() => setShowAlertsPane(false)}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
