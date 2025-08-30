import React from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import { MetalRatesWidget, MetalCalculator } from './index';

const MetalRatesPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
          Live Metal Rates & Calculator
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Get real-time gold and silver prices and calculate jewelry costs with our advanced calculator
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Metal Rates Widget */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <MetalRatesWidget />
          </Paper>
        </Grid>

        {/* Metal Calculator */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <MetalCalculator />
          </Paper>
        </Grid>
      </Grid>

      {/* Information Section */}
      <Box sx={{ mt: 6 }}>
        <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            About Our Metal Rates
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" paragraph>
                <strong>Real-time Updates:</strong> Our rates are updated every 5 minutes from reliable sources 
                including metals.live and CoinGecko APIs to ensure accuracy.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Multiple Sources:</strong> We use multiple data sources to provide reliable rates 
                even if one service is temporarily unavailable.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" paragraph>
                <strong>Price Calculator:</strong> Calculate jewelry prices based on current market rates, 
                weight, purity, and making charges.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Multiple Units:</strong> Support for grams, ounces, tolas, and carats with 
                automatic conversion to grams for accurate calculations.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default MetalRatesPage;
