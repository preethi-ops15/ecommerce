import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Stack, IconButton, keyframes, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export const LandingSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, isMobile ? 100 : 300);
    return () => clearTimeout(timer);
  }, [isMobile]);

  // Enhanced shine effect animation
  const shineAnimation = keyframes`
    0% {
      transform: translateX(-100%) skewX(-25deg);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translateX(100vw) skewX(-25deg);
      opacity: 0;
    }
  `;

  // Dancing arrow animation
  const bounceAnimation = keyframes`
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  `;

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '80vh', sm: '70vh', md: '100vh' },
        minHeight: { xs: '500px', sm: '600px' },
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
        boxShadow: 2,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `url('/silver-bar.jpg.png') center/cover no-repeat`,
          border: { xs: '1px solid #e0e0e0', sm: '1px solid #e0e0e0', md: '1px solid #e0e0e0' },
          borderRadius: { xs: '24px', sm: '32px', md: '40px' },
          boxSizing: 'border-box',
          zIndex: 0,
        }
      }}
    >
      {/* Enhanced shine effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '-200px',
          width: '200px',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), #C0C0C0 40%, rgba(255,255,255,0.7), transparent)',
          animation: `${shineAnimation} 4s ease-in-out infinite`,
          zIndex: 1,
          transform: 'skewX(-25deg)',
        }}
      />
      
      {/* Additional sparkle effects */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 20% 30%, rgba(192,192,192,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.12) 0%, transparent 50%)',
          animation: 'pulse 3s ease-in-out infinite alternate',
          zIndex: 1,
        }}
      />
      
      {/* Overlay for readability */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0,0,0,0.25)',
          zIndex: 2,
        }}
      />
      <Stack
        spacing={2}
        sx={{
          position: 'relative',
          zIndex: 3,
          alignItems: 'center',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={isLoaded ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: isMobile ? 0.6 : 1, ease: "easeOut" }}
        >
          <Typography 
            variant="h1" 
            fontWeight={700} 
            sx={{ 
              color: '#ffffff !important',
              textShadow: '0 4px 12px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4)',
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
              mb: { xs: 1, md: 2 },
              filter: 'brightness(1.2)',
              WebkitTextStroke: 'none',
              WebkitTextFillColor: '#ffffff',
              textStroke: 'none',
              border: 'none',
              outline: 'none'
            }}
          >
            Pure Silver. Pure Brilliance.
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={isLoaded ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: isMobile ? 0.6 : 1, delay: isMobile ? 0.15 : 0.3, ease: "easeOut" }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              maxWidth: { xs: '90%', sm: 700 },
              color: '#ffffff !important',
              textShadow: '0 4px 10px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4)',
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
              mb: { xs: 2, md: 3 },
              fontWeight: 400,
              filter: 'brightness(1.1)',
              WebkitTextStroke: 'none',
              WebkitTextFillColor: '#ffffff',
              textStroke: 'none',
              border: 'none',
              outline: 'none'
            }}
          >
            Discover exquisite handcrafted silver jewelry and flexible ownership plans.
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={isLoaded ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: isMobile ? 0.6 : 1, delay: isMobile ? 0.3 : 0.6, ease: "easeOut" }}
        >
          <Button
            variant="contained"
            color="primary"
            size={isMobile ? "medium" : "large"}
            sx={{ 
              mt: { xs: 1, md: 2 },
              fontWeight: 600, 
              px: { xs: 4, md: 6 },
              py: { xs: 1, md: 1.5 },
              borderRadius: 25,
              fontSize: { xs: '1rem', md: '1.1rem' },
              minWidth: { xs: '180px', md: '220px' }
            }}
            onClick={() => navigate('/shop')}
          >
            Shop Now
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: isMobile ? 0.45 : 0.9 }}
          style={{ marginTop: isMobile ? '1.5rem' : '2.5rem' }}
          onClick={scrollToContent}
        >
          <IconButton 
            sx={{ 
              animation: `${bounceAnimation} 2s ease infinite`,
              color: 'white',
              fontSize: isMobile ? '2rem' : '3rem'
            }}
          >
            <KeyboardArrowDownIcon fontSize="inherit" />
          </IconButton>
        </motion.div>
      </Stack>
    </Box>
  );
};
