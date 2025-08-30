import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Typography, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Stack,
  Card,
  Grid,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Calculate,
  TrendingUp,
  CheckCircle,
  Lock,
  CardGiftcard,
  Check,
  Star,
  CalendarMonth,
  AccountBalanceWallet,
  LocalOffer,
  ArrowForward
} from '@mui/icons-material';

const BenefitsCalculator = () => {
  const [selectedPlan, setSelectedPlan] = useState(2500);
  const [isVisible, setIsVisible] = useState(false);
  const [animateResults, setAnimateResults] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setAnimateResults(true), 500);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('calculator');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const fixedPlans = [
    { value: 1000, label: 'Silver Starter - ₹1,000/month', discount: 5, duration: 10 },
    { value: 2500, label: 'Silver Elite - ₹2,500/month', discount: 10, duration: 10 },
    { value: 5000, label: 'Silver Premium - ₹5,000/month', discount: 15, duration: 10 }
  ];

  const currentPlan = fixedPlans.find(plan => plan.value === selectedPlan);
  const totalSavings = selectedPlan * currentPlan.duration;
  const memberDiscount = totalSavings * (currentPlan.discount / 100);
  const silverPurchasingPower = totalSavings + memberDiscount;

  const calculations = [
    {
      label: "Monthly Contribution",
      value: selectedPlan,
      icon: <CalendarMonth />,
      color: "primary.main"
    },
    {
      label: "Total Savings (10 months)",
      value: totalSavings,
      icon: <AccountBalanceWallet />,
      color: "success.main"
    },
    {
      label: `Member Discount (${currentPlan.discount}%)`,
      value: memberDiscount,
      icon: <LocalOffer />,
      color: "warning.main"
    },
    {
      label: "Silver Purchasing Power",
      value: silverPurchasingPower,
      icon: <TrendingUp />,
      color: "success.main"
    }
  ];

  const silverItems = [
    {
      name: "Silver Earrings",
      price: 15000,
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop",
      available: silverPurchasingPower >= 15000
    },
    {
      name: "Silver Necklace",
      price: 30000,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop",
      available: silverPurchasingPower >= 30000
    },
    {
      name: "Silver Jewelry Set",
      price: 50000,
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&h=200&fit=crop",
      available: silverPurchasingPower >= 50000
    }
  ];

  return (
    <Box 
      id="calculator" 
      sx={{ 
        py: { xs: 6, md: 10 },
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 4 } }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 8 } }}>
            <Typography 
              variant={isMobile ? "h4" : "h3"} 
              component="h2" 
              fontWeight={700} 
              sx={{ 
                mb: { xs: 1, md: 2 },
                color: 'primary.main'
              }}
            >
              Calculate Your Silver Investment
            </Typography>
            <Typography 
              variant={isMobile ? "body1" : "h6"} 
              color="text.secondary" 
              sx={{ 
                maxWidth: '600px', 
                mx: 'auto',
                px: { xs: 2, sm: 0 }
              }}
            >
              Choose from our fixed chit plans and discover your silver purchasing power
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="flex-start">
          {/* Calculator Input */}
          <Grid item xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card sx={{ 
                p: { xs: 3, md: 4 }, 
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                backgroundColor: 'white'
              }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <Box sx={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Calculate sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h5" fontWeight={600}>
                    Fixed Chit Plans
                  </Typography>
                </Stack>

                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel>Select Your Plan</InputLabel>
                    <Select
                      value={selectedPlan}
                      onChange={(e) => setSelectedPlan(Number(e.target.value))}
                      label="Select Your Plan"
                    >
                      {fixedPlans.map((plan) => (
                        <MenuItem key={plan.value} value={plan.value}>
                          {plan.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Fixed 10-month duration for all plans
                    </Typography>
                  </FormControl>

                  {/* Calculation Results */}
                  <Stack spacing={2}>
                    {calculations.map((calc, index) => (
                      <motion.div
                        key={calc.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={animateResults ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card sx={{ 
                          p: 2, 
                          bgcolor: 'grey.50',
                          border: '1px solid',
                          borderColor: 'grey.200'
                        }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box sx={{ color: calc.color }}>
                                {calc.icon}
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {calc.label}
                              </Typography>
                            </Stack>
                            <Typography variant="h6" fontWeight={700} sx={{ color: calc.color }}>
                              ₹{calc.value.toLocaleString()}
                            </Typography>
                          </Stack>
                        </Card>
                      </motion.div>
                    ))}
                  </Stack>

                  {/* Savings Comparison */}
                  <Card sx={{ 
                    p: 2, 
                    bgcolor: 'success.50',
                    border: '1px solid',
                    borderColor: 'success.200'
                  }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <TrendingUp sx={{ color: 'success.main' }} />
                      <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'success.main' }}>
                        Member Advantage
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      You save ₹{memberDiscount.toLocaleString()} with {currentPlan.discount}% member discount!
                    </Typography>
                  </Card>

                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      bgcolor: 'success.main',
                      color: 'white',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      py: 1.5,
                      '&:hover': {
                        bgcolor: 'success.dark'
                      }
                    }}
                    endIcon={<ArrowForward />}
                  >
                    Start This Plan
                  </Button>
                </Stack>
              </Card>
            </motion.div>
          </Grid>

          {/* Available Silver Items */}
          <Grid item xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Stack spacing={3}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Star sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h5" fontWeight={600}>
                    Available Silver Items
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  {silverItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={animateResults ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    >
                      <Card sx={{ 
                        p: 2,
                        bgcolor: item.available ? 'white' : 'grey.50',
                        border: '1px solid',
                        borderColor: item.available ? 'success.200' : 'grey.200',
                        opacity: item.available ? 1 : 0.6,
                        transition: 'all 0.3s ease'
                      }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box sx={{ 
                            width: 64, 
                            height: 64, 
                            borderRadius: 2,
                            overflow: 'hidden'
                          }}>
                            <img 
                              src={item.image} 
                              alt={item.name}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover' 
                              }}
                            />
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {item.name}
                            </Typography>
                            <Typography variant="h6" color="primary" fontWeight={700}>
                              ₹{item.price.toLocaleString()}
                            </Typography>
                          </Box>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            {item.available ? (
                              <>
                                <CheckCircle sx={{ color: 'success.main' }} />
                                <Typography variant="body2" fontWeight={500} sx={{ color: 'success.main' }}>
                                  Available
                                </Typography>
                              </>
                            ) : (
                              <>
                                <Lock sx={{ color: 'grey.400' }} />
                                <Typography variant="body2" sx={{ color: 'grey.400' }}>
                                  Locked
                                </Typography>
                              </>
                            )}
                          </Stack>
                        </Stack>
                      </Card>
                    </motion.div>
                  ))}
                </Stack>

                {/* Additional Benefits */}
                <Card sx={{ 
                  p: 3, 
                  bgcolor: 'primary.50',
                  border: '1px solid',
                  borderColor: 'primary.200'
                }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <CardGiftcard sx={{ color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight={600}>
                      Member Benefits
                    </Typography>
                  </Stack>
                  <Stack spacing={1}>
                    {[
                      `${currentPlan.discount}% discount on all silver purchases`,
                      "Free home delivery & insurance",
                      "Lifetime authenticity guarantee",
                      "Priority access to new collections",
                      "Flexible payment options"
                    ].map((benefit, index) => (
                      <Stack key={index} direction="row" spacing={1} alignItems="center">
                        <Check sx={{ color: 'primary.main', fontSize: 16 }} />
                        <Typography variant="body2" color="text.secondary">
                          {benefit}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Card>
              </Stack>
            </motion.div>
          </Grid>
        </Grid>

        {/* Decorative Background Elements */}
        <Box sx={{
          position: 'absolute',
          top: 80,
          left: 80,
          width: 128,
          height: 128,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(156,39,176,0.05) 0%, rgba(156,39,176,0.1) 100%)',
          filter: 'blur(24px)',
          zIndex: -1
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: 80,
          right: 80,
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(76,175,80,0.05) 0%, rgba(76,175,80,0.1) 100%)',
          filter: 'blur(24px)',
          zIndex: -1
        }} />
      </Box>
    </Box>
  );
};

export { BenefitsCalculator }; 