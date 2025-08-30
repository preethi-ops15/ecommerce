import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Alert,
  Chip,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { TrendingUp as TrendingIcon, CurrencyRupee as CurrencyIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { axiosi } from '../../../config/axios';

const LiveRateDisplay = ({ selectedMaterial }) => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (selectedMaterial) {
      fetchLiveRates();
    }
  }, [selectedMaterial]);

  const fetchLiveRates = async () => {
    if (!selectedMaterial) {
      console.log('No material selected');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching live rates for:', selectedMaterial);
      const response = await axiosi.get('/metal-rates/live');
      console.log('API Response:', response.data);
      setRates(response.data);
    } catch (err) {
      console.error('Error fetching live rates:', err);
      setError('Failed to fetch live rates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchLiveRates();
  };

  const getMaterialRate = () => {
    if (!rates || !selectedMaterial) return null;
    
    // Handle different material types
    if (selectedMaterial.includes('gold')) {
      const goldType = selectedMaterial.split('-')[0]; // Extract the gold type (e.g., 24k, 22k, 18k)
      return rates.gold?.[`${goldType}Price`] || rates.gold?.pricePerGram;
    } else if (selectedMaterial.includes('silver')) {
      return rates.silver?.pricePerGram;
    } else if (selectedMaterial === 'diamond') {
      return rates.diamond?.pricePerCarat || null;
    }
    return null;
  };

  const getMaterialLabel = () => {
    if (!selectedMaterial) return 'Material Rate';
    
    // Format the material name for display
    const formattedMaterial = selectedMaterial
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
      
    return `${formattedMaterial} Rate`;
  };

  const getMaterialIcon = () => {
    if (selectedMaterial?.includes('gold')) {
      return '🥇';
    } else if (selectedMaterial?.includes('silver')) {
      return '🥈';
    } else if (selectedMaterial === 'diamond') {
      return '💎';
    }
    return '💍';
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  if (!selectedMaterial) {
    return null;
  }

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 1, bgcolor: '#f8f9fa' }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={600} color="primary">
          {getMaterialLabel()}
        </Typography>
        <Chip 
          label={selectedMaterial.toUpperCase().replace('-', ' ')} 
          color="primary" 
          size="small"
          icon={<span>{getMaterialIcon()}</span>}
        />
        <Chip 
          label="Live Rates" 
          color="success" 
          size="small"
          icon={<TrendingIcon />}
        />
        <Button
          size="small"
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
          sx={{ ml: 'auto' }}
        >
          Refresh
        </Button>
      </Stack>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Fetching live rates...
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {rates && !loading && (
        <Stack spacing={2}>
          {selectedMaterial.includes('gold') && rates.gold && (
            <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 1, border: '1px solid #ffd700' }}>
              <Stack direction={isMobile ? 'column' : 'row'} justifyContent="space-between" alignItems="center">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CurrencyIcon color="primary" />
                  <Typography variant="body1" fontWeight={500}>
                    Gold Rate (per gram):
                  </Typography>
                </Stack>
                <Typography variant="h5" fontWeight={700} color="primary">
                  {formatPrice(rates.gold.pricePerGram)}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Last updated: {new Date(rates.timestamp).toLocaleString('en-IN')}
              </Typography>
            </Box>
          )}

          {selectedMaterial.includes('silver') && rates.silver && (
            <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 1, border: '1px solid #c0c0c0' }}>
              <Stack direction={isMobile ? 'column' : 'row'} justifyContent="space-between" alignItems="center">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CurrencyIcon color="primary" />
                  <Typography variant="body1" fontWeight={500}>
                    Silver Rate (per gram):
                  </Typography>
                </Stack>
                <Typography variant="h5" fontWeight={700} color="primary">
                  {formatPrice(rates.silver.pricePerGram)}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Last updated: {new Date(rates.timestamp).toLocaleString('en-IN')}
              </Typography>
            </Box>
          )}

          {selectedMaterial === 'diamond' && (
            <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 1, border: '1px solid #b9f2ff' }}>
              <Stack direction={isMobile ? 'column' : 'row'} justifyContent="space-between" alignItems="center">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CurrencyIcon color="primary" />
                  <Typography variant="body1" fontWeight={500}>
                    Diamond Rate (per carat):
                  </Typography>
                </Stack>
                <Typography variant="h5" fontWeight={700} color="primary">
                  ₹50,000 - ₹2,00,000
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Diamond prices vary based on 4Cs (Cut, Color, Clarity, Carat)
              </Typography>
            </Box>
          )}

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Note:</strong> These rates are used to calculate product prices automatically. 
              For gold and silver, rates update every 30 minutes. Diamond prices are estimated ranges.
            </Typography>
          </Alert>
        </Stack>
      )}

      {!rates && !loading && !error && (
        <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 1, border: '1px dashed #ccc' }}>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Select a material to view live rates
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default LiveRateDisplay;
