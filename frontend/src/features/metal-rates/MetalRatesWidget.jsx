import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Chip, 
  IconButton, 
  Tooltip,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { 
  Refresh as RefreshIcon, 
  TrendingUp as TrendingUpIcon, 
  TrendingDown as TrendingDownIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { axiosi } from '../../config/axios';

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'metalType'
})(({ theme, metalType }) => ({
  background: metalType === 'gold'
    ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
    : 'linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%)',
  color: metalType === 'gold' ? '#8B4513' : '#2F4F4F',
  position: 'relative',
  overflow: 'hidden',
  marginBottom: theme.spacing(1),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.1)',
    pointerEvents: 'none'
  }
}));

const MetalRatesWidget = () => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchRates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosi.get('/metal-rates/live');
      const data = response.data;
      
      if (data.success) {
        setRates(data.data);
        setLastUpdated(new Date(data.timestamp));
      } else {
        throw new Error(data.message || 'Failed to fetch rates');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching metal rates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    // Price is already in INR per gram
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatChange = (change) => {
    const isPositive = change >= 0;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {isPositive ? (
          <TrendingUpIcon sx={{ color: 'success.main', fontSize: 14 }} />
        ) : (
          <TrendingDownIcon sx={{ color: 'error.main', fontSize: 14 }} />
        )}
        <Typography
          variant="caption"
          color={isPositive ? 'success.main' : 'error.main'}
          sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
        >
          {isPositive ? '+' : ''}{change.toFixed(2)}%
        </Typography>
      </Box>
    );
  };

  if (loading && !rates) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error && !rates) {
    return (
      <Alert severity="error" sx={{ mb: 2, fontSize: '0.8rem' }}>
        {error}
        <IconButton size="small" onClick={fetchRates} sx={{ ml: 1 }}>
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Alert>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        mb: 2,
        gap: { xs: 1, sm: 0 }
      }}>
        <Typography variant="h6" component="h3" sx={{ 
          fontWeight: 'bold', 
          color: '#1a1a1a',
          fontSize: { xs: '1.1rem', sm: '1.25rem' }
        }}>
          Live Metal Rates (Tamil Nadu)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {lastUpdated && (
            <Tooltip title={`Last updated: ${lastUpdated.toLocaleString()}`}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                  {lastUpdated.toLocaleTimeString()}
                </Typography>
              </Box>
            </Tooltip>
          )}
          <Tooltip title="Refresh rates">
            <IconButton onClick={fetchRates} disabled={loading} size="small">
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {/* Gold Rates */}
        <Grid item xs={12} sm={6}>
          <StyledCard metalType="gold">
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: { xs: 1, sm: 0 }
              }}>
                <Box>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 'bold', 
                    mb: 0.5, 
                    fontSize: { xs: '0.75rem', sm: '0.8rem' }
                  }}>
                    Gold (24K)
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}>
                    {rates?.gold?.pricePerGram ? formatPrice(rates.gold.pricePerGram) : 'N/A'}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                    per gram
                  </Typography>
                </Box>
                <Box sx={{ 
                  textAlign: { xs: 'left', sm: 'right' },
                  alignSelf: { xs: 'flex-start', sm: 'center' }
                }}>
                  {rates?.gold?.changePercent && formatChange(rates.gold.changePercent)}
                </Box>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Silver Rates */}
        <Grid item xs={12} sm={6}>
          <StyledCard metalType="silver">
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: { xs: 1, sm: 0 }
              }}>
                <Box>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 'bold', 
                    mb: 0.5, 
                    fontSize: { xs: '0.75rem', sm: '0.8rem' }
                  }}>
                    Silver (999)
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}>
                    {rates?.silver?.pricePerGram ? formatPrice(rates.silver.pricePerGram) : 'N/A'}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                    per gram
                  </Typography>
                </Box>
                <Box sx={{ 
                  textAlign: { xs: 'left', sm: 'right' },
                  alignSelf: { xs: 'flex-start', sm: 'center' }
                }}>
                  {rates?.silver?.changePercent && formatChange(rates.silver.changePercent)}
                </Box>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* Info */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
          Rates update every hour
          <br />
          Source: {rates?.source || 'Live Market'}
          <br />
          <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>
            Prices shown in Indian Rupees (INR) per gram
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
};

export default MetalRatesWidget;
