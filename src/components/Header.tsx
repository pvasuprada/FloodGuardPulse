import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';

interface HeaderProps {
  showTime: boolean;
  onAlertsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ showTime, onAlertsClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'white',
        color: 'text.primary',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        height: isMobile ? '60px' : '80px',
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          height: '100%',
          px: isMobile ? 2 : 3,
        }}
      >
        {/* Left side - Logo and Title */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 1 : 2 }}
        >
          <Box
            sx={{
              width: isMobile ? 32 : 40,
              height: isMobile ? 32 : 40,
              backgroundColor: '#e3f2fd',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '16px' : '20px',
              fontWeight: 'bold',
              color: '#1976d2',
            }}
          >
            F
          </Box>
          <Box sx={{ display: isMobile ? 'none' : 'block' }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: '#1565c0',
                lineHeight: 1,
              }}
            >
              FloodGuard
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
                lineHeight: 1,
              }}
            >
              Real-Time Flood Alert System
            </Typography>
          </Box>
          {isMobile && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: '#1565c0',
                lineHeight: 1,
              }}
            >
              FloodGuard
            </Typography>
          )}
        </Box>

        {/* Center - Date and Time - Only show if showTime is true */}
        {showTime && !isMobile && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                color: 'text.primary',
                lineHeight: 1,
              }}
            >
              {formattedDate}, {formattedTime}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.75rem',
                lineHeight: 1,
              }}
            >
              IST (India Standard Time)
            </Typography>
          </Box>
        )}

        {/* Right side - Action buttons */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? 0.5 : 1,
          }}
        >
          <IconButton
            onClick={onAlertsClick}
            sx={{
              backgroundColor: '#f5f5f5',
              color: 'text.secondary',
              width: isMobile ? 36 : 40,
              height: isMobile ? 36 : 40,
              '&:hover': {
                backgroundColor: '#eeeeee',
              },
            }}
          >
            <NotificationsIcon sx={{ fontSize: isMobile ? 18 : 20 }} />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<PhoneIcon sx={{ fontSize: isMobile ? 16 : 18 }} />}
            sx={{
              backgroundColor: '#d32f2f',
              color: 'white',
              fontWeight: 'bold',
              px: isMobile ? 1 : 2,
              py: isMobile ? 0.5 : 1,
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              '&:hover': {
                backgroundColor: '#b71c1c',
              },
            }}
          >
            Emergency
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
