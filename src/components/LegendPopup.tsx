import React from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from '@mui/material';
import {
  Waves as WavesIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

interface LegendPopupProps {
  isOpen: boolean;
  onClose: () => void;
  layers: {
    floodRisk: boolean;
    weatherStations: boolean;
    reportsHeatmap: boolean;
  };
}

const LegendPopup: React.FC<LegendPopupProps> = ({
  isOpen,
  onClose,
  layers,
}) => {
  if (!isOpen) return null;

  const riskAreas = [
    { level: 'High Risk', count: 'click for reports', color: '#d32f2f' },
    { level: 'Moderate Risk', count: 'click for reports', color: '#ff9800' },
    { level: 'Low Risk', count: 'click for reports', color: '#ffeb3b' },
  ];

  const weatherStations = [
    { type: 'Rain Gauge', count: 'click for data', color: '#1976d2' },
  ];

  const reportSeverities = [
    { level: 'High', count: 'click for details', color: '#d32f2f' },
    { level: 'Moderate', count: 'click for details', color: '#ff9800' },
    { level: 'Low', count: 'click for details', color: '#ffeb3b' },
  ];

  return (
    <Paper
      sx={{
        position: 'absolute',
        //bottom: 0,
        top: 10,
        left: 10,
        p: 1.5,
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
        borderRadius: 2,
        minWidth: 200,
        maxWidth: 240,
        zIndex: 1000,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <WavesIcon sx={{ color: '#1976d2', fontSize: 16 }} />
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              fontSize: '0.875rem',
            }}
          >
            FloodGuard Monitor
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ p: 0, width: 20, height: 20 }}
        >
          <CloseIcon fontSize="small" sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>

      {/* Flood Risk Areas - Only show if layer is active */}
      {layers.floodRisk && (
        <>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 0.5,
              fontSize: '0.75rem',
            }}
          >
            Flood Risk Areas (15 monitored)
          </Typography>
          <List dense sx={{ py: 0, mb: 1 }}>
            {riskAreas.map((area, index) => (
              <ListItem key={index} sx={{ py: 0, px: 0 }}>
                <ListItemIcon sx={{ minWidth: 18 }}>
                  <WarningIcon
                    sx={{
                      fontSize: 14,
                      color: area.color,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.7rem',
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
              mb: 0.5,
              fontSize: '0.75rem',
            }}
          >
            Weather Stations (15 active)
          </Typography>
          <List dense sx={{ py: 0, mb: 1 }}>
            {weatherStations.map((station, index) => (
              <ListItem key={index} sx={{ py: 0, px: 0 }}>
                <ListItemIcon sx={{ minWidth: 18 }}>
                  <Box
                    component="svg"
                    viewBox="0 0 16 16"
                    sx={{
                      width: 14,
                      height: 14,
                      fill: station.color,
                    }}
                  >
                    <path d="M8.5 14V8.5h0.5a1.00115 1.00115 0 0 0 1 -1v-2a1.00115 1.00115 0 0 0 -1 -1h-2a1.00115 1.00115 0 0 0 -1 1v2a1.00115 1.00115 0 0 0 1 1h0.5v5.5H1v1h14v-1Zm-1.5 -8.5h2l0.00075 2H7Z" />
                    <path d="M4.66625 9.1084a3.50035 3.50035 0 0 1 0 -5.21705l0.667 0.745a2.5 2.5 0 0 0 0 3.72685Z" />
                    <path d="m11.3335 9.1084 -0.667 -0.745a2.49975 2.49975 0 0 0 0 -3.72685l0.667 -0.745a3.5 3.5 0 0 1 0 5.21705Z" />
                    <path d="M3.1997 10.9004a5.50095 5.50095 0 0 1 0 -8.8003L3.8 2.9a4.50045 4.50045 0 0 0 0 7.2007Z" />
                    <path d="m12.8003 10.9004 -0.6006 -0.8a4.5005 4.5005 0 0 0 0 -7.20095l0.6006 -0.8a5.501 5.501 0 0 1 0 8.80055Z" />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.7rem',
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
              mb: 0.5,
              fontSize: '0.75rem',
            }}
          >
            Reports Heatmap (8 reports)
          </Typography>
          <List dense sx={{ py: 0, mb: 1 }}>
            {reportSeverities.map((report, index) => (
              <ListItem key={index} sx={{ py: 0, px: 0 }}>
                <ListItemIcon sx={{ minWidth: 18 }}>
                  <WarningIcon
                    sx={{
                      fontSize: 14,
                      color: report.color,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.7rem',
                        color: 'text.secondary',
                        cursor: 'pointer',
                        '&:hover': {
                          color: 'text.primary',
                        },
                      }}
                    >
                      {report.level} ({report.count})
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </>
      )}

      {/* Footer */}
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontSize: '0.6rem',
          display: 'block',
          textAlign: 'center',
          mt: 0.5,
        }}
      >
        © Esri, Maxar
      </Typography>
    </Paper>
  );
};

export default LegendPopup;
