import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { axiosi } from '../../../config/axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(4),
}));

const PaymentSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

const steps = ['Plan Details', 'Payment Method', 'Payment Gateway', 'Confirmation'];

const ChitPlanPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [startDate, setStartDate] = useState(dayjs());
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState(null);
  const [paymentOrder, setPaymentOrder] = useState(null);

  useEffect(() => {
    // Redirect if no plan selected
    const searchParams = new URLSearchParams(location.search);
    const planId = searchParams.get('plan');
    
    if (!planId || !['1', '2', '3'].includes(planId)) {
      navigate('/chit-plans');
      return;
    }
    
    setPlan(parseInt(planId, 10));
  }, [location.search, navigate]);

  const planDetails = {
    1: { 
      name: 'Basic Plan', 
      amount: 1000, 
      duration: '12 months',
      features: ['₹1000 monthly investment', 'Total Savings: ₹12,000', 'Eligible for jewelry up to ₹15,000', 'Priority customer support']
    },
    2: { 
      name: 'Standard Plan', 
      amount: 2500, 
      duration: '12 months',
      features: ['₹2,500 monthly investment', 'Total Savings: ₹30,000', 'Eligible for jewelry up to ₹40,000', 'Priority customer support', '5% discount on making charges']
    },
    3: { 
      name: 'Premium Plan', 
      amount: 5000, 
      duration: '12 months',
      features: ['₹5,000 monthly investment', 'Total Savings: ₹60,000', 'Eligible for jewelry up to ₹80,000', '24/7 Priority support', '7% discount on making charges', 'Free annual jewelry cleaning']
    },
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      return;
    }
    
    if (activeStep === 0) {
      if (!acceptedTerms) {
        setError('Please accept the terms and conditions to continue');
        return;
      }
      setError('');
    }
    
    if (activeStep === 1) {
      if (paymentMethod === 'razorpay') {
        handleRazorpayPayment();
        return;
      }
    }
    
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleRazorpayPayment = async () => {
    if (!acceptedTerms) {
      setError('Please accept the terms and conditions to continue');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Creating payment order for plan:', plan);
      console.log('User ID:', user._id);
      console.log('API URL:', '/chit-plans/create-payment-order');
      
      // Create payment order on your backend
      const response = await axiosi.post('/chit-plans/create-payment-order', {
        planId: plan,
        planName: planDetails[plan].name,
        amount: planDetails[plan].amount * 12, // Total amount for 12 months
        userId: user._id,
        startDate: startDate.toISOString(),
      });

      console.log('Payment order response:', response.data);

      if (response.data.success) {
        setPaymentOrder(response.data.order);
        
        // Initialize Razorpay
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_HERE',
          amount: response.data.order.amount * 100, // Razorpay expects amount in paise
          currency: 'INR',
          name: 'Your Company Name',
          description: `${planDetails[plan].name} - Chit Plan`,
          order_id: response.data.order.razorpayOrderId,
          handler: function (response) {
            handlePaymentSuccess(response);
          },
          prefill: {
            name: user.name || user.email,
            email: user.email,
            contact: user.phone || ''
          },
          theme: {
            color: '#1976d2'
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        throw new Error(response.data.message || 'Failed to create payment order');
      }
    } catch (err) {
      console.error('Payment error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
        url: err.config?.url,
        method: err.config?.method
      });
      
      if (err.response?.status === 404) {
        setError('Payment service not found. Please check if the backend server is running.');
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.message || 'Payment initialization failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentResponse) => {
    try {
      // Verify payment with your backend
      const verifyResponse = await axiosi.post('/chit-plans/verify-payment', {
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        orderId: paymentOrder._id,
        planId: plan,
        userId: user._id,
      });

      if (verifyResponse.data.success) {
        setActiveStep(3); // Move to confirmation step
      } else {
        throw new Error(verifyResponse.data.message || 'Payment verification failed');
      }
    } catch (err) {
      setError('Payment verification failed. Please contact support.');
      console.error('Payment verification error:', err);
    }
  };

  const renderPlanDetails = () => (
    <PaymentSection>
      <Typography variant="h6" gutterBottom>Plan Summary</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                {planDetails[plan]?.name}
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary">
                ₹{planDetails[plan]?.amount.toLocaleString()}
                <Typography component="span" variant="body2" color="text.secondary">
                  /month
                </Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Duration: {planDetails[plan]?.duration}
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                Total: ₹{(planDetails[plan]?.amount * 12).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Plan Features</Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {planDetails[plan]?.features.map((feature, index) => (
              <Typography key={index} component="li" variant="body2" sx={{ mb: 1 }}>
                {feature}
              </Typography>
            ))}
          </Box>
        </Grid>
      </Grid>
      
      <Box mt={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="normal" />
            )}
            disablePast
          />
        </LocalizationProvider>
      </Box>
    </PaymentSection>
  );

  const renderPaymentMethod = () => (
    <PaymentSection>
      <Typography variant="h6" gutterBottom>Choose Payment Method</Typography>
      <RadioGroup
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <FormControlLabel
          value="razorpay"
          control={<Radio />}
          label={
            <Box>
              <Typography variant="body1" fontWeight="medium">
                Credit/Debit Card, UPI, Net Banking
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Secure payment via Razorpay
              </Typography>
            </Box>
          }
        />
      </RadioGroup>
    </PaymentSection>
  );

  const renderPaymentGateway = () => (
    <PaymentSection>
      <Box textAlign="center" py={4}>
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Processing Payment...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please complete the payment in the popup window
        </Typography>
      </Box>
    </PaymentSection>
  );

  const renderConfirmation = () => (
    <PaymentSection>
      <Box textAlign="center" py={4}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'success.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="white" />
          </svg>
        </Box>
        <Typography variant="h5" gutterBottom>Payment Successful!</Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Thank you for subscribing to our {planDetails[plan]?.name}.
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Your membership is now active. You can start using your benefits immediately.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/user-dashboard')}
          sx={{ mt: 3 }}
        >
          Go to Dashboard
        </Button>
      </Box>
    </PaymentSection>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderPlanDetails();
      case 1:
        return renderPaymentMethod();
      case 2:
        return renderPaymentGateway();
      case 3:
        return renderConfirmation();
      default:
        return null;
    }
  };

  if (!plan) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Complete Your Chit Plan Enrollment
      </Typography>
      
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <StyledPaper>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {getStepContent(activeStep)}

        {/* Terms and Conditions Checkbox - Always Visible */}
        <Box sx={{ mt: 4, p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper' }}>
          <FormControlLabel
            control={
              <Checkbox 
                checked={acceptedTerms} 
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                I agree to the{' '}
                <Typography 
                  component="span" 
                  variant="body2" 
                  color="primary" 
                  sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={() => window.open('/terms-and-conditions', '_blank')}
                >
                  Terms and Conditions
                </Typography>
                {' '}and confirm that I have reviewed the plan details. I understand that this is a 12-month commitment and payments will be processed monthly.
              </Typography>
            }
            sx={{ alignItems: 'flex-start' }}
          />
        </Box>

        {activeStep !== steps.length - 1 && activeStep !== 2 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }} disabled={loading}>
                Back
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading || !acceptedTerms}
              endIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {activeStep === steps.length - 2 ? 'Complete Payment' : 'Next'}
            </Button>
          </Box>
        )}
      </StyledPaper>
    </Container>
  );
};

export default ChitPlanPayment;
