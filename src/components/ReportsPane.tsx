import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  LocationOn as LocationIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { sampleFloodReports, FloodReport } from '../data/sampleData';

interface ReportsPaneProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportsPane: React.FC<ReportsPaneProps> = ({ isOpen, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [reports] = useState<FloodReport[]>(sampleFloodReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All Severity');
  const [typeFilter, setTypeFilter] = useState('All Types');

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

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.location
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSeverity =
      severityFilter === 'All Severity' || report.severity === severityFilter;
    const matchesType =
      typeFilter === 'All Types' || report.category === typeFilter;
    return matchesSearch && matchesSeverity && matchesType;
  });

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
          Flood Reports ({reports.length})
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Add Report Button */}
      <Box sx={{ p: 2, pb: 1 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          fullWidth
          sx={{
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
        >
          Add Report
        </Button>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ p: 2, pt: 1 }}>
        <TextField
          fullWidth
          placeholder="Search reports..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <FormControl size="small" sx={{ flex: 1 }}>
            <InputLabel>Severity</InputLabel>
            <Select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              label="Severity"
            >
              <MenuItem value="All Severity">All Severity</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Moderate">Moderate</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ flex: 1 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              label="Type"
            >
              <MenuItem value="All Types">All Types</MenuItem>
              <MenuItem value="Flooding">Flooding</MenuItem>
              <MenuItem value="Waterlogging">Waterlogging</MenuItem>
              <MenuItem value="Drainage">Drainage</MenuItem>
              <MenuItem value="Road Blocked">Road Blocked</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Reports List */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2, pt: 0 }}>
        {filteredReports.map((report) => (
          <Card
            key={report.id}
            sx={{
              mb: 2,
              border: '1px solid #e0e0e0',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              },
            }}
          >
            <CardContent sx={{ p: 2 }}>
              {/* Header with severity and verification */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={report.severity}
                    size="small"
                    sx={{
                      backgroundColor: getSeverityColor(report.severity),
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                  {report.verified && (
                    <Chip
                      icon={<VerifiedIcon />}
                      label="Verified"
                      size="small"
                      sx={{
                        backgroundColor: '#4caf50',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {report.timestamp}
                </Typography>
              </Box>

              {/* Location */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 1,
                }}
              >
                <LocationIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {report.location}
                </Typography>
              </Box>

              {/* Description */}
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  mb: 2,
                  lineHeight: 1.4,
                }}
              >
                {report.description}
              </Typography>

              {/* Image placeholder */}
              {report.imageUrl && (
                <Box
                  sx={{
                    width: '100%',
                    height: 120,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary' }}
                  >
                    Image placeholder
                  </Typography>
                </Box>
              )}

              {/* Reporter info */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                    {report.reporter.charAt(0)}
                  </Avatar>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary' }}
                  >
                    {report.reporter}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Confidence: {report.confidence}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}

        {filteredReports.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 4,
              color: 'text.secondary',
            }}
          >
            <Typography variant="body2">No reports found</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ReportsPane;
