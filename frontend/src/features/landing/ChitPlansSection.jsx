import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Box, Typography, Grid, Card, CardContent, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';

// Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SecurityIcon from '@mui/icons-material/Security';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';
import DiamondIcon from '@mui/icons-material/Diamond';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';

const ChitPlansSection = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: isMobile ? 0.1 : 0.3 }
    );

    const section = document.getElementById('chit-plans');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, [isMobile]);

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

  return (
    <Box id="chit-plans" sx={{ 
      py: { xs: 6, md: 10 },
      background: 'linear-gradient(180deg, #fff 60%, #f3f6fa 100%)' 
    }}>
      <Box sx={{ 
        maxWidth: '1200px', 
        mx: 'auto', 
        px: { xs: 2, sm: 3 }
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: isMobile ? 0.5 : 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 8 } }}>
            <Typography 
              variant={isMobile ? "h4" : "h3"} 
              component="h2" 
              fontWeight={700} 
              sx={{ mb: 2 }}
            >
              Choose Your Chit Plan
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
              Select from our three fixed chit plans designed to match your investment goals and silver dreams
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={isMobile ? 2 : 4}>
          {chitPlans.map((plan, index) => (
            <Grid item xs={12} sm={6} md={4} key={plan.id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: isMobile ? 0.5 : 0.8, 
                  delay: isMobile ? index * 0.1 : index * 0.2 
                }}
              >
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
                    '&:hover': { 
                      boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                      transform: 'translateY(-8px) scale(1.02)',
                    },
                    '@keyframes shimmer': {
                      '0%': {
                        backgroundPosition: '0% 50%'
                      },
                      '50%': {
                        backgroundPosition: '100% 50%'
                      },
                      '100%': {
                        backgroundPosition: '0% 50%'
                      }
                    }
                  }}
                  onClick={() => navigate(`/chit-plans/payment?plan=${plan.id}`)}
                >
                  {/* Popular Badge */}
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

                  {/* Plan Header with Background Image and Amount */}
                  <Box
                    sx={{
                      height: 220,
                      position: 'relative',
                      background: index === 0
                        ? `linear-gradient(135deg, #2196f3 0%, #1565c0 100%), url('${plan.image}')`
                        : index === 1
                        ? `linear-gradient(135deg, #ffb300 0%, #ff7043 100%), url('${plan.image}')`
                        : `linear-gradient(135deg, #ab47bc 0%, #7e57c2 100%), url('${plan.image}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundBlendMode: 'overlay',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      overflow: 'hidden',
                      transition: 'background 0.3s',
                      '&:hover': {
                        background: index === 0
                          ? `linear-gradient(135deg, #1976d2 0%, #0d47a1 100%), url('${plan.image}')`
                          : index === 1
                          ? `linear-gradient(135deg, #ffa000 0%, #f4511e 100%), url('${plan.image}')`
                          : `linear-gradient(135deg, #8e24aa 0%, #5e35b1 100%), url('${plan.image}')`,
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'transparent',
                        zIndex: 1
                      }
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

                  {/* Plan Content */}
                  <CardContent sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1 }}>
                    <Stack spacing={1.5} sx={{ mb: { xs: 2, sm: 3 } }}>
                      <Typography 
                        variant={isMobile ? "h5" : "h4"} 
                        fontWeight={700}
                        sx={{ 
                          background: `linear-gradient(to right, ${plan.color})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >
                        {plan.title}
                      </Typography>
                      
                      <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary">
                        {plan.description}
                      </Typography>
                      
                      <Box sx={{ 
                        height: '1px', 
                        width: '100%', 
                        bgcolor: 'divider', 
                        my: { xs: 1.5, sm: 2 } 
                      }}/>
                      
                      <Typography variant={isMobile ? "subtitle2" : "h6"} fontWeight={600}>
                        ₹{plan.amount.toLocaleString()} per month
                      </Typography>
                      
                      <Typography variant={isMobile ? "subtitle2" : "h6"} fontWeight={600}>
                        {plan.duration} months duration
                      </Typography>
                      
                      <Box sx={{ 
                        height: '1px', 
                        width: '100%', 
                        bgcolor: 'divider', 
                        my: { xs: 1.5, sm: 2 } 
                      }}/>
                      
                      <Typography variant={isMobile ? "subtitle2" : "h6"} fontWeight={600}>
                        Plan Features:
                      </Typography>
                      
                      {plan.features.map((feature, i) => (
                        <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                          <CheckCircleIcon sx={{ 
                            fontSize: isMobile ? '1rem' : '1.25rem', 
                            color: 'success.main', 
                            mt: '2px' 
                          }}/>
                          <Typography variant={isMobile ? "body2" : "body1"}>
                            {feature}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>

                    <Button
                      variant={plan.popular ? "contained" : "outlined"}
                      size={isMobile ? "medium" : "large"}
                      fullWidth
                      endIcon={<ArrowForwardIcon />}
                      onClick={(e) => { e.stopPropagation(); navigate(`/chit-plans/payment?plan=${plan.id}`); }}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: isMobile ? '0.875rem' : '1rem',
                        ...(plan.popular ? {
                          background: 'linear-gradient(45deg, #1a1a1a 30%, #333333 90%)',
                          color: 'white',
                          boxShadow: '0 4px 8px 2px rgba(26, 26, 26, .4)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #000000 30%, #1a1a1a 90%)',
                            boxShadow: '0 6px 12px 2px rgba(26, 26, 26, .5)',
                          }
                        } : {
                          borderColor: '#1a1a1a',
                          color: '#1a1a1a',
                          '&:hover': { 
                            background: 'linear-gradient(45deg, #1a1a1a 30%, #333333 90%)',
                            color: 'white',
                            borderColor: '#1a1a1a'
                          }
                        })
                      }}
                    >
                      Start This Plan
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* View All Plans button removed as requested */}

        {/* Additional Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: isMobile ? 0.5 : 0.8, delay: 0.8 }}
        >
          <Grid container spacing={isMobile ? 3 : 6} sx={{ mt: { xs: 4, md: 8 }, justifyContent: 'center' }}>
            {[
              {
                icon: <SecurityIcon sx={{ fontSize: isMobile ? 36 : 48, color: '#fff' }} />,
                bg: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
                shadow: '0 4px 16px rgba(33,150,243,0.15)',
                title: "Trusted Security",
                description: "Bank-level security for all transactions"
              },
              {
                icon: <DiamondIcon sx={{ fontSize: isMobile ? 36 : 48, color: '#fff' }} />,
                bg: 'linear-gradient(135deg, #ffb300 0%, #ff7043 100%)',
                shadow: '0 4px 16px rgba(255,183,0,0.15)',
                title: "Premium Silver",
                description: "Highest quality 92.5% pure silver"
              },
              {
                icon: <PeopleIcon sx={{ fontSize: isMobile ? 36 : 48, color: '#fff' }} />,
                bg: 'linear-gradient(135deg, #ab47bc 0%, #7e57c2 100%)',
                shadow: '0 4px 16px rgba(171,71,188,0.15)',
                title: "2500+ Members",
                description: "Join 2500+ members in our trusted chit fund community"
              }
            ].map((benefit, index) => (
              <Grid item xs={12} sm={6} md={4} key={benefit.title}>
                <Box sx={{
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.97)',
                  borderRadius: 4,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                  p: { xs: 3, sm: 4 },
                  mb: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minHeight: { xs: 200, sm: 220 }
                }}>
                  <Box sx={{
                    mb: { xs: 2, sm: 3 },
                    width: isMobile ? 64 : 80,
                    height: isMobile ? 64 : 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    background: benefit.bg,
                    boxShadow: benefit.shadow,
                    mb: 2
                  }}>{benefit.icon}</Box>
                  <Typography variant={isMobile ? "h6" : "h5"} fontWeight={700} sx={{ mb: 1, color: '#222' }}>
                    {benefit.title}
                  </Typography>
                  <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary">
                    {benefit.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Box>
    </Box>
  );
};

export { ChitPlansSection };
