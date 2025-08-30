import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box, Grid, Typography, Card, CardContent, CardActions,
  Button, Stack, CircularProgress, TextField, InputAdornment,
  FormControl, InputLabel, Select, MenuItem, Slider, Checkbox,
  FormControlLabel, Divider, Chip, Drawer, IconButton, Pagination, Container, Rating, Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { fetchProductsAsync, selectProducts, selectProductStatus } from '../products/ProductSlice';
import { getImageUrl } from '../../utils/imageUtils';
import { CompactMetalRatesWidget } from '../metal-rates';
import ProductCard from './ProductCard';

const ShopPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const products = useSelector(selectProducts);
  const status = useSelector(selectProductStatus);
  
  // State for filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Initialize filters from URL parameters
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategories([category]);
    }
  }, [searchParams]);
  
  // Categories matching backend categories
  const categories = ['rings', 'necklaces', 'earrings', 'bracelets', 'bangles', 'chains', 'pendants', 'nose-pins'];
  


  const handleCategoryChange = (category) => {
    setSelectedCategories([category]); // Only allow one category at a time
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSortBy('newest');
    setShowFilters(false);
    applyFilters();
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  };

  // Filter summary for desktop
  const filterSummary = [
    searchQuery && `Search: "${searchQuery}"`,
    selectedCategories.length > 0 && `Category: ${selectedCategories[0].charAt(0).toUpperCase() + selectedCategories[0].slice(1)}`
  ].filter(Boolean).join(' • ') || `Showing ${products.length} products`;



  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilters();
  };

  // Apply filters and search
  const applyFilters = () => {
    const filters = {
      search: searchQuery,
      category: selectedCategories.length > 0 ? selectedCategories : [], // Array format for API
      sort: sortBy === 'newest' ? { sort: 'createdAt', order: 'desc' } : 
            sortBy === 'price-low' ? { sort: 'price', order: 'asc' } :
            sortBy === 'price-high' ? { sort: 'price', order: 'desc' } :
            { sort: 'createdAt', order: 'desc' }
    };
    
    console.log('Applying filters:', filters);
    dispatch(fetchProductsAsync(filters));
    setShowFilters(false); // Close filters after applying
  };

  // Load products on component mount
  useEffect(() => {
    dispatch(fetchProductsAsync({}));
  }, [dispatch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      applyFilters();
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery, selectedCategories, sortBy]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Stack spacing={3} sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          fontWeight={700}
          sx={{ 
            color: '#1a1a1a',
            textAlign: 'center',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          Premium Silver Collection
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ 
            textAlign: 'center',
            color: '#666',
            fontWeight: 400
          }}
        >
          Discover our exquisite collection of handcrafted silver jewelry
        </Typography>
      </Stack>

      {/* Main Content with Sidebar */}
      <Grid container spacing={3}>
        {/* Left Sidebar - Metal Rates & Filters */}
        <Grid item xs={12} md={3}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            {/* Metal Rates Widget */}
            <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
              <CompactMetalRatesWidget />
            </Paper>

            {/* Filters Section */}
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1a1a1a' }}>
                Quick Filters
              </Typography>
              
              {/* Categories */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#666' }}>
                  Categories
                </Typography>
                <Stack spacing={1}>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategories.includes(category) ? "contained" : "outlined"}
                      onClick={() => handleCategoryChange(category)}
                      size="small"
                      sx={{
                        backgroundColor: selectedCategories.includes(category) ? '#d4af37' : 'transparent',
                        color: selectedCategories.includes(category) ? 'white' : '#666',
                        borderColor: selectedCategories.includes(category) ? '#d4af37' : '#e0e0e0',
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        py: 0.5,
                        '&:hover': {
                          backgroundColor: selectedCategories.includes(category) ? '#b8860b' : '#f8f9fa',
                          borderColor: selectedCategories.includes(category) ? '#b8860b' : '#d4af37'
                        }
                      }}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </Stack>
              </Box>

              {/* Sort Options */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#666' }}>
                  Sort By
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e0e0e0'
                      }
                    }}
                  >
                    <MenuItem value="newest">Newest First</MenuItem>
                    <MenuItem value="price-low">Price: Low to High</MenuItem>
                    <MenuItem value="price-high">Price: High to Low</MenuItem>
                    <MenuItem value="popular">Most Popular</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Apply & Reset */}
              <Stack spacing={1}>
                <Button
                  variant="contained"
                  onClick={applyFilters}
                  fullWidth
                  sx={{
                    backgroundColor: '#d4af37',
                    color: 'white',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#b8860b'
                    }
                  }}
                >
                  Apply Filters
                </Button>
                <Button
                  variant="outlined"
                  onClick={resetFilters}
                  fullWidth
                  size="small"
                  sx={{
                    borderColor: '#d4af37',
                    color: '#d4af37',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#b8860b',
                      color: '#b8860b'
                    }
                  }}
                >
                  Reset
                </Button>
              </Stack>
            </Paper>
          </Box>
        </Grid>

                {/* Right Content - Search, Products */}
        <Grid item xs={12} md={9}>
          
          {/* Search Bar */}
          <Box sx={{ mb: 4 }}>
            <form onSubmit={handleSearchSubmit}>
              <TextField
                fullWidth
                placeholder="Search by product name..."
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        type="submit"
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: '#d4af37',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#b8860b'
                          }
                        }}
                      >
                        Search
                      </Button>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#d4af37'
                      }
                    },
                    '&.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#d4af37'
                      }
                    }
                  }
                }}
              />
            </form>
          </Box>

              {/* Filter Summary */}
        {filterSummary !== 'All products' && (
          <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2, border: '1px solid #e9ecef' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {filterSummary}
              </Typography>
              <Button
                variant="text"
                onClick={resetFilters}
                size="small"
                sx={{ color: '#d4af37', textTransform: 'none' }}
              >
                Clear All
              </Button>
            </Stack>
          </Box>
        )}
          
      {/* Products Grid */}
            {status === 'loading' ? (
        <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
          <CircularProgress sx={{ color: '#d4af37' }} />
          <Typography color="text.secondary">Loading products...</Typography>
        </Stack>
      ) : products.length === 0 ? (
        <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
          <Typography variant="h5" color="text.secondary" fontWeight={600}>
            No products found
          </Typography>
          <Typography color="text.secondary" textAlign="center">
            Try adjusting your filters or search terms
          </Typography>
          <Button
            variant="outlined"
            onClick={resetFilters}
            sx={{
              borderColor: '#d4af37',
              color: '#d4af37',
              '&:hover': {
                borderColor: '#b8860b',
                color: '#b8860b'
              }
            }}
          >
            Clear All Filters
          </Button>
        </Stack>
      ) : (
              <Grid container spacing={{ xs: 2, md: 3 }}>
                {products.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
      )}

        {/* Pagination */}
        <Stack alignItems="center" sx={{ mt: 6 }}>
          <Pagination
            count={10} 
            color="primary" 
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#666',
                '&.Mui-selected': {
                  backgroundColor: '#d4af37',
                  color: 'white'
                },
                '&:hover': {
                  backgroundColor: '#fff8e1'
                }
              }
            }}
          />
        </Stack>
        </Grid> {/* Close Right Content Grid */}
      </Grid> {/* Close Main Container Grid */}
    </Container>
  );
};

export default ShopPage;
