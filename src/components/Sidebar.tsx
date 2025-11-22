import React from 'react';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const Sidebar: React.FC = () => {
  return (
    <Box
      sx={{
        width: '300px',
        backgroundColor: 'white',
        borderRight: '1px solid #e0e0e0',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {/* Reports Section */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 1,
        }}
      >
        &gt; Reports
      </Typography>

      {/* Search Bar */}
      <TextField
        placeholder="Search location or address..."
        variant="outlined"
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#f5f5f5',
            borderRadius: 2,
            '& fieldset': {
              borderColor: '#e0e0e0',
            },
            '&:hover fieldset': {
              borderColor: '#bdbdbd',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1976d2',
            },
          },
          '& .MuiInputBase-input': {
            fontSize: '0.875rem',
            color: 'text.secondary',
            '&::placeholder': {
              color: 'text.secondary',
              opacity: 1,
            },
          },
        }}
      />

      {/* Additional sidebar content can be added here */}
      <Box sx={{ flex: 1 }} />
    </Box>
  );
};

export default Sidebar;
