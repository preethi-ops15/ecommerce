import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Container,
  Alert,
  Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const StoreDetailsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    investmentAmount: '',
    customAmount: '',
    message: ''
  });

  const [showCustomAmount, setShowCustomAmount] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'investmentAmount' && value === 'custom') {
      setShowCustomAmount(true);
    } else if (field === 'investmentAmount') {
      setShowCustomAmount(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.mobile || !formData.investmentAmount || !formData.message) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    if (formData.investmentAmount === 'custom' && !formData.customAmount) {
      setSnackbar({
        open: true,
        message: 'Please enter custom amount',
        severity: 'error'
      });
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        investmentAmount: formData.investmentAmount === 'custom' ? formData.customAmount : formData.investmentAmount,
        message: formData.message,
        createdAt: new Date().toISOString()
      };

      const response = await fetch('/api/queries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Message sent successfully! We will get back to you soon.',
          severity: 'success'
        });
        setFormData({
          name: '',
          email: '',
          mobile: '',
          investmentAmount: '',
          customAmount: '',
          message: ''
        });
        setShowCustomAmount(false);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to send message. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      py: { xs: 4, md: 6 }
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          fontWeight={700} 
          textAlign="center" 
          sx={{ 
            mb: { xs: 3, md: 5 },
            color: theme.palette.primary.main,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          Store Details & Contact Us
        </Typography>

        <Grid container spacing={{ xs: 2, md: 4 }}>
          {/* Store Information */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              height: '100%',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              backgroundColor: 'white'
            }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography 
                  variant="h4" 
                  fontWeight={700} 
                  sx={{ 
                    mb: 3,
                    color: theme.palette.primary.main,
                    fontSize: { xs: '1.5rem', md: '2rem' }
                  }}
                >
                  Jewells
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 4,
                    color: 'text.secondary',
                    fontStyle: 'italic',
                    fontSize: { xs: '1rem', md: '1.1rem' }
                  }}
                >
                  "Visibly Brilliant since 2000"
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>Address</Typography>
                      <Typography variant="body1" color="text.secondary">
                        123 Jewelry Street, ambatur <br />
                        Chennai, Tamil Nadu 600001<br />
                        India
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>Phone</Typography>
                      <Typography variant="body1" color="text.secondary">
                        +91 00 000 0000<br />
                        +91 00000 00000
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>Email</Typography>
                      <Typography variant="body1" color="text.secondary">
                        info@jewells.com<br />
                        support@jewells.com
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>Business Hours</Typography>
                      <Typography variant="body1" color="text.secondary">
                        Monday - Saturday: 10:00 AM - 8:00 PM<br />
                        Sunday: 11:00 AM - 6:00 PM
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Visit our store to explore our exclusive collection of diamond jewelry, 
                  gold ornaments, and precious stones. Our expert jewelers are here to 
                  help you find the perfect piece for every occasion.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              height: '100%',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              backgroundColor: 'white'
            }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography 
                  variant="h4" 
                  fontWeight={700} 
                  sx={{ 
                    mb: 3,
                    color: theme.palette.primary.main,
                    fontSize: { xs: '1.5rem', md: '2rem' }
                  }}
                >
                  Contact Us
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Full Name *"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        sx={{ mb: 2 }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email *"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        sx={{ mb: 2 }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Mobile Number *"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        required
                        sx={{ mb: 2 }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Investment Amount *</InputLabel>
                        <Select
                          value={formData.investmentAmount}
                          label="Investment Amount *"
                          onChange={(e) => handleInputChange('investmentAmount', e.target.value)}
                          required
                        >
                          <MenuItem value="1000">₹1,000</MenuItem>
                          <MenuItem value="2500">₹2,500</MenuItem>
                          <MenuItem value="5000">₹5,000</MenuItem>
                          <MenuItem value="custom">Custom Amount</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {showCustomAmount && (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Custom Amount *"
                          type="number"
                          value={formData.customAmount}
                          onChange={(e) => handleInputChange('customAmount', e.target.value)}
                          required
                          sx={{ mb: 2 }}
                          InputProps={{
                            startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
                          }}
                        />
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message *"
                        multiline
                        rows={4}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        required
                        sx={{ mb: 3 }}
                        placeholder="Tell us about your requirements..."
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        endIcon={<SendIcon />}
                        sx={{
                          py: 2,
                          borderRadius: 2,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          backgroundColor: theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StoreDetailsPage; 