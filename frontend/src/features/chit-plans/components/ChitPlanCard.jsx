import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Paper, 
  Divider, 
  CardMedia,
  CardActions,
  Chip,
  Tooltip,
  Zoom,
  Fade
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { CheckCircle, Star } from '@mui/icons-material';

const PlanCard = styled(Card)(({ theme, isSelected, isPopular }) => ({
  maxWidth: 350,
  margin: '0 auto',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  border: isSelected 
    ? `2px solid ${theme.palette.primary.main}` 
    : `1px solid ${theme.palette.grey[200]}`,
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  position: 'relative',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[10],
    '& .MuiCardMedia-root': {
      transform: 'scale(1.05)',
    },
  },
  '&.popular': {
    border: `2px solid ${theme.palette.warning.main}`,
    '&::before': {
      content: '"MOST POPULAR"',
      position: 'absolute',
      top: 12,
      right: -32,
      backgroundColor: theme.palette.warning.main,
      color: theme.palette.getContrastText(theme.palette.warning.main),
      padding: '4px 32px',
      transform: 'rotate(45deg)',
      fontSize: '0.7rem',
      fontWeight: 'bold',
      zIndex: 1,
      boxShadow: theme.shadows[2],
    },
  },
}));

const PriceTag = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 800,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  margin: '1rem 0',
  position: 'relative',
  display: 'inline-block',
  '&::before': {
    content: '"₹"',
    fontSize: '1.2rem',
    marginRight: '4px',
    verticalAlign: 'top',
    display: 'inline-block',
    marginTop: '0.4rem',
  },
  '&::after': {
    content: '"/month"',
    fontSize: '1rem',
    color: theme.palette.text.secondary,
    marginLeft: '4px',
    fontWeight: 'normal',
  },
}));

const FeatureList = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  padding: 0,
  margin: '1.5rem 0',
  '& li': {
    padding: '0.5rem 0',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateX(4px)',
    },
    '&:before': {
      content: '""',
      display: 'inline-block',
      width: '20px',
      height: '20px',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%234caf50\'%3E%3Cpath d=\'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z\'/%3E%3C/svg%3E")',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      marginRight: '12px',
      flexShrink: 0,
    },
    '&.unavailable': {
      color: theme.palette.text.disabled,
      textDecoration: 'line-through',
      '&:before': {
        content: '""',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%239e9e9e\'%3E%3Cpath d=\'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\'/%3E%3C/svg%3E")',
      },
    },
  },
}));

const ChitPlanCard = ({ plan, isSelected, onSelect, isPopular = false }) => {
  const planDetails = {
    1: {
      name: 'Basic Plan',
      price: 1000,
      duration: '12 months',
      features: [
        '₹1000 monthly investment',
        'Total Savings: ₹12,000',
        'Eligible for jewelry up to ₹15,000',
        'Priority customer support',
      ],
    },
    2: {
      name: 'Standard Plan',
      price: 2500,
      duration: '12 months',
      features: [
        '₹2,500 monthly investment',
        'Total Savings: ₹30,000',
        'Eligible for jewelry up to ₹40,000',
        'Priority customer support',
        '5% discount on making charges',
      ],
    },
    3: {
      name: 'Premium Plan',
      price: 5000,
      duration: '12 months',
      features: [
        '₹5,000 monthly investment',
        'Total Savings: ₹60,000',
        'Eligible for jewelry up to ₹80,000',
        '24/7 Priority support',
        '7% discount on making charges',
        'Free annual jewelry cleaning',
      ],
    },
  };

  const planId = typeof plan === 'number' ? plan : plan?.id;
  const safePlanId = [1, 2, 3].includes(planId) ? planId : 2;
  const details = planDetails[safePlanId];

  // Add some visual interest with different card headers
  const getCardHeaderStyles = (plan) => {
    switch (plan) {
      case 1:
        return {
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
          color: '#4a6baf',
        };
      case 2:
        return {
          background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
          color: '#fff',
        };
      case 3:
        return {
          background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
          color: '#fff',
        };
      default:
        return {
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
          color: 'inherit',
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: safePlanId * 0.1 }}
    >
      <PlanCard 
        raised={isSelected} 
        isSelected={isSelected}
        isPopular={isPopular}
        className={isPopular ? 'popular' : ''}
        onClick={() => onSelect(safePlanId)}
        sx={{
          '&:hover': {
            borderColor: isPopular ? theme => theme.palette.warning.main : undefined,
          },
        }}
      >
        <Box 
          sx={{
            ...getCardHeaderStyles(plan),
            padding: 2,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {isPopular && (
            <Box 
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                display: 'flex',
                alignItems: 'center',
                color: 'inherit',
              }}
            >
              <Star fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="caption" fontWeight="bold">
                Popular
              </Typography>
            </Box>
          )}
          <Typography 
            variant="h6" 
            component="h3" 
            gutterBottom 
            sx={{
              fontWeight: 700,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              fontSize: '1.1rem',
              mt: isPopular ? 1.5 : 0,
            }}
          >
            {details.name}
          </Typography>
          <PriceTag>
            {details.price.toLocaleString()}
          </PriceTag>
          <Typography 
            variant="subtitle2" 
            sx={{
              opacity: 0.9,
              fontWeight: 500,
              letterSpacing: '0.5px',
            }}
          >
            {details.duration}
          </Typography>
        </Box>
        
        <CardContent sx={{ pb: 0 }}>
          <FeatureList>
            {details.features.map((feature, index) => (
              <li 
                key={index}
                className={index >= 3 && plan === 1 ? 'unavailable' : ''}
              >
                <Typography variant="body2">
                  {feature}
                  {index === 0 && ' '}
                  {index === 0 && plan === 2 && (
                    <Chip 
                      label="BEST VALUE" 
                      size="small" 
                      color="warning"
                      sx={{ 
                        ml: 1, 
                        fontSize: '0.6rem',
                        height: '18px',
                        '& .MuiChip-label': {
                          px: 0.75,
                        },
                      }}
                    />
                  )}
                </Typography>
              </li>
            ))}
          </FeatureList>
        </CardContent>
        
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button 
            variant={isSelected ? 'contained' : 'outlined'} 
            color={isPopular ? 'warning' : 'primary'}
            fullWidth
            size="large"
            sx={{
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'none',
              borderRadius: 2,
              py: 1.5,
              ...(isSelected && {
                boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
              }),
            }}
            startIcon={isSelected ? <CheckCircle /> : null}
          >
            {isSelected ? 'Selected' : 'Get Started'}
          </Button>
        </CardActions>
      </PlanCard>
    </motion.div>
  );
};

export default ChitPlanCard;
