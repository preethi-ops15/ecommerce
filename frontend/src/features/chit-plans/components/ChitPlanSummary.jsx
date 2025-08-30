import React, { useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { Box, Paper, Typography, Button, Grid, Divider, List, ListItem, ListItemText, Alert } from '@mui/material';

const planDetails = {
  1: { name: 'Basic Plan', amount: 1000, duration: '12 months', features: ['₹1000 monthly', 'Total ₹12,000', 'Eligible up to ₹15,000'] },
  2: { name: 'Standard Plan', amount: 2500, duration: '12 months', features: ['₹2,500 monthly', 'Total ₹30,000', 'Eligible up to ₹40,000', '5% making discount'] },
  3: { name: 'Premium Plan', amount: 5000, duration: '12 months', features: ['₹5,000 monthly', 'Total ₹60,000', 'Eligible up to ₹80,000', '7% making discount', 'Free cleaning'] },
};

const ChitPlanSummary = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const user = useSelector(selectLoggedInUser);

  const selectedPlanId = useMemo(() => {
    const params = new URLSearchParams(search);
    const id = parseInt(params.get('plan'), 10);
    return [1, 2, 3].includes(id) ? id : 2;
  }, [search]);

  const details = planDetails[selectedPlanId];

  useEffect(() => {
    if (!selectedPlanId) {
      navigate('/chit-plans');
    }
  }, [selectedPlanId, navigate]);

  const handleContinue = () => {
    if (!user) {
      // Redirect to login with return URL
      navigate(`/login?redirect=/chit-plans/payment?plan=${selectedPlanId}`);
      return;
    }
    
    navigate(`/chit-plans/payment?plan=${selectedPlanId}`);
  };

  return (
    <Box maxWidth="md" mx="auto" p={2}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          {details.name} Summary
        </Typography>
        <Typography color="text.secondary" paragraph>
          Review the details of your selected plan before proceeding to payment.
        </Typography>
        
        {!user && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Please log in to continue with the payment process.
          </Alert>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Plan Details</Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Monthly Amount" secondary={`₹${details.amount.toLocaleString()}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Duration" secondary={details.duration} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Total" secondary={`₹${(details.amount * 12).toLocaleString()}`} />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Benefits</Typography>
            <List dense>
              {details.features.map((f, i) => (
                <ListItem key={i}>
                  <ListItemText primary={f} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="text" onClick={() => navigate('/chit-plans')}>Back</Button>
          <Button 
            variant="contained" 
            onClick={handleContinue}
            disabled={!user}
          >
            {user ? 'Continue to Payment' : 'Login to Continue'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChitPlanSummary;


