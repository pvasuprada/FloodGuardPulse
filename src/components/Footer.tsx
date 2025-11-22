import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Slider,
  Select,
  MenuItem,
  FormControl,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  AccessTime as ClockIcon,
  SkipPrevious as SkipPreviousIcon,
  PlayArrow as PlayIcon,
  SkipNext as SkipNextIcon,
  FastForward as FastForwardIcon,
} from '@mui/icons-material';

interface FooterProps {
  showTimeline: boolean;
}

const Footer: React.FC<FooterProps> = ({ showTimeline }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        height: isMobile ? '50px' : '60px',
        backgroundColor: 'white',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: isMobile ? 2 : 3,
        boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
        flexDirection: isMobile && showTimeline ? 'column' : 'row',
        py: isMobile && showTimeline ? 1 : 0,
      }}
    >
      {/* Left side - Current time */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ClockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
        <Typography
          variant="body2"
          sx={{ color: 'text.primary', fontWeight: 500 }}
        >
          Today 04:00 PM
        </Typography>
      </Box>

      {/* Center - Timeline slider - Only show if showTimeline is true */}
      {showTimeline && (
        <Box
          sx={{
            flex: 1,
            maxWidth: isMobile ? '100%' : 400,
            mx: isMobile ? 0 : 4,
            width: isMobile ? '100%' : 'auto',
          }}
        >
          <Slider
            defaultValue={17}
            min={0}
            max={720}
            step={1}
            sx={{
              color: '#1976d2',
              '& .MuiSlider-thumb': {
                backgroundColor: 'white',
                border: '2px solid #1976d2',
                width: isMobile ? 14 : 16,
                height: isMobile ? 14 : 16,
              },
              '& .MuiSlider-track': {
                backgroundColor: '#1976d2',
                height: isMobile ? 3 : 4,
              },
              '& .MuiSlider-rail': {
                backgroundColor: '#e0e0e0',
                height: isMobile ? 3 : 4,
              },
            }}
          />
        </Box>
      )}

      {/* Right side - Playback controls - Only show if showTimeline is true */}
      {showTimeline && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? 0.5 : 1,
            flexWrap: isMobile ? 'wrap' : 'nowrap',
          }}
        >
          <IconButton
            size="small"
            sx={{
              color: 'text.secondary',
              width: isMobile ? 28 : 32,
              height: isMobile ? 28 : 32,
            }}
          >
            <SkipPreviousIcon sx={{ fontSize: isMobile ? 16 : 18 }} />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              color: 'text.secondary',
              width: isMobile ? 28 : 32,
              height: isMobile ? 28 : 32,
            }}
          >
            <PlayIcon sx={{ fontSize: isMobile ? 16 : 18 }} />
          </IconButton>
          <Typography
            variant="body2"
            sx={{
              color: 'text.primary',
              fontWeight: 500,
              mx: isMobile ? 0.5 : 1,
              cursor: 'pointer',
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              '&:hover': {
                color: '#1976d2',
              },
            }}
          >
            Now
          </Typography>
          <IconButton
            size="small"
            sx={{
              color: 'text.secondary',
              width: isMobile ? 28 : 32,
              height: isMobile ? 28 : 32,
            }}
          >
            <SkipNextIcon sx={{ fontSize: isMobile ? 16 : 18 }} />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              color: 'text.secondary',
              width: isMobile ? 28 : 32,
              height: isMobile ? 28 : 32,
            }}
          >
            <FastForwardIcon sx={{ fontSize: isMobile ? 16 : 18 }} />
          </IconButton>

          {/* Playback speed selector */}
          <FormControl
            size="small"
            sx={{ minWidth: isMobile ? 45 : 50, ml: isMobile ? 0.5 : 1 }}
          >
            <Select
              value="1x"
              sx={{
                fontSize: isMobile ? '0.65rem' : '0.75rem',
                '& .MuiSelect-select': {
                  py: isMobile ? 0.25 : 0.5,
                  px: isMobile ? 0.5 : 1,
                },
              }}
            >
              <MenuItem value="1x">1x</MenuItem>
              <MenuItem value="2x">2x</MenuItem>
              <MenuItem value="4x">4x</MenuItem>
            </Select>
          </FormControl>

          {/* Frame counter */}
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: isMobile ? '0.65rem' : '0.75rem',
              ml: isMobile ? 0.5 : 1,
            }}
          >
            17/720
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Footer;
