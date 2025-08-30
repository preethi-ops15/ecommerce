import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Checkbox, 
  Paper, 
  Rating, 
  Stack, 
  Typography, 
  useMediaQuery, 
  useTheme, 
  IconButton,
  Chip,
  TextField,
  Breadcrumbs,
  Link,
  Container,
  Grid,
  Divider,
  Card,
  CardContent,
  Fab,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  clearSelectedProduct, 
  fetchProductByIdAsync, 
  resetProductFetchStatus, 
  selectProductFetchStatus, 
  selectSelectedProduct 
} from '../ProductSlice';
import { 
  addToCartAsync, 
  resetCartItemAddStatus, 
  selectCartItemAddStatus, 
  selectCartItems 
} from '../../cart/CartSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { 
  fetchReviewsByProductIdAsync,
  resetReviewFetchStatus,
  selectReviewFetchStatus,
  selectReviews 
} from '../../review/ReviewSlice';
import { Reviews } from '../../review/components/Reviews';
import { toast } from 'react-toastify';
import { 
  createWishlistItemAsync, 
  deleteWishlistItemByIdAsync, 
  resetWishlistItemAddStatus, 
  resetWishlistItemDeleteStatus, 
  selectWishlistItemAddStatus, 
  selectWishlistItemDeleteStatus, 
  selectWishlistItems 
} from '../../wishlist/WishlistSlice';
import Lottie from 'lottie-react';
import { loadingAnimation } from '../../../assets';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Autoplay } from 'swiper/modules';
import { getImageUrl } from '../../../utils/imageUtils';
import {
  FavoriteBorder,
  Favorite,
  ShoppingCart,
  Share,
  Phone,
  WhatsApp,
  LocalShipping,
  Diamond,
  Star,
  LocationOn,
  Store,
  CheckCircle,
  Security,
  Verified,
  Close as CloseIcon,
  ArrowBack
} from '@mui/icons-material';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

export const ProductDetails = () => {
  const { id } = useParams();
  const product = useSelector(selectSelectedProduct);
  const loggedInUser = useSelector(selectLoggedInUser);
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartItemAddStatus = useSelector(selectCartItemAddStatus);
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [pincode, setPincode] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [priceBreakupOpen, setPriceBreakupOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const reviews = useSelector(selectReviews);
  const wishlistItems = useSelector(selectWishlistItems);
  const isProductAlreadyInCart = cartItems?.some((item) => item?.product?._id === id) || false;
  const isProductAlreadyinWishlist = wishlistItems?.some((item) => item?.product?._id === id) || false;

  const productFetchStatus = useSelector(selectProductFetchStatus);
  const reviewFetchStatus = useSelector(selectReviewFetchStatus);
  const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus);
  const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus);

  const totalReviewRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  const totalReviews = reviews.length;
  const averageRating = parseInt(Math.ceil(totalReviewRating / totalReviews));

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductByIdAsync(id));
      dispatch(fetchReviewsByProductIdAsync(id));
    }
  }, [id]);

  useEffect(() => {
    if (cartItemAddStatus === 'fulfilled') {
      toast.success("Product added to cart");
    } else if (cartItemAddStatus === 'rejected') {
      toast.error('Error adding product to cart, please try again later');
    }
  }, [cartItemAddStatus]);

  useEffect(() => {
    if (wishlistItemAddStatus === 'fulfilled') {
      toast.success("Product added to wishlist");
    } else if (wishlistItemAddStatus === 'rejected') {
      toast.error("Error adding product to wishlist, please try again later");
    }
  }, [wishlistItemAddStatus]);

  useEffect(() => {
    if (wishlistItemDeleteStatus === 'fulfilled') {
      toast.success("Product removed from wishlist");
    } else if (wishlistItemDeleteStatus === 'rejected') {
      toast.error("Error removing product from wishlist, please try again later");
    }
  }, [wishlistItemDeleteStatus]);

  useEffect(() => {
    return () => {
      dispatch(clearSelectedProduct());
      dispatch(resetProductFetchStatus());
      dispatch(resetReviewFetchStatus());
      dispatch(resetWishlistItemDeleteStatus());
      dispatch(resetWishlistItemAddStatus());
      dispatch(resetCartItemAddStatus());
    };
  }, []);

  const handleAddToCart = () => {
    if(!loggedInUser?._id) {
      toast.error("Please login to add items to cart");
      return;
    }
    const item = { user: loggedInUser._id, product: id, quantity };
    dispatch(addToCartAsync(item));
    setQuantity(1);
  };

  const handleAddRemoveFromWishlist = (e) => {
    if(!loggedInUser?._id) {
      toast.error("Please login to manage wishlist");
      return;
    }
    
    if (e.target.checked) {
      const data = { user: loggedInUser._id, product: id };
      dispatch(createWishlistItemAsync(data));
    } else if (!e.target.checked) {
      const index = wishlistItems.findIndex((item) => item.product._id === id);
      if(index !== -1 && wishlistItems[index]){
        dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
      }
    }
  };

  const handlePincodeCheck = () => {
    if (pincode.length === 6) {
      toast.success('Delivery available in your area!');
    } else {
      toast.error('Please enter a valid 6-digit pincode');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    productName: '',
    message: ''
  });

  const handleEnquiry = () => {
    if(!loggedInUser?._id) {
      toast.error("Please login to submit enquiries");
      return;
    }
    setEnquiryOpen(true);
  };

  const handleEnquirySubmit = async () => {
    try {
      const response = await fetch('/api/queries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...enquiryForm,
          productName: product?.title || 'Unknown Product',
          message: enquiryForm.message
        }),
      });

      if (response.ok) {
        toast.success('Enquiry submitted successfully!');
        setEnquiryOpen(false);
        setEnquiryForm({ name: '', email: '', productName: '', message: '' });
      } else {
        toast.error('Failed to submit enquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      toast.error('Failed to submit enquiry. Please try again.');
    }
  };

  const handlePriceBreakup = () => {
    if(!loggedInUser?._id) {
      toast.error("Please login to view price breakup");
      return;
    }
    setPriceBreakupOpen(true);
  };

  // Calculate price breakup based on product data from database
  const calculatePriceBreakup = () => {
    if (!product) return null;
    
    // Get values from database
    const currentRatePerGram = product.currentRatePerGram || 0;
    const productWeight = product.productWeight || 0;
    const materialValue = product.materialValue || 0;
    const makingCost = product.makingCost || 0;
    const wastageCost = product.wastageCost || 0;
    const gstPercent = product.gst || 0; // stored from admin as percentage
    const totalCalculatedPrice = product.totalCalculatedPrice || 0;
    
    // Debug: Log the actual product data to see what's coming from backend
    console.log('Product Data from Backend:', {
      productId: product._id,
      title: product.title,
      currentRatePerGram,
      productWeight,
      materialValue,
      makingCost,
      wastageCost,
      gstPercent,
      totalCalculatedPrice,
      fullProduct: product
    });
    
    // Log the raw product object to see all available fields
    console.log('Raw Product Object:', product);
    console.log('Product Schema Fields:', {
      hasCurrentRatePerGram: 'currentRatePerGram' in product,
      hasProductWeight: 'productWeight' in product,
      hasMaterialValue: 'materialValue' in product,
      hasMakingCost: 'makingCost' in product,
      hasWastageCost: 'wastageCost' in product,
      hasGst: 'gst' in product,
      hasTotalCalculatedPrice: 'totalCalculatedPrice' in product
    });
    
    // Log all product fields to see what's available
    console.log('All Product Fields:', Object.keys(product));
    console.log('Price Breakup Fields Check:', {
      hasCurrentRatePerGram: 'currentRatePerGram' in product,
      hasProductWeight: 'productWeight' in product,
      hasMaterialValue: 'materialValue' in product,
      hasMakingCost: 'makingCost' in product,
      hasWastageCost: 'wastageCost' in product,
      hasGst: 'gst' in product,
      hasTotalCalculatedPrice: 'totalCalculatedPrice' in product
    });
    

    
    // Determine material type based on brand/category
    const isGold = product.brand && product.brand.includes('gold');
    const isSilver = product.brand && product.brand.includes('silver');
    const isDiamond = product.brand && product.brand.includes('diamond');
    
    const getMaterialComponent = () => {
      if (isGold) return `${product.brand?.replace('-', ' ').toUpperCase() || 'GOLD'}`;
      if (isSilver) return `${product.brand?.replace('-', ' ').toUpperCase() || 'SILVER'}`;
      if (isDiamond) return 'DIAMOND';
      return 'MATERIAL';
    };
    
    const getWeightUnit = () => {
      if (isDiamond) return 'carats';
      return 'grams';
    };
    
    // Use the actual database values from admin input
    const finalMaterialValue = materialValue;
    const finalMakingCost = makingCost;
    const finalWastageCost = wastageCost;
    const gstAmount = ((finalMaterialValue + finalMakingCost + finalWastageCost) * (gstPercent || 0)) / 100;
    
    // Check if any price breakup data exists
    const hasPriceBreakupData = currentRatePerGram > 0 || productWeight > 0 || 
                                materialValue > 0 || makingCost > 0 || 
                                wastageCost > 0 || (gstPercent > 0);
    
    console.log('Has Price Breakup Data:', hasPriceBreakupData);
    
    // Calculate total from database values
    // Prefer backend-saved totalCalculatedPrice if available; else compute
    const computedTotal = finalMaterialValue + finalMakingCost + finalWastageCost + gstAmount;
    const total = totalCalculatedPrice > 0 ? totalCalculatedPrice : computedTotal;
    
    return {
      material: {
        component: getMaterialComponent(),
        rate: currentRatePerGram,
        weight: productWeight,
        value: finalMaterialValue,
        unit: getWeightUnit()
      },
      makingCost: {
        component: "Making Cost",
        value: finalMakingCost
      },
      wastageCost: {
        component: "Wastage Cost", 
        value: finalWastageCost
      },
      gst: {
        component: "GST",
        value: gstAmount,
        percentage: gstPercent
      },
      total: total,
      originalPrice: product.price || 0,
      discount: product.discountPercentage || 0
    };
  };

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Bangles', href: '/shop?category=bangles' },
    { name: 'Women', href: '/shop?category=women' },
    { name: product?.title || 'Product', href: '#' }
  ];

  if (productFetchStatus === 'pending' || reviewFetchStatus === 'pending') {
    return (
      <Stack width={'100vw'} height={'100vh'} justifyContent={'center'} alignItems={'center'}>
        <Lottie style={{ width: '20rem', height: '20rem' }} animationData={loadingAnimation} />
      </Stack>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Back Button */}
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/shop')}
          sx={{
            color: '#666',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#f5f5f5'
            }
          }}
        >
          Back to Shop
        </Button>
      </Container>

      {product ? (
        <Container maxWidth="lg" sx={{ pb: 6 }}>
          <Grid container spacing={4}>
            {/* Left Side - Product Images (Sticky) */}
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                position: 'sticky', 
                top: 20, 
                zIndex: 1,
                height: 'fit-content'
              }}>
                <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: 'white' }}>
                  {/* Main Image */}
                  <Box sx={{ mb: 2 }}>
                    <img
                      src={getImageUrl(product.images?.[selectedImage] || product.thumbnail)}
                      alt={product.title}
                      style={{
                        width: '100%',
                        height: isMobile ? '300px' : '400px',
                        objectFit: 'contain',
                        borderRadius: '12px'
                      }}
                    />
                  </Box>

                  {/* Thumbnail Images */}
                  {product.images && product.images.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {product.images.map((image, index) => (
                        <Box
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          sx={{
                            width: '80px',
                            height: '80px',
                            border: selectedImage === index ? '2px solid #d4af37' : '2px solid #e0e0e0',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: '#d4af37'
                            }
                          }}
                        >
                          <img
                            src={getImageUrl(image)}
                            alt={`${product.title} ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}
                </Paper>
              </Box>
            </Grid>

            {/* Right Side - Product Details */}
            <Grid item xs={12} md={6}>
              <Stack spacing={isMobile ? 2 : 3}>
                {/* Product Title with Wishlist and Share */}
                <Stack direction={isMobile ? 'column' : 'row'} justifyContent="space-between" alignItems="flex-start" spacing={2}>
                  <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700} sx={{ color: '#1a1a1a', flex: 1 }}>
                    {product.title}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Checkbox
                      checked={isProductAlreadyinWishlist}
                      onChange={handleAddRemoveFromWishlist}
                      icon={<FavoriteBorder sx={{ color: '#666', fontSize: isMobile ? 20 : 24 }} />}
                      checkedIcon={<Favorite sx={{ color: '#d4af37', fontSize: isMobile ? 20 : 24 }} />}
                      sx={{
                        backgroundColor: '#f0f0f0',
                        borderRadius: '50%',
                        '&:hover': { backgroundColor: '#e0e0e0' },
                        '&.Mui-checked': {
                          backgroundColor: '#fff5f5'
                        }
                      }}
                    />
                    <IconButton
                      onClick={handleShare}
                      sx={{
                        backgroundColor: '#f0f0f0',
                        '&:hover': { backgroundColor: '#e0e0e0' }
                      }}
                    >
                      <Share />
                    </IconButton>
                  </Stack>
                </Stack>

                {/* Rating */}
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Rating value={averageRating || 0} readOnly size="small" sx={{ color: '#d4af37' }} />
                  <Typography variant="body2" color="text.secondary">
                    ({totalReviews} reviews)
                  </Typography>
                </Stack>

                {/* Price Section */}
                <Box>
                  <Stack direction={isMobile ? 'column' : 'row'} alignItems="center" spacing={2} sx={{ mb: 1 }}>
                    <Typography variant={isMobile ? 'h4' : 'h3'} fontWeight={700} sx={{ color: '#1a1a1a' }}>
                      ₹{product.salePrice ? product.salePrice : product.price?.toLocaleString('en-IN')}
                    </Typography>
                    {product.salePrice && product.salePrice < product.price && (
                      <Typography
                        variant={isMobile ? 'h6' : 'h5'}
                        sx={{
                          textDecoration: 'line-through',
                          color: '#999',
                          fontWeight: 500
                        }}
                      >
                        ₹{product.price?.toLocaleString('en-IN')}
                      </Typography>
                    )}
                  </Stack>
                  
                  {/* Discount Badge */}
                  {product.salePrice && product.salePrice < product.price && (
                    <Chip
                      label="50% OFF on VA"
                      sx={{
                        backgroundColor: '#ffd700',
                        color: '#1a1a1a',
                        fontWeight: 600,
                        fontSize: '0.9rem'
                      }}
                    />
                  )}
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    (MRP Inclusive of all taxes)
                  </Typography>
                  
                  {/* Member Price */}
                  {product.memberPrice && product.memberPrice > 0 && (
                    <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f8f8', borderRadius: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack>
                          <Typography variant="h6" fontWeight={600} color="primary">
                            Member Price
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Special price for members
                          </Typography>
                        </Stack>
                        <Typography variant="h4" fontWeight={700} color="primary">
                          ₹{product.memberPrice?.toLocaleString('en-IN')}
                        </Typography>
                      </Stack>
                      <Button
                        variant="text"
                        size="small"
                        sx={{
                          color: 'primary.main',
                          textTransform: 'none',
                          mt: 1,
                          p: 0,
                          minWidth: 'auto',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            textDecoration: 'underline'
                          }
                        }}
                        onClick={() => navigate('/chit-plan')}
                      >
                        Learn more about membership & chit plans →
                      </Button>
                    </Box>
                  )}
                </Box>



                {/* Product Specifications */}
                <Card sx={{ backgroundColor: '#f8f8f8', borderRadius: 2 }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <Diamond sx={{ color: '#d4af37' }} />
                      <Typography variant="h6" fontWeight={600}>
                        SPECIFICATIONS
                      </Typography>
                    </Stack>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">Weight</Typography>
                        <Typography variant="body1" fontWeight={600}>{product.productWeight || 'N/A'} {product.brand?.includes('diamond') ? 'carats' : 'grams'}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">Material</Typography>
                        <Typography variant="body1" fontWeight={600}>{product.brand?.replace('-', ' ').toUpperCase() || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">Category</Typography>
                        <Typography variant="body1" fontWeight={600}>{product.category?.toUpperCase() || 'N/A'}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>





                {/* Action Buttons */}
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    size={isMobile ? 'medium' : 'large'}
                    startIcon={<ShoppingCart />}
                    onClick={handleAddToCart}
                    sx={{
                      backgroundColor: '#d32f2f',
                      color: 'white',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: isMobile ? '1rem' : '1.1rem',
                      py: isMobile ? 1 : 1.5,
                      '&:hover': {
                        backgroundColor: '#b71c1c'
                      }
                    }}
                  >
                    ADD TO CART
                  </Button>


                </Stack>



                {/* Product Details */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Product Details
                    </Typography>
                    <Button
                      variant="text"
                      onClick={handlePriceBreakup}
                      sx={{ color: '#d4af37', textTransform: 'none' }}
                    >
                      Price Breakup
                    </Button>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description || 'Product description not available'}
                  </Typography>
                  
                  {/* Features */}
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LocalShipping sx={{ color: '#d4af37', fontSize: '1.2rem' }} />
                        <Typography variant="body2">Fast shipping</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Star sx={{ color: '#d4af37', fontSize: '1.2rem' }} />
                        <Typography variant="body2">Timeless pieces</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Verified sx={{ color: '#d4af37', fontSize: '1.2rem' }} />
                        <Typography variant="body2">Heritage inspired</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Diamond sx={{ color: '#d4af37', fontSize: '1.2rem' }} />
                        <Typography variant="body2">Custom designs</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>

                {/* Disclaimer */}
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Actual product dimensions may vary. Please refer to the listed dimensions for the exact size.
                </Typography>

                {/* Manufacturer */}
                <Typography variant="body2" color="text.secondary">
                  Manufacturer & Packer: JEWELLS
                </Typography>

                {/* Certifications */}
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Chip
                    icon={<Security />}
                    label="BIS Hallmarked Jewellery"
                    size="small"
                    sx={{ backgroundColor: '#e8f5e8', color: '#2e7d32' }}
                  />
                  <Chip
                    icon={<Verified />}
                    label="Trust of JEWELLS"
                    size="small"
                    sx={{ backgroundColor: '#fff3e0', color: '#e65100' }}
                  />
                  <Chip
                    icon={<CheckCircle />}
                    label="100% Certified"
                    size="small"
                    sx={{ backgroundColor: '#e8f5e8', color: '#2e7d32' }}
                  />
                </Stack>
                
                {/* Enquiry Button */}
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Typography>?</Typography>}
                  onClick={handleEnquiry}
                  sx={{
                    borderColor: '#666',
                    color: '#666',
                    textTransform: 'none',
                    mt: 2,
                    '&:hover': {
                      borderColor: '#1a1a1a',
                      color: '#1a1a1a'
                    }
                  }}
                >
                  Enquiry
                </Button>
              </Stack>
            </Grid>
          </Grid>

          {/* Reviews Section */}
          <Box sx={{ mt: 6 }}>
            <Reviews productId={id} averageRating={averageRating} />
          </Box>
        </Container>
              ) : (
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" color="text.secondary">
                Product not found
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/shop')}
                sx={{ mt: 2 }}
              >
                Back to Shop
              </Button>
            </Box>
          </Container>
        )}

      {/* Enquiry Dialog */}
      <Dialog
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            backgroundColor: 'white'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #e0e0e0',
          pb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" fontWeight={600}>
            Product Enquiry
          </Typography>
          <IconButton onClick={() => setEnquiryOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <TextField
              label="Your Name *"
              value={enquiryForm.name}
              onChange={(e) => setEnquiryForm({...enquiryForm, name: e.target.value})}
              fullWidth
              required
            />
            <TextField
              label="Email Address *"
              type="email"
              value={enquiryForm.email}
              onChange={(e) => setEnquiryForm({...enquiryForm, email: e.target.value})}
              fullWidth
              required
            />
            <TextField
              label="Product Name"
              value={product?.title || ''}
              fullWidth
              disabled
            />
            <TextField
              label="Enquiry Message *"
              multiline
              rows={4}
              value={enquiryForm.message}
              onChange={(e) => setEnquiryForm({...enquiryForm, message: e.target.value})}
              fullWidth
              required
              placeholder="Please describe your enquiry about this product..."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setEnquiryOpen(false)}
            sx={{ color: '#666' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEnquirySubmit}
            variant="contained"
            sx={{
              backgroundColor: '#d4af37',
              color: '#1a1a1a',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#b8860b'
              }
            }}
          >
            Send Enquiry
          </Button>
        </DialogActions>
      </Dialog>

      {/* Price Breakup Dialog */}
      <Dialog
        open={priceBreakupOpen}
        onClose={() => setPriceBreakupOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            backgroundColor: 'white'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #e0e0e0',
          pb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#1a1a1a' }}>
            Price Breakup - {product?.title}
          </Typography>
          <IconButton onClick={() => setPriceBreakupOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {product && (
            <Stack spacing={3}>
              {/* Product Image and Basic Info */}
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 2 }}>
                <img
                  src={getImageUrl(product.thumbnail)}
                  alt={product.title}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
                <Box>
                  <Typography variant="h6" fontWeight={600} sx={{ color: '#1a1a1a' }}>
                    {product.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Style Code: {product._id?.slice(-8).toUpperCase()}
                  </Typography>
                </Box>
              </Box>

              {/* Price Breakdown Table */}
              <Paper sx={{ p: 3, backgroundColor: '#f8f8f8' }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: '#1a1a1a' }}>
                  Detailed Price Breakdown
                </Typography>
                
                {(() => {
                  const breakup = calculatePriceBreakup();
                  if (!breakup) {
                    return (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary">
                          Price breakup details not available for this product
                        </Typography>
                      </Box>
                    );
                  }
                  
                  // Check if there is any price breakup data to show
                  // Consider GST percentage as data even if computed amount is 0
                  const hasData = breakup.material.value > 0 ||
                                   breakup.makingCost.value > 0 || 
                                   breakup.wastageCost.value > 0 ||
                                   breakup.gst.value > 0 ||
                                   (breakup.gst.percentage && breakup.gst.percentage > 0);
                  
                  if (!hasData) {
                    return (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          Price breakup details not yet configured
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Please contact admin to configure price breakup for this product
                        </Typography>
                      </Box>
                    );
                  }
                  
                  return (
                    <Stack spacing={2}>
                      {/* Material Price */}
                      <Box sx={{ 
                        p: 2, 
                        backgroundColor: 'white', 
                        borderRadius: 2,
                        border: '1px solid #e0e0e0'
                      }}>
                        <Typography variant="h6" fontWeight={600} sx={{ color: '#1a1a1a', mb: 1 }}>
                          {breakup.material.component} Price
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={3}>
                            <Typography variant="body2" color="text.secondary">Component</Typography>
                            <Typography variant="body1" fontWeight={600}>{breakup.material.component}</Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="body2" color="text.secondary">Rate</Typography>
                            <Typography variant="body1" fontWeight={600}>₹{breakup.material.rate.toLocaleString('en-IN')} / {breakup.material.unit === 'carats' ? 'ct' : 'g'}</Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="body2" color="text.secondary">Weight</Typography>
                            <Typography variant="body1" fontWeight={600}>{breakup.material.weight} {breakup.material.unit}</Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="body2" color="text.secondary">Value</Typography>
                            <Typography variant="body1" fontWeight={600}>₹{breakup.material.value.toLocaleString('en-IN')}</Typography>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Making Cost */}
                      <Box sx={{ 
                        p: 2, 
                        backgroundColor: 'white', 
                        borderRadius: 2,
                        border: '1px solid #e0e0e0'
                      }}>
                        <Typography variant="h6" fontWeight={600} sx={{ color: '#1a1a1a', mb: 1 }}>
                          Making Cost
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={9}>
                            <Typography variant="body2" color="text.secondary">Making Cost</Typography>
                            <Typography variant="body1" fontWeight={600}>{breakup.makingCost.component}</Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="body2" color="text.secondary">Value</Typography>
                            <Typography variant="body1" fontWeight={600}>₹{breakup.makingCost.value.toLocaleString('en-IN')}</Typography>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Wastage Cost */}
                      <Box sx={{ 
                        p: 2, 
                        backgroundColor: 'white', 
                        borderRadius: 2,
                        border: '1px solid #e0e0e0'
                      }}>
                        <Typography variant="h6" fontWeight={600} sx={{ color: '#1a1a1a', mb: 1 }}>
                          Wastage Cost
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={9}>
                            <Typography variant="body2" color="text.secondary">Wastage Cost</Typography>
                            <Typography variant="body1" fontWeight={600}>{breakup.wastageCost.component}</Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="body2" color="text.secondary">Value</Typography>
                            <Typography variant="body1" fontWeight={600}>₹{breakup.wastageCost.value.toLocaleString('en-IN')}</Typography>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* GST */}
                      <Box sx={{ 
                        p: 2, 
                        backgroundColor: 'white', 
                        borderRadius: 2,
                        border: '1px solid #e0e0e0'
                      }}>
                        <Typography variant="h6" fontWeight={600} sx={{ color: '#1a1a1a', mb: 1 }}>
                          {`GST${breakup.gst.percentage ? ` (${breakup.gst.percentage}%)` : ''}`}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={9}>
                            <Typography variant="body2" color="text.secondary">GST</Typography>
                            <Typography variant="body1" fontWeight={600}>{breakup.gst.component}{breakup.gst.percentage ? ` (${breakup.gst.percentage}%)` : ''}</Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="body2" color="text.secondary">Value</Typography>
                            <Typography variant="body1" fontWeight={600}>₹{breakup.gst.value.toLocaleString('en-IN')}</Typography>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Total */}
                      <Box sx={{ 
                        p: 3, 
                        backgroundColor: '#1a1a1a', 
                        borderRadius: 2,
                        color: 'white'
                      }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="h5" fontWeight={700}>
                            Total
                          </Typography>
                          <Typography variant="h5" fontWeight={700}>
                            ₹{breakup.total.toLocaleString('en-IN')}
                          </Typography>
                        </Stack>
                        

                      </Box>
                    </Stack>
                  );
                })()}
              </Paper>


            </Stack>
          )}
        </DialogContent>
      </Dialog>

      {/* Floating Contact Buttons */}
      <Box sx={{ position: 'fixed', right: 20, bottom: 20, zIndex: 1000 }}>
        <Stack spacing={2}>
          <Tooltip title="Call Us" placement="left">
            <Fab
              color="primary"
              sx={{
                backgroundColor: '#9c27b0',
                '&:hover': { backgroundColor: '#7b1fa2' }
              }}
            >
              <Phone />
            </Fab>
          </Tooltip>
          <Tooltip title="WhatsApp" placement="left">
            <Fab
              sx={{
                backgroundColor: '#4caf50',
                '&:hover': { backgroundColor: '#388e3c' }
              }}
            >
              <WhatsApp />
            </Fab>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );
};
