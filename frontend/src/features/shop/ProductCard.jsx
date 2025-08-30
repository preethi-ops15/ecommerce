import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { getImageUrl } from '../../utils/imageUtils';
import { useProductPriceCalculation } from '../metal-rates';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { calculatedPrice, loading, error } = useProductPriceCalculation(product);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getDisplayPrice = () => {
    if (loading) return 'Calculating...';
    if (error) return 'Price unavailable';
    if (calculatedPrice) return formatPrice(calculatedPrice.priceWithGST);
    return formatPrice(product.price || 0);
  };

  const getPriceBadge = () => {
    if (loading) {
      return (
        <Chip
          label="Calculating Price"
          size="small"
          sx={{
            backgroundColor: '#ff9800',
            color: 'white',
            fontWeight: 600
          }}
        />
      );
    }
    
    if (error) {
      return (
        <Chip
          label="Price Unavailable"
          size="small"
          sx={{
            backgroundColor: '#f44336',
            color: 'white',
            fontWeight: 600
          }}
        />
      );
    }

    if (calculatedPrice) {
      return (
        <Chip
          label="Live Price"
          size="small"
          sx={{
            backgroundColor: '#4caf50',
            color: 'white',
            fontWeight: 600
          }}
        />
      );
    }

    return null;
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        border: '1px solid #f0f0f0',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          borderColor: '#d4af37'
        }
      }}
      onClick={() => navigate(`/product-details/${product._id}`)}
    >
      {/* Product Image */}
      <Box sx={{ position: 'relative', height: { xs: 200, sm: 240, md: 280 }, backgroundColor: '#fafafa' }}>
        <img
          src={getImageUrl(product.images?.[0]) || '/product-placeholder.jpg'}
          alt={product.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '1rem'
          }}
        />
        
        {/* Rating Badge */}
        <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
          <Chip 
            label="4.5 ★"
            size="small"
            sx={{
              backgroundColor: '#d4af37',
              color: 'white',
              fontWeight: 600
            }}
          />
        </Box>

        {/* Price Badge */}
        {getPriceBadge() && (
          <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
            {getPriceBadge()}
          </Box>
        )}
      </Box>
      
      {/* Product Details */}
      <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, md: 2 } }}>
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ 
            fontWeight: 600,
            color: '#666',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          {product.brand?.name || 'Premium Silver'}
        </Typography>
        
        <Typography 
          variant="h6" 
          fontWeight={600}
          sx={{ 
            color: '#1a1a1a',
            lineHeight: 1.3,
            fontSize: { xs: '0.9rem', md: '1rem' },
            mt: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {product.title}
        </Typography>

        {/* Weight Info */}
        {product.productWeight && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mt: 1, fontSize: '0.8rem' }}
          >
            Weight: {product.productWeight}g
          </Typography>
        )}

        {/* Price Display */}
        <Box sx={{ mt: 2 }}>
          <Typography 
            variant="h6" 
            fontWeight={700}
            sx={{ 
              color: '#1a1a1a',
              fontSize: '1.2rem'
            }}
          >
            {getDisplayPrice()}
          </Typography>
          
          {/* Live Rate Info */}
          {calculatedPrice && (
            <Typography 
              variant="caption" 
              color="success.main"
              sx={{ 
                fontSize: '0.7rem',
                fontWeight: 600,
                display: 'block',
                mt: 0.5
              }}
            >
              Based on live {calculatedPrice.metalType} rates
            </Typography>
          )}
        </Box>
      </CardContent>
      
      {/* Action Button */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          fullWidth 
          variant="contained" 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product-details/${product._id}`);
          }}
          sx={{
            backgroundColor: '#1a1a1a',
            color: 'white',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#000000'
            }
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
