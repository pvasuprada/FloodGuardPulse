import React from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { Waves as WavesIcon } from '@mui/icons-material';

interface LayerState {
  floodRisk: boolean;
  weatherStations: boolean;
  reportsHeatmap: boolean;
}

interface MonitorPanelProps {
  layers: LayerState;
}

const MonitorPanel: React.FC<MonitorPanelProps> = ({ layers }) => {
  const riskAreas = [
    { level: 'High Risk', count: 'click for reports', color: '#d32f2f' },
    { level: 'Moderate Risk', count: 'click for reports', color: '#ff9800' },
    { level: 'Low Risk', count: 'click for reports', color: '#ffeb3b' },
  ];

  const weatherStations = [
    { type: 'Rain Gauge', count: 'click for data', color: '#1976d2' },
  ];

  return (
    <Paper
      sx={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        p: 2,
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
        borderRadius: 2,
        minWidth: 250,
        maxWidth: 300,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <WavesIcon sx={{ color: '#1976d2', fontSize: 20 }} />
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: 'text.primary' }}
        >
          FloodGuard Monitor
        </Typography>
      </Box>

      {/* Flood Risk Areas - Only show if layer is active */}
      {layers.floodRisk && (
        <>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 1,
            }}
          >
            Flood Risk Areas (15 monitored)
          </Typography>
          <List dense sx={{ py: 0, mb: 2 }}>
            {riskAreas.map((area, index) => (
              <ListItem key={index} sx={{ py: 0, px: 0 }}>
                <ListItemIcon sx={{ minWidth: 20 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      backgroundColor: area.color,
                      borderRadius: '50%',
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.75rem',
                        color: 'text.secondary',
                        cursor: 'pointer',
                        '&:hover': {
                          color: 'text.primary',
                        },
                      }}
                    >
                      {area.level} ({area.count})
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </>
      )}

      {/* Weather Stations - Only show if layer is active */}
      {layers.weatherStations && (
        <>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 1,
            }}
          >
            Weather Stations (15 active)
          </Typography>
          <List dense sx={{ py: 0, mb: 1 }}>
            {weatherStations.map((station, index) => (
              <ListItem key={index} sx={{ py: 0, px: 0 }}>
                <ListItemIcon sx={{ minWidth: 20 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      backgroundColor: station.color,
                      borderRadius: '50%',
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.75rem',
                        color: 'text.secondary',
                        cursor: 'pointer',
                        '&:hover': {
                          color: 'text.primary',
                        },
                      }}
                    >
                      {station.type} ({station.count})
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </>
      )}

      {/* Reports Heatmap - Only show if layer is active */}
      {layers.reportsHeatmap && (
        <>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 1,
            }}
          >
            Reports Heatmap (8 reports)
          </Typography>
          <List dense sx={{ py: 0, mb: 1 }}>
            <ListItem sx={{ py: 0, px: 0 }}>
              <ListItemIcon sx={{ minWidth: 20 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    backgroundColor: '#9c27b0',
                    borderRadius: '50%',
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.75rem',
                      color: 'text.secondary',
                      cursor: 'pointer',
                      '&:hover': {
                        color: 'text.primary',
                      },
                    }}
                  >
                    Report Points (click for details)
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </>
      )}

      {/* Footer */}
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontSize: '0.65rem',
          display: 'block',
          textAlign: 'center',
          mt: 1,
        }}
      >
        © Esri, Maxar
      </Typography>
    </Paper>
  );
};

export default MonitorPanel;
