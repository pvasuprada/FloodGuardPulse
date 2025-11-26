import React, { useState, useEffect, useCallback } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  LocationOn as LocationIcon,
  Verified as VerifiedIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { FloodReport } from '../data/sampleData';

interface ReportsPaneProps {
  isOpen: boolean;
  onClose: () => void;
  navigateToLocation?: ((lat: number, lng: number) => void) | null;
}

const ReportsPane: React.FC<ReportsPaneProps> = ({
  isOpen,
  onClose,
  navigateToLocation,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const apiBaseUrl = process.env.REACT_APP_API_URL ?? '';

  const [reports, setReports] = useState<FloodReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All Severity');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);

  // Form dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    severity_level: '',
    description: '',
    your_name: '',
    latitude: '',
    longitude: '',
    photo_evidence: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Location geocoding state
  const [locationSearchResults, setLocationSearchResults] = useState<any[]>([]);
  const [showLocationResults, setShowLocationResults] = useState(false);

  // Fetch reports from API
  const fetchReports = useCallback(async () => {
    setIsLoadingReports(true);
    setReportsError(null);
    try {
      const response = await fetch(`${apiBaseUrl}/api/reported-floods`);
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      const data = await response.json();
      setReports(data);
    } catch (error) {
      setReportsError(
        error instanceof Error ? error.message : 'Failed to load flood reports'
      );
      setReports([]);
    } finally {
      setIsLoadingReports(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchReports();
    }
  }, [isOpen, fetchReports]);

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

  const handleOpenDialog = () => {
    setDialogOpen(true);
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      location: '',
      severity_level: '',
      description: '',
      your_name: '',
      latitude: '',
      longitude: '',
      photo_evidence: null,
    });
    setSubmitError(null);
    setSubmitSuccess(false);
    setLocationSearchResults([]);
    setShowLocationResults(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Trigger geocoding search for location field
    if (name === 'location') {
      handleLocationGeocodeSearch(value);
    }
  };

  const handleLocationGeocodeSearch = async (query: string) => {
    if (!query.trim()) {
      setLocationSearchResults([]);
      setShowLocationResults(false);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&addressdetails=1`
      );
      const results = await response.json();
      setLocationSearchResults(results);
      setShowLocationResults(true);
    } catch (error) {
      console.error('Geocode search error:', error);
      setLocationSearchResults([]);
      setShowLocationResults(false);
    }
  };

  const handleLocationResultClick = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    setFormData((prev) => ({
      ...prev,
      location: result.display_name,
      latitude: lat.toString(),
      longitude: lng.toString(),
    }));

    setLocationSearchResults([]);
    setShowLocationResults(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setSubmitError('File size exceeds 10MB limit');
        return;
      }
      // Check file type
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/i)) {
        setSubmitError('Only PNG and JPG images are allowed');
        return;
      }
    }
    setFormData((prev) => ({
      ...prev,
      photo_evidence: file,
    }));
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    // Validation
    if (!formData.location.trim()) {
      setSubmitError('Location is required');
      return;
    }
    if (!formData.severity_level) {
      setSubmitError('Severity level is required');
      return;
    }
    if (formData.description.length > 500) {
      setSubmitError('Description must be 500 characters or less');
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('location', formData.location.trim());
      formDataToSend.append('severity_level', formData.severity_level);
      if (formData.description.trim()) {
        formDataToSend.append('description', formData.description.trim());
      }
      if (formData.your_name.trim()) {
        formDataToSend.append('your_name', formData.your_name.trim());
      }
      if (formData.latitude.trim()) {
        formDataToSend.append('latitude', formData.latitude.trim());
      }
      if (formData.longitude.trim()) {
        formDataToSend.append('longitude', formData.longitude.trim());
      }
      if (formData.photo_evidence) {
        formDataToSend.append('photo_evidence', formData.photo_evidence);
      }

      const response = await fetch(`${apiBaseUrl}/api/report-flood`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || errorData.message || 'Failed to submit report'
        );
      }

      await response.json();
      setSubmitSuccess(true);

      // Refresh reports after successful submission
      fetchReports();

      // Close dialog after 2 seconds on success
      setTimeout(() => {
        handleCloseDialog();
      }, 2000);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'An error occurred while submitting the report'
      );
    } finally {
      setIsSubmitting(false);
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
          onClick={handleOpenDialog}
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
        {isLoadingReports && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 4,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {reportsError && !isLoadingReports && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <Button size="small" onClick={fetchReports}>
                Retry
              </Button>
            }
          >
            {reportsError}
          </Alert>
        )}

        {!isLoadingReports &&
          !reportsError &&
          filteredReports.map((report) => (
            <Card
              key={report.id}
              onClick={() => {
                if (navigateToLocation && report.coordinates) {
                  navigateToLocation(
                    report.coordinates.lat,
                    report.coordinates.lng
                  );
                }
              }}
              sx={{
                mb: 2,
                border: '1px solid #e0e0e0',
                cursor: navigateToLocation ? 'pointer' : 'default',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  backgroundColor: navigateToLocation
                    ? 'rgba(0, 0, 0, 0.02)'
                    : 'transparent',
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
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary' }}
                  >
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
                  <LocationIcon
                    sx={{ color: 'text.secondary', fontSize: 16 }}
                  />
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
                <Box
                  sx={{
                    width: '100%',
                    height: 120,
                    borderRadius: 1,
                    mb: 2,
                    overflow: 'hidden',
                    border: '1px solid #e0e0e0',
                    position: 'relative',
                  }}
                >
                  <Box
                    component="img"
                    src={report.imageUrl || '/flood-placeholder.jpg'}
                    alt={
                      report.imageUrl
                        ? 'Flood report image'
                        : 'Flood placeholder'
                    }
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement;
                      if (
                        target.src !==
                        `${window.location.origin}/flood-placeholder.jpg`
                      ) {
                        target.src = '/flood-placeholder.jpg';
                      }
                    }}
                  />
                </Box>

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
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary' }}
                  >
                    Confidence: {report.confidence}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}

        {!isLoadingReports && !reportsError && filteredReports.length === 0 && (
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

      {/* Add Report Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="h6">Report Flood</Typography>
              <IconButton
                onClick={handleCloseDialog}
                size="small"
                disabled={isSubmitting}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
            >
              {submitError && (
                <Alert severity="error" onClose={() => setSubmitError(null)}>
                  {submitError}
                </Alert>
              )}
              {submitSuccess && (
                <Alert severity="success">
                  Flood data posted successfully!
                </Alert>
              )}

              <Box sx={{ position: 'relative' }}>
                <TextField
                  name="location"
                  label="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  onFocus={() => {
                    if (locationSearchResults.length > 0) {
                      setShowLocationResults(true);
                    }
                  }}
                  onBlur={() => {
                    // Delay hiding to allow click on results
                    setTimeout(() => {
                      setShowLocationResults(false);
                    }, 200);
                  }}
                  required
                  fullWidth
                  placeholder="e.g., Banjara Hills"
                  disabled={isSubmitting}
                />
                {/* Location Search Results Dropdown */}
                {showLocationResults && locationSearchResults.length > 0 && (
                  <Paper
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      mt: 0.5,
                      maxHeight: 200,
                      overflow: 'auto',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                      borderRadius: 1,
                      zIndex: 1300,
                    }}
                  >
                    {locationSearchResults.map((result, index) => (
                      <Box
                        key={index}
                        onClick={() => handleLocationResultClick(result)}
                        sx={{
                          p: 1.5,
                          cursor: 'pointer',
                          borderBottom:
                            index < locationSearchResults.length - 1
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

              <FormControl fullWidth required disabled={isSubmitting}>
                <InputLabel>Severity Level</InputLabel>
                <Select
                  name="severity_level"
                  value={formData.severity_level}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      severity_level: e.target.value,
                    }))
                  }
                  label="Severity Level"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>

              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                placeholder="Describe the flooding situation (max 500 characters)"
                inputProps={{ maxLength: 500 }}
                helperText={`${formData.description.length}/500 characters`}
                disabled={isSubmitting}
              />

              <TextField
                name="your_name"
                label="Your Name (Optional)"
                value={formData.your_name}
                onChange={handleInputChange}
                fullWidth
                placeholder="Leave blank for anonymous"
                disabled={isSubmitting}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  name="latitude"
                  label="Latitude (Optional)"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  type="number"
                  fullWidth
                  placeholder="e.g., 17.4486"
                  disabled={isSubmitting}
                  inputProps={{ step: 'any' }}
                />
                <TextField
                  name="longitude"
                  label="Longitude (Optional)"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  type="number"
                  fullWidth
                  placeholder="e.g., 78.3908"
                  disabled={isSubmitting}
                  inputProps={{ step: 'any' }}
                />
              </Box>

              <Box>
                <input
                  accept="image/png,image/jpeg,image/jpg"
                  style={{ display: 'none' }}
                  id="photo-upload"
                  type="file"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="photo-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    disabled={isSubmitting}
                    sx={{
                      py: 1.5,
                      borderStyle: 'dashed',
                    }}
                  >
                    {formData.photo_evidence
                      ? formData.photo_evidence.name
                      : 'Upload Photo Evidence (Optional)'}
                  </Button>
                </label>
                {formData.photo_evidence && (
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}
                  >
                    Selected: {formData.photo_evidence.name} ({' '}
                    {(formData.photo_evidence.size / 1024 / 1024).toFixed(2)}{' '}
                    MB)
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}
                >
                  PNG or JPG, up to 10MB
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={handleCloseDialog}
              disabled={isSubmitting}
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : null
              }
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ReportsPane;
