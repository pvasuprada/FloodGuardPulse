import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';
import { sampleAlerts, currentStatus } from '../data/sampleData';

interface AlertsPaneProps {
  isOpen: boolean;
  onClose: () => void;
}

const AlertsPane: React.FC<AlertsPaneProps> = ({ isOpen, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return '#d32f2f';
      case 'Moderate':
        return '#ff9800';
      case 'Low':
        return '#ffeb3b';
      default:
        return '#9e9e9e';
    }
  };

  const getAlertIcon = (type: string) => {
    return <WarningIcon sx={{ color: getSeverityColor('High') }} />;
  };

  if (!isOpen) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: isMobile ? '100%' : 400,
        height: '100vh',
        backgroundColor: 'white',
        boxShadow: '-4px 0 8px rgba(0,0,0,0.1)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Status & Alerts
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Current Status */}
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Current Status
        </Typography>
        <Card sx={{ border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ p: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1,
              }}
            >
              <CircleIcon
                sx={{
                  color: getSeverityColor('Moderate'),
                  fontSize: 16,
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Flood Alert Level:
              </Typography>
              <Chip
                label={currentStatus.alertLevel}
                size="small"
                sx={{
                  backgroundColor: getSeverityColor('Moderate'),
                  color: 'white',
                  fontWeight: 600,
                }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.4,
              }}
            >
              {currentStatus.description}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Live Alerts Feed */}
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ px: 2, pb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Live Alerts Feed
            </Typography>
            <Chip
              label={`${currentStatus.activeAlerts} active`}
              size="small"
              sx={{
                backgroundColor: '#f5f5f5',
                color: 'text.secondary',
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>

        {/* Alerts List */}
        <Box sx={{ flex: 1, overflow: 'auto', px: 2 }}>
          <List sx={{ p: 0 }}>
            {sampleAlerts.map((alert, index) => (
              <React.Fragment key={alert.id}>
                <ListItem
                  sx={{
                    p: 0,
                    mb: 1,
                    alignItems: 'flex-start',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                    {getAlertIcon(alert.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {alert.location}
                        </Typography>
                        <Chip
                          label={alert.severity}
                          size="small"
                          sx={{
                            backgroundColor: getSeverityColor(alert.severity),
                            color: 'white',
                            fontWeight: 600,
                            height: 20,
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            lineHeight: 1.4,
                            mb: 0.5,
                          }}
                        >
                          {alert.message}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ color: 'text.secondary' }}
                          >
                            {alert.timestamp}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              fontWeight: 600,
                            }}
                          >
                            {alert.type}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < sampleAlerts.length - 1 && (
                  <Divider sx={{ my: 1, opacity: 0.3 }} />
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default AlertsPane;
