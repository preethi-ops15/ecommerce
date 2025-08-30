import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Stack, MenuItem, Select, InputLabel, FormControl, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const chitPlans = [
  {
    id: 1,
    amount: 1000,
    duration: 10,
    title: "Silver Starter",
    description: "Perfect for beginners to start their silver investment journey",
    features: [
      "Monthly ₹1,000 contribution",
      "Basic silver ornaments",
      "10-month duration",
      "5% member discount"
    ],
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
    popular: false,
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 2,
    amount: 2500,
    duration: 10,
    title: "Silver Elite",
    description: "Most popular plan with excellent silver ornament options",
    features: [
      "Monthly ₹2,500 contribution",
      "Premium silver ornaments",
      "10-month duration",
      "10% member discount"
    ],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop",
    popular: true,
    color: "from-accent to-yellow-500"
  },
  {
    id: 3,
    amount: 5000,
    duration: 10,
    title: "Silver Premium",
    description: "Luxury plan for exquisite silver jewelry collections",
    features: [
      "Monthly ₹5,000 contribution",
      "Luxury silver collections",
      "10-month duration",
      "15% member discount"
    ],
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=300&fit=crop",
    popular: false,
    color: "from-purple-500 to-purple-600"
  }
];

export const ChitPlanPage = () => {
  const [selected, setSelected] = useState(chitPlans[0].id);
  const plan = chitPlans.find(p => p.id === selected);

  return (
    <Box sx={{ py: 8, background: 'linear-gradient(to bottom, #ffffff, #f9fafb)' }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
            Choose Your Chit Plan
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Select from our three fixed chit plans designed to match your investment goals and silver dreams
          </Typography>
        </Box>
        <Grid container spacing={4} alignItems="flex-start">
          {/* Calculator */}
          <Grid item xs={12} md={5}>
            <Paper elevation={4} sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 4,
              background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
              boxShadow: '0 8px 32px rgba(33,150,243,0.12)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minHeight: 380,
              mb: { xs: 4, md: 0 },
              fontFamily: 'inherit'
            }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                <img src="/calculator.png" alt="Calculator" style={{ width: 56, height: 56, borderRadius: '50%', boxShadow: '0 2px 8px rgba(33,150,243,0.15)', background: '#fff', padding: 8 }} />
              </Box>
              <Typography variant="h5" fontWeight={800} mb={3} align="center" color="#fff" letterSpacing={1}>Chit Plan Calculator</Typography>
              <Stack spacing={3} sx={{ width: '100%' }}>
                <FormControl fullWidth variant="filled" sx={{ mt: 1 }}>
                  <InputLabel id="chit-plan-select-label" sx={{ color: '#fff', fontWeight: 600, fontFamily: 'inherit', '&.Mui-focused': { color: '#fff' } }}>Select Plan</InputLabel>
                  <Select
                    labelId="chit-plan-select-label"
                    value={selected}
                    label="Select Plan"
                    onChange={e => setSelected(Number(e.target.value))}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.08)',
                      borderRadius: 2,
                      fontWeight: 600,
                      color: '#fff',
                      fontFamily: 'inherit',
                      '.MuiSelect-icon': { color: '#fff' },
                      '.MuiOutlinedInput-notchedOutline': { border: 0 },
                      '& .MuiMenuItem-root': { color: '#fff', bgcolor: '#232526', fontFamily: 'inherit' },
                      '& .MuiMenuItem-root.Mui-selected': { bgcolor: '#333', color: '#fff' },
                      '& .MuiMenuItem-root:hover': { bgcolor: '#414345', color: '#fff' }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          fontFamily: 'inherit',
                          bgcolor: '#232526',
                          color: '#fff',
                          borderRadius: 2,
                          boxShadow: '0 4px 24px rgba(33,150,243,0.12)'
                        }
                      }
                    }}
                  >
                    {chitPlans.map(p => (
                      <MenuItem value={p.id} key={p.id} sx={{ fontFamily: 'inherit', color: '#fff', bgcolor: 'transparent', '&.Mui-selected': { bgcolor: '#333', color: '#fff' }, '&:hover': { bgcolor: '#414345', color: '#fff' } }}>{p.title} ({`₹${p.amount}/month`})</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                  <Box sx={{
                    bgcolor: '#fff',
                    color: '#232526',
                    px: 3, py: 1, borderRadius: 2, fontWeight: 700, fontSize: '1.1rem',
                    boxShadow: '0 2px 8px rgba(33,150,243,0.10)',
                    mb: 1, minWidth: 120, textAlign: 'center', opacity: 1
                  }}>
                    Duration<br /><span style={{ fontSize: '1.2em' }}>{plan.duration} months</span>
                  </Box>
                  <Box sx={{
                    bgcolor: '#fff',
                    color: '#ab47bc',
                    px: 3, py: 1, borderRadius: 2, fontWeight: 700, fontSize: '1.1rem',
                    boxShadow: '0 2px 8px rgba(171,71,188,0.10)',
                    mb: 1, minWidth: 120, textAlign: 'center', opacity: 1
                  }}>
                    Total Savings<br /><span style={{ fontSize: '1.2em' }}>₹{plan.amount * plan.duration}</span>
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </Grid>
          {/* Selected Plan Card */}
          <Grid item xs={12} md={7}>
            <Card 
              sx={{ 
                position: 'relative',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                border: plan.popular ? '2px solid #ffe9b3' : '1px solid #e0e0e0',
                maxWidth: 420,
                mx: 'auto'
              }}
            >
              {plan.popular && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: 'primary.main',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    zIndex: 1
                  }}
                >
                  Most Popular
                </Box>
              )}
              <Box
                sx={{
                  height: 220,
                  position: 'relative',
                  background: plan.id === 1
                    ? `linear-gradient(135deg, #2196f3 0%, #1565c0 100%), url('${plan.image}')`
                    : plan.id === 2
                    ? `linear-gradient(135deg, #ffb300 0%, #ff7043 100%), url('${plan.image}')`
                    : `linear-gradient(135deg, #ab47bc 0%, #7e57c2 100%), url('${plan.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundBlendMode: 'overlay',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ textAlign: 'center', zIndex: 2, position: 'relative' }}>
                  <Typography 
                    variant="h3" 
                    fontWeight={800} 
                    sx={{ 
                      mb: 1,
                      color: '#ffffff !important',
                      textShadow: '0 6px 12px rgba(0,0,0,0.9), 0 3px 8px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.5)',
                      filter: 'brightness(1.3) contrast(1.1)',
                      WebkitTextStroke: 'none',
                      WebkitTextFillColor: '#ffffff',
                      textStroke: 'none',
                      border: 'none',
                      outline: 'none'
                    }}
                  >
                    ₹{plan.amount.toLocaleString()}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#ffffff !important',
                      fontWeight: 600,
                      textShadow: '0 4px 8px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.5)',
                      filter: 'brightness(1.2)',
                      WebkitTextStroke: 'none',
                      WebkitTextFillColor: '#ffffff',
                      textStroke: 'none',
                      border: 'none',
                      outline: 'none'
                    }}
                  >
                    per month
                  </Typography>
                </Box>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
                  {plan.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {plan.description}
                </Typography>
                <Stack spacing={1.5} sx={{ mb: 3 }}>
                  {plan.features.map((feature, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                      <Typography variant="body2" color="text.secondary">{feature}</Typography>
                    </Box>
                  ))}
                </Stack>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #1a1a1a 30%, #333333 90%)',
                    color: 'white',
                    boxShadow: '0 4px 8px 2px rgba(26, 26, 26, .4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #000000 30%, #1a1a1a 90%)',
                      boxShadow: '0 6px 12px 2px rgba(26, 26, 26, .5)',
                    }
                  }}
                  onClick={() => window.location.href = `/checkout?planId=${plan.id}&amount=${plan.amount}`}
                >
                  Start This Plan
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      {/* Add extra spacing between sections */}
      <Box sx={{ height: { xs: 32, md: 48 } }} />
      {/* Enhanced Step-by-Step Instructions Section */}
      <Box sx={{ mt: 8, mb: 6, background: 'linear-gradient(135deg, #e3f0ff 0%, #fbeaff 100%)', borderRadius: 4, py: { xs: 4, md: 6 }, px: { xs: 2, md: 6 } }}>
        <Typography variant="h4" fontWeight={700} align="center" sx={{ mb: 4, color: 'primary.main', letterSpacing: 1 }}>
          How Our Chit Plan Works
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            {
              icon: <CheckCircleIcon sx={{ fontSize: 44, color: '#2196f3', background: 'white', borderRadius: '50%', p: 1, boxShadow: '0 2px 8px rgba(33,150,243,0.10)' }} />, title: 'Choose a Plan',
              desc: 'Select a chit plan that matches your monthly savings and jewelry goals.'
            },
            {
              icon: <ArrowForwardIcon sx={{ fontSize: 44, color: '#ffb300', background: 'white', borderRadius: '50%', p: 1, boxShadow: '0 2px 8px rgba(255,183,0,0.10)' }} />, title: 'Save Monthly',
              desc: 'Contribute your chosen amount every month for the plan duration.'
            },
            {
              icon: <CheckCircleIcon sx={{ fontSize: 44, color: '#ab47bc', background: 'white', borderRadius: '50%', p: 1, boxShadow: '0 2px 8px rgba(171,71,188,0.10)' }} />, title: 'Get Silver Jewelry',
              desc: 'At the end, redeem your savings for beautiful silver jewelry with member discounts.'
            }
          ].map((step, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center', height: '100%', background: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 24px rgba(33,150,243,0.08)' }}>
                <Box sx={{ mb: 2 }}>{step.icon}</Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: 'primary.main' }}>{step.title}</Typography>
                <Typography variant="body2" color="text.secondary">{step.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ height: { xs: 32, md: 48 } }} />
      {/* Enhanced Chit Plan Details Section */}
      <Box sx={{ mt: 8, mb: 6, background: 'linear-gradient(135deg, #fbeaff 0%, #e3f0ff 100%)', borderRadius: 4, py: { xs: 4, md: 6 }, px: { xs: 2, md: 6 } }}>
        <Typography variant="h4" fontWeight={700} align="center" sx={{ mb: 4, color: 'primary.main', letterSpacing: 1 }}>
          Chit Plan Details
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {chitPlans.map((plan, idx) => (
            <Grid item xs={12} md={4} key={plan.id}>
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center', height: '100%', background: 'rgba(255,255,255,0.97)', boxShadow: '0 4px 24px rgba(171,71,188,0.08)' }}>
                <Box sx={{ mb: 2 }}>
                  <CheckCircleIcon sx={{ fontSize: 36, color: idx === 0 ? '#2196f3' : idx === 1 ? '#ffb300' : '#ab47bc', background: 'white', borderRadius: '50%', p: 1, boxShadow: '0 2px 8px rgba(33,150,243,0.10)' }} />
                </Box>
                <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ mb: 1 }}>{plan.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{plan.description}</Typography>
                <Stack spacing={1.5} sx={{ mb: 2 }}>
                  {plan.features.map((feature, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                      <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                      <Typography variant="body2" color="text.secondary">{feature}</Typography>
                    </Box>
                  ))}
                </Stack>
                <Typography variant="subtitle1" fontWeight={700} color="secondary.main">
                  ₹{plan.amount} x {plan.duration} months = ₹{plan.amount * plan.duration}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      {/* Add extra spacing between sections */}
      <Box sx={{ height: { xs: 32, md: 48 } }} />
    </Box>
  );
};