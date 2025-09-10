import React from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button, useTheme, useMediaQuery } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

export const FeaturedProductsSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const jewelryCategories = [
    {
      id: 'bangles',
      name: 'Bangles',
      category: 'bangles',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
      description: 'Elegant gold bangles with diamond accents'
    },
    {
      id: 'earrings',
      name: 'Earrings',
      category: 'earrings',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=400&q=80',
      description: 'Ornate diamond earrings with cascading design'
    },
    {
      id: 'necklace',
      name: 'Necklace',
      category: 'necklaces',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80',
      description: 'Delicate gold necklaces with floral diamond clusters'
    },
    {
      id: 'rings',
      name: 'Rings',
      category: 'rings',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80',
      description: 'Prominent gold rings with intricate diamond designs'
    },
    {
      id: 'pendant',
      name: 'Pendant',
      category: 'pendants',
      image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2b9?auto=format&fit=crop&w=400&q=80',
      description: 'Gold chains with teardrop diamond pendants'
    },
    {
      id: 'bracelets',
      name: 'Bracelets',
      category: 'bracelets',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80',
      description: 'Gold bracelets with central diamond clusters'
    },
    {
      id: 'nose-pin',
      name: 'Nose Pin',
      category: 'nose-pins',
      image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2b9?auto=format&fit=crop&w=400&q=80',
      description: 'Intricate gold nose pins with diamond clusters'
    },
    {
      id: 'chain',
      name: 'Chain',
      category: 'chains',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
      description: 'Delicate gold chains with diamond pendants'
    }
  ];

  return (
    <Box 
      sx={{ 
        py: { xs: 4, md: 8 }, 
        px: { xs: 2, md: 4 },
        backgroundColor: 'white'
      }}
    >
      <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
        <Typography 
          variant="h3" 
          fontWeight={700} 
          sx={{ 
            mb: 2,
            color: theme.palette.primary.main,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          Jewelry Categories
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            maxWidth: 600, 
            mx: 'auto',
            fontSize: { xs: '0.9rem', md: '1rem' }
          }}
        >
          Discover our exquisite collection of handcrafted jewelry pieces, each category showcasing the finest craftsmanship and timeless elegance
        </Typography>
      </Box>

      <Grid 
        container 
        spacing={{ xs: 3, sm: 4, md: 5 }} 
        justifyContent="center"
        sx={{ maxWidth: 1400, mx: 'auto' }}
      >
        {jewelryCategories.map((category) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={3} 
            key={category.id}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Card 
              sx={{ 
                width: '100%',
                maxWidth: 320,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-in-out',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                },
                overflow: 'hidden'
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height={isMobile ? 180 : isTablet ? 200 : 220}
                  image={category.image}
                  alt={category.name}
                  sx={{
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    height: '40%',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    p: 2
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/shop?category=${category.category}`)}
                    sx={{
                      backgroundColor: 'white',
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        transform: 'scale(1.05)',
                      },
                      transition: 'all 0.2s ease-in-out',
                      fontSize: { xs: '0.8rem', md: '0.9rem' }
                    }}
                    endIcon={<ArrowForwardIcon sx={{ fontSize: '1rem' }} />}
                  >
                    {category.name}
                  </Button>
                </Box>
              </Box>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: { xs: '0.8rem', md: '0.9rem' },
                    lineHeight: 1.4
                  }}
                >
                  {category.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
