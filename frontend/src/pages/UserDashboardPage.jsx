import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Tabs,
  Tab,
  Stack
} from '@mui/material';
import {
  Person,
  ShoppingBag,
  Favorite,
  LocationOn,
  PowerSettingsNew,
  Edit,
  AccountBalance,
  Add as AddIcon,
  Visibility,
  Delete,
  Star,
  Close,
  Save,
  CheckCircle
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectLoggedInUser, logoutAsync } from '../features/auth/AuthSlice';
import { selectCartItems } from '../features/cart/CartSlice';
import { selectWishlistItems } from '../features/wishlist/WishlistSlice';
import { toast } from 'react-toastify';
import {
  getUserProfile,
  updateUserProfile,
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  getUserOrders,
  getOrderDetails,
  getUserChitPlans,
  removeFromWishlist,
  addToCartFromWishlist
} from '../features/dashboard/DashboardApi';

const UserDashboardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectLoggedInUser);
  const wishlistItems = useSelector(selectWishlistItems);
  
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [userChitPlans, setUserChitPlans] = useState([]);
  
  // Dialog states
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [addAddressOpen, setAddAddressOpen] = useState(false);
  const [editAddressOpen, setEditAddressOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: ''
  });
  
  const [addressForm, setAddressForm] = useState({
    street: '',
    phoneNumber: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    type: 'Home'
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Redirect to home if user is not logged in
  useEffect(() => {
    if (!loggedInUser) {
      navigate('/', { replace: true });
    }
  }, [loggedInUser, navigate]);

  const handleLogout = () => {
    dispatch(logoutAsync());
    navigate('/');
  };

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: <Person /> },
    { id: 'orders', label: 'My Orders', icon: <ShoppingBag /> },
    { id: 'wishlist', label: 'My Wishlist', icon: <Favorite /> },
    { id: 'address', label: 'My Address', icon: <LocationOn /> },
    { id: 'chitplan', label: 'My Chit Plan', icon: <AccountBalance /> },
    { id: 'logout', label: 'Logout', icon: <PowerSettingsNew />, action: handleLogout }
  ];

  const handleMenuClick = (item) => {
    if (item.action) {
      item.action();
    } else {
      setActiveSection(item.id);
    }
  };

  // Load data functions
  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await getUserProfile();
      setUserProfile(profile);
      setProfileForm({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile information');
    } finally {
      setLoading(false);
    }
  };

  const loadUserAddresses = async () => {
    try {
      setLoading(true);
      const addresses = await getUserAddresses();
      setUserAddresses(addresses);
    } catch (error) {
      console.error('Error loading addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const loadUserOrders = async () => {
    try {
      setLoading(true);
      const orders = await getUserOrders();
      setUserOrders(orders);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const loadUserChitPlans = async () => {
    try {
      setLoading(true);
      const plans = await getUserChitPlans();
      setUserChitPlans(plans);
    } catch (error) {
      console.error('Error loading chit plans:', error);
      // Don't show error for chit plans as it might not exist
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (loggedInUser?._id) {
      // Store user ID in localStorage for API calls
      localStorage.setItem('userId', loggedInUser._id);
      loadUserProfile();
      loadUserAddresses();
      loadUserOrders();
      loadUserChitPlans();
    }
  }, [loggedInUser]);

  // Profile functions
  const handleEditProfile = () => {
    setEditProfileOpen(true);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await updateUserProfile(profileForm);
      await loadUserProfile();
      setEditProfileOpen(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Address functions
  const handleAddAddress = () => {
    setAddressForm({
      street: '',
      phoneNumber: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      type: 'Home'
    });
    setAddAddressOpen(true);
  };

  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setAddressForm({
      street: address.street || '',
      phoneNumber: address.phoneNumber || '',
      city: address.city || '',
      state: address.state || '',
      postalCode: address.postalCode || '',
      country: address.country || 'India',
      type: address.type || 'Home'
    });
    setEditAddressOpen(true);
  };

  const handleSaveAddress = async () => {
    try {
      setLoading(true);
      const addressData = {
        ...addressForm,
        user: loggedInUser?._id || localStorage.getItem('userId') || 'default'
      };
      
      if (selectedAddress) {
        await updateAddress(selectedAddress._id, addressData);
        toast.success('Address updated successfully');
      } else {
        await createAddress(addressData);
        toast.success('Address added successfully');
      }
      await loadUserAddresses();
      setAddAddressOpen(false);
      setEditAddressOpen(false);
      setSelectedAddress(null);
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    
    try {
      setLoading(true);
      await deleteAddress(addressId);
      await loadUserAddresses();
      toast.success('Address deleted successfully');
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    } finally {
      setLoading(false);
    }
  };

  // Order functions
  const handleViewOrder = async (order) => {
    try {
      setLoading(true);
      const orderDetails = await getOrderDetails(order._id);
      setSelectedOrder(orderDetails);
      setOrderDetailsOpen(true);
    } catch (error) {
      console.error('Error loading order details:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  // Wishlist functions
  const handleRemoveFromWishlist = async (wishlistId) => {
    try {
      setLoading(true);
      await removeFromWishlist(wishlistId);
      toast.success('Item removed from wishlist');
      // Refresh wishlist data
      window.location.reload();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      setLoading(true);
      await addToCartFromWishlist(productId);
      toast.success('Item added to cart');
      // Refresh cart data
      window.location.reload();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const renderProfileContent = () => (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        mb: 3,
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography variant={isMobile ? "h5" : "h4"} fontWeight={600} sx={{ color: '#8B4513' }}>
          Profile Information
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Edit />}
          onClick={handleEditProfile}
          size={isMobile ? "small" : "medium"}
          sx={{
            borderColor: '#d32f2f',
            color: '#d32f2f',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              borderColor: '#b71c1c',
              color: '#b71c1c',
              backgroundColor: '#fff5f5'
            }
          }}
        >
          Edit
        </Button>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 3 }, backgroundColor: '#fff5f5', borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={600} sx={{ color: '#8B4513', mb: 2 }}>
          My Personal Life
        </Typography>
        
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Name
            </Typography>
            <Typography variant="body1" fontWeight={600} sx={{ color: '#1a1a1a' }}>
              {userProfile?.name || loggedInUser?.name || 'DEV'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Phone Number
            </Typography>
            <Typography variant="body1" fontWeight={600} sx={{ color: '#1a1a1a' }}>
              {userProfile?.phone || loggedInUser?.phone || '9677547529'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Email
            </Typography>
            <Typography variant="body1" fontWeight={600} sx={{ color: '#1a1a1a' }}>
              {userProfile?.email || loggedInUser?.email || 'devprasanth.e@gmail.com'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Date of birth
            </Typography>
            <Typography variant="body1" fontWeight={600} sx={{ color: '#1a1a1a' }}>
              {userProfile?.dateOfBirth || '2004-03-04'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );

  const renderOrdersContent = () => (
    <Box>
      <Typography variant={isMobile ? "h5" : "h4"} fontWeight={600} sx={{ color: '#8B4513', mb: 3 }}>
        My Orders
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : userOrders.length > 0 ? (
        isMobile ? (
          // Mobile view - Cards instead of table
          <Stack spacing={2}>
            {userOrders.map((order) => (
              <Card key={order._id} sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Order #{order._id.slice(-8)}
                    </Typography>
                    <Chip
                      label={order.status}
                      color={order.status === 'Delivered' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Items: {order.items?.length || 0}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight={600}>
                      ₹{order.totalAmount?.toLocaleString('en-IN')}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() => handleViewOrder(order)}
                      sx={{ color: '#d32f2f', textTransform: 'none' }}
                    >
                      View
                    </Button>
                  </Box>
                </Stack>
              </Card>
            ))}
          </Stack>
        ) : (
          // Desktop view - Table
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Items</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userOrders.map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={order.status === 'Delivered' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{order.items?.length || 0}</TableCell>
                    <TableCell>₹{order.totalAmount?.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handleViewOrder(order)}
                        sx={{ color: '#d32f2f', textTransform: 'none' }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      ) : (
        <Paper sx={{ p: { xs: 3, md: 4 }, textAlign: 'center', backgroundColor: '#f8f8f8' }}>
          <ShoppingBag sx={{ fontSize: { xs: 48, md: 64 }, color: '#ccc', mb: 2 }} />
          <Typography variant={isMobile ? "h6" : "h6"} color="text.secondary" sx={{ mb: 2 }}>
            No orders yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start shopping to see your orders here
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/shop')}
            size={isMobile ? "small" : "medium"}
            sx={{
              backgroundColor: '#d32f2f',
              color: 'white',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#b71c1c'
              }
            }}
          >
            Start Shopping
          </Button>
        </Paper>
      )}
    </Box>
  );

  const renderWishlistContent = () => (
    <Box>
      <Typography variant="h4" fontWeight={600} sx={{ color: '#8B4513', mb: 3 }}>
        My Wishlist
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : wishlistItems.length > 0 ? (
        <Grid container spacing={3}>
          {wishlistItems.slice(0, 6).map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'relative' }}>
                  <img
                    src={item.product.thumbnail}
                    alt={item.product.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover'
                    }}
                  />
                  <IconButton
                    onClick={() => handleRemoveFromWishlist(item._id)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                    }}
                  >
                    <Delete sx={{ color: '#d32f2f' }} />
                  </IconButton>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                    {item.product.title}
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="#d32f2f" sx={{ mb: 2 }}>
                    ₹{item.product.price?.toLocaleString('en-IN')}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    size="small"
                    onClick={() => handleAddToCart(item.product._id)}
                    sx={{
                      backgroundColor: '#d32f2f',
                      color: 'white',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#b71c1c'
                      }
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f8f8f8' }}>
          <Favorite sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Your wishlist is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add items to your wishlist to see them here
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/shop')}
            sx={{
              backgroundColor: '#d32f2f',
              color: 'white',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#b71c1c'
              }
            }}
          >
            Start Shopping
          </Button>
        </Paper>
      )}
    </Box>
  );

  const renderAddressContent = () => (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        mb: 3,
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography variant={isMobile ? "h5" : "h4"} fontWeight={600} sx={{ color: '#8B4513' }}>
          My Addresses
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddAddress}
          size={isMobile ? "small" : "medium"}
          sx={{
            backgroundColor: '#d32f2f',
            color: 'white',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#b71c1c'
            }
          }}
        >
          Add Address
        </Button>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : userAddresses.length > 0 ? (
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {userAddresses.map((address) => (
            <Grid item xs={12} md={6} key={address._id}>
              <Card sx={{ p: { xs: 2, md: 3 }, border: address.isDefault ? '2px solid #d32f2f' : '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={600} sx={{ color: '#1a1a1a' }}>
                      {address.type} Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {address.phoneNumber}
                    </Typography>
                  </Box>
                  {address.isDefault && (
                    <Chip
                      label="Default"
                      size="small"
                      sx={{ backgroundColor: '#d32f2f', color: 'white' }}
                    />
                  )}
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {address.street}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {address.city}, {address.state} - {address.postalCode}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleEditAddress(address)}
                    sx={{
                      borderColor: '#d32f2f',
                      color: '#d32f2f',
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#b71c1c',
                        color: '#b71c1c'
                      }
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteAddress(address._id)}
                    sx={{ textTransform: 'none' }}
                  >
                    Delete
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: { xs: 3, md: 4 }, textAlign: 'center', backgroundColor: '#f8f8f8' }}>
          <LocationOn sx={{ fontSize: { xs: 48, md: 64 }, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No addresses saved
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add your first address to make checkout easier
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddAddress}
            size={isMobile ? "small" : "medium"}
            sx={{
              backgroundColor: '#d32f2f',
              color: 'white',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#b71c1c'
              }
            }}
          >
            Add Address
          </Button>
        </Paper>
      )}
    </Box>
  );

  const renderChitPlanContent = () => (
    <Box>
      <Typography variant="h4" fontWeight={600} sx={{ color: '#8B4513', mb: 3 }}>
        My Chit Plan
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : loggedInUser?.chitPlan ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ color: '#1a1a1a', mb: 2 }}>
                {loggedInUser.chitPlan.planName}
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Monthly Contribution
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                    ₹{getMonthlyAmount(loggedInUser.chitPlan.planId)?.toLocaleString('en-IN')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                    12 months
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                    Total Investment
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                    ₹{(getMonthlyAmount(loggedInUser.chitPlan.planId) * 12)?.toLocaleString('en-IN')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Jewelry Value
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                    ₹{getJewelryValue(loggedInUser.chitPlan.planId)?.toLocaleString('en-IN')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Start Date
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {new Date(loggedInUser.chitPlan.startDate).toLocaleDateString('en-IN')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Subscribed On
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {new Date(loggedInUser.chitPlan.subscribedAt).toLocaleDateString('en-IN')}
                    </Typography>
                  </Grid>
                </Grid>
                <Chip
                label={loggedInUser.chitPlan.status}
                color={loggedInUser.chitPlan.status === 'active' ? 'success' : 'warning'}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  fullWidth
                onClick={() => navigate('/chit-plans')}
                  sx={{
                    backgroundColor: '#d32f2f',
                    color: 'white',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#b71c1c'
                    }
                  }}
                >
                Manage Plan
                </Button>
              </Card>
            </Grid>
          
          {/* Plan Benefits */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" fontWeight={600} sx={{ color: '#1a1a1a', mb: 2 }}>
                Plan Benefits
              </Typography>
              <Stack spacing={1.5}>
                {getPlanFeatures(loggedInUser.chitPlan.planId).map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                    <Typography variant="body2">{feature}</Typography>
                  </Box>
                ))}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f8f8f8' }}>
          <AccountBalance sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No active chit plans
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start your chit plan to save money and get beautiful jewelry
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/chit-plans')}
            sx={{
              backgroundColor: '#d32f2f',
              color: 'white',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#b71c1c'
              }
            }}
          >
            Start Your Chit Plan
          </Button>
        </Paper>
      )}
    </Box>
  );

  // Helper functions for chit plan data
  const getMonthlyAmount = (planId) => {
    const planDetails = {
      1: 1000,
      2: 2500,
      3: 5000
    };
    return planDetails[planId] || 0;
  };

  const getJewelryValue = (planId) => {
    const jewelryValues = {
      1: 15000,
      2: 40000,
      3: 80000
    };
    return jewelryValues[planId] || 0;
  };

  const getPlanFeatures = (planId) => {
    const features = {
      1: [
        '₹1000 monthly investment',
        'Total Savings: ₹12,000',
        'Eligible for jewelry up to ₹15,000',
        'Priority customer support'
      ],
      2: [
        '₹2,500 monthly investment',
        'Total Savings: ₹30,000',
        'Eligible for jewelry up to ₹40,000',
        'Priority customer support',
        '5% discount on making charges'
      ],
      3: [
        '₹5,000 monthly investment',
        'Total Savings: ₹60,000',
        'Eligible for jewelry up to ₹80,000',
        '24/7 Priority support',
        '7% discount on making charges',
        'Free annual jewelry cleaning'
      ]
    };
    return features[planId] || [];
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileContent();
      case 'orders':
        return renderOrdersContent();
      case 'wishlist':
        return renderWishlistContent();
      case 'address':
        return renderAddressContent();
      case 'chitplan':
        return renderChitPlanContent();
      default:
        return renderProfileContent();
    }
  };

  // Show loading if user is not logged in
  if (!loggedInUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, md: 2 } }}>
      {/* Mobile Header */}
      {isMobile && (
        <Box sx={{ mb: 3, display: { xs: 'block', md: 'none' } }}>
          <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: 'white' }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  bgcolor: '#d32f2f',
                  color: 'white',
                  width: 48,
                  height: 48
                }}
              >
                {loggedInUser?.name?.charAt(0)?.toUpperCase() || 'D'}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Hello,
                </Typography>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#1a1a1a' }}>
                  {loggedInUser?.name || 'DEV'}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>
      )}

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Left Sidebar - Hidden on mobile, shown on desktop */}
        <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: 'white' }}>
            {/* User Greeting */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: '#d32f2f',
                  color: 'white',
                  width: 56,
                  height: 56,
                  mr: 2
                }}
              >
                {loggedInUser?.name?.charAt(0)?.toUpperCase() || 'D'}
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Hello,
                </Typography>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#1a1a1a' }}>
                  {loggedInUser?.name || 'DEV'}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Navigation Menu */}
            <List sx={{ p: 0 }}>
              {menuItems.map((item) => (
                <ListItem
                  key={item.id}
                  button
                  onClick={() => handleMenuClick(item)}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: activeSection === item.id ? '#fff5f5' : 'transparent',
                    color: activeSection === item.id ? '#d32f2f' : '#1a1a1a',
                    '&:hover': {
                      backgroundColor: '#fff5f5',
                      color: '#d32f2f'
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: activeSection === item.id ? '#d32f2f' : '#666',
                    minWidth: 40
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: activeSection === item.id ? 600 : 400
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Mobile Navigation Tabs */}
        <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
          <Paper sx={{ borderRadius: 2, backgroundColor: 'white', overflow: 'hidden' }}>
            <Tabs
              value={activeSection}
              onChange={(e, newValue) => setActiveSection(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  minWidth: 'auto',
                  px: 2,
                  py: 1.5,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'none'
                },
                '& .Mui-selected': {
                  color: '#d32f2f',
                  fontWeight: 600
                }
              }}
            >
              {menuItems.filter(item => item.id !== 'logout').map((item) => (
                <Tab
                  key={item.id}
                  value={item.id}
                  label={item.label}
                  icon={item.icon}
                  iconPosition="start"
                />
              ))}
            </Tabs>
          </Paper>
          
          {/* Mobile Logout Button */}
          <Box sx={{ mt: 2, display: { xs: 'block', md: 'none' } }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<PowerSettingsNew />}
              onClick={handleLogout}
              fullWidth
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderColor: '#d32f2f',
                color: '#d32f2f',
                '&:hover': {
                  borderColor: '#b71c1c',
                  color: '#b71c1c',
                  backgroundColor: '#fff5f5'
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Grid>

        {/* Right Content Area */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ 
            p: { xs: 2, md: 4 }, 
            borderRadius: 2, 
            backgroundColor: 'white', 
            minHeight: { xs: 'auto', md: '60vh' }
          }}>
            {renderContent()}
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog 
        open={editProfileOpen} 
        onClose={() => setEditProfileOpen(false)} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" fontWeight={600} sx={{ fontSize: isMobile ? '1.25rem' : '1.125rem' }}>
            Edit Profile
          </Typography>
          <IconButton onClick={() => setEditProfileOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={profileForm.dateOfBirth}
                onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                size={isMobile ? "small" : "medium"}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, md: 2 } }}>
          <Button onClick={() => setEditProfileOpen(false)} size={isMobile ? "small" : "medium"}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveProfile} 
            variant="contained"
            startIcon={<Save />}
            size={isMobile ? "small" : "medium"}
            sx={{ backgroundColor: '#d32f2f' }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Address Dialog */}
      <Dialog open={addAddressOpen || editAddressOpen} onClose={() => {
        setAddAddressOpen(false);
        setEditAddressOpen(false);
        setSelectedAddress(null);
      }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" fontWeight={600} sx={{ fontSize: '1.125rem' }}>
            {selectedAddress ? 'Edit Address' : 'Add New Address'}
          </Typography>
          <IconButton onClick={() => {
            setAddAddressOpen(false);
            setEditAddressOpen(false);
            setSelectedAddress(null);
          }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                multiline
                rows={3}
                value={addressForm.street}
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                placeholder="Enter your complete street address"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={addressForm.phoneNumber}
                onChange={(e) => setAddressForm({ ...addressForm, phoneNumber: e.target.value })}
                placeholder="Enter your phone number"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                placeholder="Enter your city"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State"
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                placeholder="Enter your state"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postal Code"
                value={addressForm.postalCode}
                onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                placeholder="Enter your postal code"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                value={addressForm.country}
                onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                placeholder="Enter your country"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Address Type</InputLabel>
                <Select
                  value={addressForm.type}
                  label="Address Type"
                  onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value })}
                >
                  <MenuItem value="Home">Home</MenuItem>
                  <MenuItem value="Office">Office</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setAddAddressOpen(false);
            setEditAddressOpen(false);
            setSelectedAddress(null);
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveAddress} 
            variant="contained"
            startIcon={<Save />}
            sx={{ backgroundColor: '#d32f2f' }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={orderDetailsOpen} onClose={() => setOrderDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" fontWeight={600} sx={{ fontSize: '1.125rem' }}>
            Order Details
          </Typography>
          <IconButton onClick={() => setOrderDetailsOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Order ID: {selectedOrder._id}</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>Status: {selectedOrder.status}</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>Total: ₹{selectedOrder.totalAmount?.toLocaleString('en-IN')}</Typography>
              
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Items:</Typography>
                  {selectedOrder.items.map((item, index) => (
                    <Box key={index} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, mb: 1 }}>
                      <Typography variant="body1" fontWeight={600}>{item.product?.title}</Typography>
                      <Typography variant="body2" color="text.secondary">Quantity: {item.quantity}</Typography>
                      <Typography variant="body2" color="text.secondary">Price: ₹{item.price?.toLocaleString('en-IN')}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserDashboardPage; 