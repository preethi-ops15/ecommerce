import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box, Grid, Typography, Card, CardContent, CardActions,
  Button, Stack, CircularProgress,
  FormControl, InputLabel, Select, MenuItem, Slider, Checkbox,
  FormControlLabel, Divider, Chip, Drawer, IconButton, Pagination, Container, Rating, Paper, Dialog, DialogContent, Badge
} from '@mui/material';
import { FilterList as FilterListIcon, Close as CloseIcon, Refresh as RefreshIcon, Home as HomeIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { fetchProductsAsync, selectProducts, selectProductStatus } from '../products/ProductSlice';
import { selectCartItems } from '../cart/CartSlice';
import { selectWishlistItems } from '../wishlist/WishlistSlice';
import { selectLoggedInUser } from '../auth/AuthSlice';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useLoginPopup } from '../../contexts/LoginPopupContext';
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
  const cartItems = useSelector(selectCartItems);
  const wishlistItems = useSelector(selectWishlistItems);
  const loggedInUser = useSelector(selectLoggedInUser);
  const { openLoginPopup } = useLoginPopup();
  
  // State for filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [ratesOpen, setRatesOpen] = useState(true); // auto-open on enter
  const [expandedCategories, setExpandedCategories] = useState({});
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Initialize filters from URL parameters
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategories([category]);
    }
  }, [searchParams]);
  
  // Categories matching backend categories
  const categories = ['rings', 'necklaces', 'earrings', 'bracelets', 'bangles', 'chains', 'pendants', 'nose-pins'];

  // Order: bracelets first, then rings, then remaining found in products
  const orderedCategories = () => {
    const present = Array.from(new Set(products.map(p => p.category?.toLowerCase()).filter(Boolean)));
    const priority = ['bracelets', 'rings'];
    const rest = present.filter(c => !priority.includes(c));
    return [...priority.filter(c => present.includes(c)), ...rest];
  };

  const productsByCategory = (cat) => products.filter(p => (p.category || '').toLowerCase() === cat);

  const visibleProducts = (cat, limit = null) => {
    const list = productsByCategory(cat);
    return limit ? list.slice(0, limit) : list;
  };

  const handleViewMoreCategory = (cat) => {
    // set URL param and local state, then fetch immediately for snappy UX
    setSelectedCategories([cat]);
    setSearchParams({ category: cat });
    const filters = { search: '', category: [cat], sort: { sort: 'createdAt', order: 'desc' } };
    dispatch(fetchProductsAsync(filters));
    // After viewing more, show sort dropdown by closing any filter drawer
    setFilterDrawerOpen(false);
  };
  


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

  // Helper: parse gender from description if present (fallback UI filter only)
  const extractGender = (product) => {
    const text = `${product.description || ''}`.toLowerCase();
    if (text.includes('gender: men') || text.includes('for men')) return 'men';
    if (text.includes('gender: women') || text.includes('for women')) return 'women';
    if (text.includes('unisex')) return 'unisex';
    return '';
  };

  // Compute products to display when a single category is selected, applying client-side sort/filter where needed
  const getDisplayedProducts = () => {
    let list = [...products];

    // Gender filter only when gender option selected
    if (sortBy === 'gender-men') {
      list = list.filter(p => extractGender(p) === 'men');
    } else if (sortBy === 'gender-women') {
      list = list.filter(p => extractGender(p) === 'women');
    }

    // Client-side best-seller sorting heuristic (fallback to discountPercentage, then stockQuantity)
    if (sortBy === 'best-seller') {
      list.sort((a, b) => {
        const ad = a.discountPercentage || 0; const bd = b.discountPercentage || 0;
        if (bd !== ad) return bd - ad;
        const as = a.stockQuantity || 0; const bs = b.stockQuantity || 0;
        return bs - as;
      });
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'price-low') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return list;
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
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Minimal Shop Header: Logo + Search icon + Wishlist/Cart */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, position: 'sticky', top: 8, zIndex: 5 }}>
        {/* Logo */}
        <Box
          component="a"
          href="/"
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 44, height: 44, borderRadius: '50%', backgroundColor: '#d4af37', textDecoration: 'none',
            transition: 'all 0.3s ease', '&:hover': { transform: 'scale(1.05)', boxShadow: '0 4px 12px rgba(212,175,55,0.3)' }
          }}
        >
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'serif' }}>SJ</Typography>
        </Box>

        {/* Sticky Live Rates button */}
        <Box sx={{ ml: 'auto', mr: 2, position: 'sticky', top: 8 }}>
          <Button
            variant="outlined"
            onClick={() => setRatesOpen(true)}
            sx={{ borderColor: '#d4af37', color: '#d4af37', fontWeight: 600, textTransform: 'none', '&:hover': { borderColor: '#b8860b', color: '#b8860b' } }}
          >
            Live Rates
          </Button>
        </Box>

        {/* Icons (Wishlist, Cart) */}
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            onClick={() => navigate('/')}
            sx={{ color: '#1a1a1a', border: '1px solid #e0e0e0' }}
          >
            <HomeIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              if (loggedInUser) { navigate('/wishlist'); } else { sessionStorage.setItem('redirectAfterLogin', '/wishlist'); openLoginPopup(); }
            }}
            sx={{ color: '#1a1a1a', border: '1px solid #e0e0e0' }}
          >
            <Badge badgeContent={wishlistItems?.length || 0} color="error">
              <FavoriteBorderIcon />
            </Badge>
          </IconButton>
          <IconButton
            onClick={() => {
              if (loggedInUser) { navigate('/cart'); } else { sessionStorage.setItem('redirectAfterLogin', '/cart'); openLoginPopup(); }
            }}
            sx={{ color: '#1a1a1a', border: '1px solid #e0e0e0' }}
          >
            <Badge badgeContent={cartItems?.length || 0} color="error">
              <ShoppingCartOutlinedIcon />
            </Badge>
          </IconButton>
        </Stack>
      </Box>
      {/* No banner and no search UI */}

      {/* Right-side Filter / Sort control */}
      <Box sx={{
        position: 'fixed',
        right: { xs: 12, md: 24 },
        bottom: { xs: 16, md: 'auto' },
        top: { xs: 'auto', md: 96 },
        zIndex: 10
      }}>
        {selectedCategories.length === 0 ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<FilterListIcon />}
            onClick={() => setFilterDrawerOpen(true)}
            sx={{
              bgcolor: '#d4af37',
              color: '#fff',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': { bgcolor: '#b8860b' }
            }}
          >
            Filter
          </Button>
        ) : (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 180, bgcolor: '#fff', borderRadius: 1 }}>
              <InputLabel id="sort-by-label">Sort by</InputLabel>
              <Select
                labelId="sort-by-label"
                label="Sort by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value={'newest'}>New Arrivals</MenuItem>
                <MenuItem value={'price-low'}>Price: Low to High</MenuItem>
                <MenuItem value={'price-high'}>Price: High to Low</MenuItem>
                <MenuItem value={'best-seller'}>Best Seller</MenuItem>
                <Divider />
                <MenuItem value={'gender-men'}>Gender: Men</MenuItem>
                <MenuItem value={'gender-women'}>Gender: Women</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{ borderColor: '#d4af37', color: '#d4af37', textTransform: 'none', fontWeight: 700, '&:hover': { borderColor: '#b8860b', color: '#b8860b' } }}
            >
              Back to Home
            </Button>
          </Stack>
        )}
      </Box>

      {/* Filter Drawer on the right */}
      <Drawer anchor="right" open={filterDrawerOpen} onClose={() => setFilterDrawerOpen(false)}>
        <Box sx={{ width: { xs: 260, sm: 300 }, p: 2 }} role="presentation">
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="h6" fontWeight={800}>Filter</Typography>
            <IconButton onClick={() => setFilterDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Categories</Typography>
          <Stack spacing={1}>
            {orderedCategories().map((cat) => {
              const count = productsByCategory(cat).length;
              if (!count) return null;
              const active = selectedCategories[0] === cat;
              return (
                <Button
                  key={cat}
                  variant={active ? 'contained' : 'outlined'}
                  onClick={() => {
                    handleViewMoreCategory(cat);
                    setFilterDrawerOpen(false);
                  }}
                  sx={{
                    justifyContent: 'space-between',
                    textTransform: 'none',
                    borderColor: '#d4af37',
                    color: active ? '#fff' : '#1a1a1a',
                    bgcolor: active ? '#d4af37' : 'transparent',
                    '&:hover': { borderColor: '#b8860b' }
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                  <Chip size="small" label={count} sx={{ ml: 2 }} />
                </Button>
              );
            })}
          </Stack>
        </Box>
      </Drawer>

      {/* Main Content - No Sidebar */}
      <Grid container spacing={3}>
        {/* Content - Products by category */}
        <Grid item xs={12}>

              {/* Filter Summary */}
        {/* Hide product count/filter summary per request */}
          
      {/* Products Grid by Category or Selected Category */}
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
          <Button variant="outlined" onClick={resetFilters} sx={{ borderColor: '#d4af37', color: '#d4af37', '&:hover': { borderColor: '#b8860b', color: '#b8860b' } }}>Clear All Filters</Button>
        </Stack>
      ) : (
              selectedCategories.length === 0 ? (
                // Show 4 products per category with 'View More' below
                <Stack spacing={6}>
                  {orderedCategories().map((cat) => {
                    const list = productsByCategory(cat);
                    if (list.length === 0) return null;
                    return (
                      <Box key={cat}>
                        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 2, textAlign: 'center', mb: 2 }}>
                          {cat.toUpperCase()}
                        </Typography>
                        <Grid container spacing={{ xs: 2, md: 3 }}>
                          {visibleProducts(cat, 4).map((product) => (
                            <Grid item xs={12} sm={6} md={3} key={product._id}>
                              <ProductCard product={product} />
                            </Grid>
                          ))}
                        </Grid>
                        <Stack alignItems="center" sx={{ mt: 2 }}>
                          <Button
                            variant="text"
                            onClick={() => handleViewMoreCategory(cat)}
                            sx={{ color: '#d4af37', fontWeight: 700, textTransform: 'none', '&:hover': { color: '#b8860b' } }}
                          >
                            View More
                          </Button>
                        </Stack>
                      </Box>
                    );
                  })}
                </Stack>
              ) : (
                // Show only the selected category's products in a grid (apply client-side sort/filter as needed)
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  {/* Inline Back to Home for mobile/top visibility */}
                  <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/')}
                      fullWidth
                      sx={{ borderColor: '#d4af37', color: '#d4af37', textTransform: 'none', fontWeight: 700, '&:hover': { borderColor: '#b8860b', color: '#b8860b' } }}
                    >
                      Back to Home
                    </Button>
                  </Grid>
                  {getDisplayedProducts().map((product) => (
                    <Grid item xs={12} sm={6} md={3} key={product._id}>
                      <ProductCard product={product} />
                    </Grid>
                  ))}
                </Grid>
              )
      )}

        {/* No pagination; sections handle 'View More' */}
        </Grid> {/* Close Content Grid */}
      </Grid> {/* Close Main Container Grid */}

      {/* Live Rates Popup */}
      <Dialog open={ratesOpen} onClose={() => setRatesOpen(false)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={() => setRatesOpen(false)}
            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Live Gold & Silver Rates</Typography>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid #eee' }}>
              <CompactMetalRatesWidget />
            </Paper>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ShopPage;
