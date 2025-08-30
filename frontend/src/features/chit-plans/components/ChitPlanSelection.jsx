import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Paper, 
  useMediaQuery, 
  useTheme,
} from '@mui/material';
import ChitPlanCard from './ChitPlanCard';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '../../cart/CartSlice';
import authSlice from '../../auth/AuthSlice';

// Example plans array (replace with your actual data or props)
const plans = [
  { id: 1, name: 'Basic Plan', description: 'Basic monthly plan.' },
  { id: 2, name: 'Standard Plan', description: 'Standard monthly plan.' },
  { id: 3, name: 'Premium Plan', description: 'Premium monthly plan.' },
];

const ChitPlanSelection = () => {
  const [selectedPlan, setSelectedPlan] = useState(2); // Default to Standard plan
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleContinue = () => {
    if (selectedPlan) {
      navigate(`/chit-plans/summary?plan=${selectedPlan}`);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Box textAlign="center" mb={{ xs: 4, md: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '2.75rem' },
              lineHeight: 1.2,
              mb: 2,
              background: 'linear-gradient(90deg, #3f51b5 0%, #9c27b0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Start Your Jewelry Savings Journey
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            maxWidth="800px" 
            mx="auto"
          >
            Choose a chit plan that fits your needs and start saving for your dream jewelry!
          </Typography>
        </motion.div>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 6 }}>
        <Grid container spacing={isMobile ? 2 : 4} justifyContent="center">
          {plans.map((plan) => (
            <Grid item xs={12} sm={6} md={4} key={plan.id}>
              <ChitPlanCard
                plan={plan}
                isSelected={selectedPlan === plan.id}
                onSelect={() => handlePlanSelect(plan.id)}
              />
            </Grid>
          ))}
        </Grid>
        
        <Box mt={6} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleContinue}
            disabled={!selectedPlan}
            sx={{
              px: 6,
              py: 1.5,
              fontSize: '1.1rem',
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4,
              },
            }}
          >
            Start Plan
          </Button>
        </Box>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          How Our Chit Plan Works
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary">1. Choose Your Plan</Typography>
            <Typography variant="body1">
              Select from our flexible monthly investment plans that suit your budget and jewelry goals.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary">2. Make Monthly Payments</Typography>
            <Typography variant="body1">
              Pay your fixed monthly amount. Your savings grow with each payment.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary">3. Redeem for Jewelry</Typography>
            <Typography variant="body1">
              Use your accumulated amount to purchase beautiful jewelry from our collection.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ChitPlanSelection;
