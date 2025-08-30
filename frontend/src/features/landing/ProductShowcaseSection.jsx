import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button, Chip, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectProducts, fetchProductsAsync } from '../products/ProductSlice.jsx';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

const ProductShowcaseSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const products = useSelector(selectProducts);

  // Fetch fresh products on component mount
  useEffect(() => {
    dispatch(fetchProductsAsync({}));
  }, [dispatch]);

  // Use real products if available, otherwise fallback to static data
  const featuredProducts = products && products.length > 0 ? products.slice(0, 4) : [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: isMobile ? 0.1 : 0.3 }
    );

    const section = document.getElementById('product-showcase');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <Box id="product-showcase" sx={{ 
      py: { xs: 6, md: 10 },
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' 
    }}>
      <Box sx={{ 
        maxWidth: '1200px', 
        mx: 'auto', 
        px: { xs: 2, sm: 3 }
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: isMobile ? 0.6 : 0.8 }}
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
              Featured Products
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
              Discover our handpicked collection of exquisite silver jewelry pieces
            </Typography>
          </Box>
        </motion.div>

                <Grid container spacing={isMobile ? 2 : 4} sx={{ mb: { xs: 4, md: 6 } }}>
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={3} key={product._id}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: isMobile ? 0.6 : 0.8, delay: index * 0.1 }}
                >
                  <Card 
                    sx={{ 
                      height: 370,
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      '&:hover': { 
                        boxShadow: '0 8px 24px rgba(156,39,176,0.15)',
                        transform: 'translateY(-8px) scale(1.03)',
                      },
                    }}
                    onClick={() => navigate(`/product-details/${product._id}`)}
                  >
                    <Box sx={{ position: 'relative', width: '100%', height: 180, bgcolor: '#f5f5f5' }}>
                      <CardMedia
                        component="img"
                        image={product.thumbnail || product.images?.[0] || "/product-placeholder.jpg"}
                        alt={product.title}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1, lineHeight: 1.3, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                        {product.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <StarIcon sx={{ fontSize: 18, color: '#FFD700', mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {product.ratings || 0} ({product.numOfReviews || 0})
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" color="primary" fontWeight={700}>
                          ₹{product.price?.toLocaleString()}
                        </Typography>
                        {product.priceBeforeDiscount && (
                          <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                            ₹{product.priceBeforeDiscount?.toLocaleString()}
                          </Typography>
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {product.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No featured products available at the moment
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: isMobile ? 0.6 : 0.8, delay: 0.6 }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/shop')}
              sx={{
                px: 6,
                py: 2,
                borderRadius: 25,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #1a1a1a 30%, #333333 90%)',
                boxShadow: '0 4px 8px 2px rgba(26, 26, 26, .4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(45deg, #000000 30%, #1a1a1a 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 12px 2px rgba(26, 26, 26, .5)',
                }
              }}
            >
              Explore All Products
            </Button>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export { ProductShowcaseSection };
