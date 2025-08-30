import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Divider,
  Alert,
  InputAdornment
} from '@mui/material';
import { Calculate as CalculateIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { axiosi } from '../../config/axios';

const MetalCalculator = () => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Calculator state
  const [metalType, setMetalType] = useState('gold');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('grams');
  const [purity, setPurity] = useState('24K');
  const [makingCharges, setMakingCharges] = useState('15');
  const [calculatedPrice, setCalculatedPrice] = useState(null);

  // Purity options with their karat values
  const purityOptions = {
    '24K': 1.0,
    '22K': 0.916,
    '18K': 0.75,
    '14K': 0.585,
    '10K': 0.417
  };

  // Weight conversion factors
  const weightConversions = {
    'grams': 1,
    'ounces': 31.1035, // 1 oz = 31.1035 grams
    'tolas': 11.664,   // 1 tola = 11.664 grams
    'carats': 0.2      // 1 carat = 0.2 grams
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosi.get('/metal-rates/live');
      const data = response.data;
      
      if (data.success) {
        setRates(data.data);
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

  const calculatePrice = () => {
    if (!rates || !weight || !purity) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const weightInGrams = parseFloat(weight) * weightConversions[weightUnit];
      const purityMultiplier = purityOptions[purity];
      const makingChargesPercent = parseFloat(makingCharges) / 100;
      
      let basePrice;
      if (metalType === 'gold') {
        basePrice = rates.gold.pricePerGram * weightInGrams * purityMultiplier;
      } else {
        basePrice = rates.silver.pricePerGram * weightInGrams * purityMultiplier;
      }
      
      const makingChargesAmount = basePrice * makingChargesPercent;
      const totalPrice = basePrice + makingChargesAmount;
      
      setCalculatedPrice({
        basePrice,
        makingCharges: makingChargesAmount,
        totalPrice,
        weightInGrams,
        ratePerGram: metalType === 'gold' ? rates.gold.pricePerGram : rates.silver.pricePerGram,
        metalType,
        purity
      });
      
      setError(null);
    } catch (err) {
      setError('Error calculating price. Please check your inputs.');
      console.error('Calculation error:', err);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const formatWeight = (weight) => {
    return weight.toFixed(3);
  };

  const handleReset = () => {
    setWeight('');
    setPurity('24K');
    setMakingCharges('15');
    setCalculatedPrice(null);
    setError(null);
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
            Jewelry Price Calculator
          </Typography>
          <Button
            startIcon={<RefreshIcon />}
            onClick={fetchRates}
            disabled={loading}
            variant="outlined"
            size="small"
          >
            Refresh Rates
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!rates && !loading && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Unable to fetch current metal rates. Please refresh.
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Input Fields */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Metal Type</InputLabel>
              <Select
                value={metalType}
                label="Metal Type"
                onChange={(e) => setMetalType(e.target.value)}
              >
                <MenuItem value="gold">Gold</MenuItem>
                <MenuItem value="silver">Silver</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <FormControl sx={{ minWidth: 80 }}>
                      <Select
                        value={weightUnit}
                        onChange={(e) => setWeightUnit(e.target.value)}
                        size="small"
                      >
                        <MenuItem value="grams">grams</MenuItem>
                        <MenuItem value="ounces">oz</MenuItem>
                        <MenuItem value="tolas">tolas</MenuItem>
                        <MenuItem value="carats">carats</MenuItem>
                      </Select>
                    </FormControl>
                  </InputAdornment>
                )
              }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Purity</InputLabel>
              <Select
                value={purity}
                label="Purity"
                onChange={(e) => setPurity(e.target.value)}
              >
                {Object.keys(purityOptions).map((p) => (
                  <MenuItem key={p} value={p}>
                    {p} ({purityOptions[p] * 100}% pure)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Making Charges (%)"
              type="number"
              value={makingCharges}
              onChange={(e) => setMakingCharges(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<CalculateIcon />}
                onClick={calculatePrice}
                disabled={!rates || !weight || !purity}
                fullWidth
              >
                Calculate Price
              </Button>
              <Button
                variant="outlined"
                onClick={handleReset}
                fullWidth
              >
                Reset
              </Button>
            </Box>
          </Grid>

          {/* Results */}
          <Grid item xs={12} md={6}>
            {calculatedPrice ? (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                  Price Breakdown
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Current Rate: {formatPrice(calculatedPrice.ratePerGram)} per gram
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Weight: {formatWeight(calculatedPrice.weightInGrams)} grams
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Base Price:</Typography>
                    <Typography fontWeight="bold">
                      {formatPrice(calculatedPrice.basePrice)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Making Charges ({makingCharges}%):</Typography>
                    <Typography fontWeight="bold">
                      {formatPrice(calculatedPrice.makingCharges)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight="bold">
                      Total Price:
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      {formatPrice(calculatedPrice.totalPrice)}
                    </Typography>
                  </Box>
                </Box>

                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="caption">
                    * Prices are based on current market rates and may vary.
                    <br />
                    * Making charges are estimates and may differ by jeweler.
                  </Typography>
                </Alert>
              </Box>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                minHeight: 200,
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 1
              }}>
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  Fill in the details and click Calculate to see the price breakdown
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MetalCalculator;
