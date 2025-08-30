import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, useMediaQuery, useTheme, Container, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo } from '../../user/UserSlice';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { selectCartItems } from '../../cart/CartSlice';
import { selectLoggedInUser, logoutAsync } from '../../auth/AuthSlice';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import TuneIcon from '@mui/icons-material/Tune';
import { selectProductIsFilterOpen, toggleFilters } from '../../products/ProductSlice';
import MenuIcon from '@mui/icons-material/Menu';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HomeIcon from '@mui/icons-material/Home';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InfoIcon from '@mui/icons-material/Info';
import LoginIcon from '@mui/icons-material/Login';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

export const Navbar = ({ isProductList = false }) => {
  const cartItems = useSelector(selectCartItems)
  const loggedInUser = useSelector(selectLoggedInUser)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const wishlistItems = useSelector(selectWishlistItems)

  const handleToggleFilters = () => {
    dispatch(toggleFilters())
  }



  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: '#1a1a1a',
        boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #f0f0f0',
        top: 0,
        zIndex: 1100
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '70px' }}>
          {isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="/"
                sx={{
                  fontFamily: 'serif',
                  fontWeight: 700,
                  letterSpacing: '.2rem',
                  color: '#d4af37',
                  textDecoration: 'none',
                  fontSize: '1.2rem'
                }}
              >
                SILVER JEWELS
              </Typography>
              <IconButton
                size="large"
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
                color="inherit"
                sx={{ color: 'white' }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{ sx: { width: 260, bgcolor: '#232526', color: '#fff', pt: 2 } }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 1 }}>
                  <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#fff' }}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, px: 2 }}>
                  <Button startIcon={<HomeIcon />} sx={{ color: '#fff', justifyContent: 'flex-start', fontWeight: 600, fontSize: '1.1rem', textTransform: 'none' }} onClick={() => { navigate('/'); setDrawerOpen(false); }}>Home</Button>
                  <Button startIcon={<StorefrontIcon />} sx={{ color: '#fff', justifyContent: 'flex-start', fontWeight: 600, fontSize: '1.1rem', textTransform: 'none' }} onClick={() => { navigate('/shop'); setDrawerOpen(false); }}>Shop</Button>
                  <Button startIcon={<AssignmentIcon />} sx={{ color: '#fff', justifyContent: 'flex-start', fontWeight: 600, fontSize: '1.1rem', textTransform: 'none' }} onClick={() => { navigate('/chit-plans'); setDrawerOpen(false); }}>Chit Plan</Button>
                  <Button startIcon={<InfoIcon />} sx={{ color: '#fff', justifyContent: 'flex-start', fontWeight: 600, fontSize: '1.1rem', textTransform: 'none' }} onClick={() => { navigate('/about'); setDrawerOpen(false); }}>About</Button>
                  
                  {/* Cart and Wishlist for mobile */}
                  <Button 
                    startIcon={<ShoppingCartOutlinedIcon />} 
                    sx={{ color: '#fff', justifyContent: 'flex-start', fontWeight: 600, fontSize: '1.1rem', textTransform: 'none' }} 
                    onClick={() => {
                      if (loggedInUser) {
                        navigate('/cart');
                      } else {
                        sessionStorage.setItem('redirectAfterLogin', '/cart');
                        navigate('/login');
                      }
                      setDrawerOpen(false);
                    }}
                  >
                    Cart ({cartItems?.length || 0})
                  </Button>
                  <Button 
                    startIcon={<FavoriteBorderIcon />} 
                    sx={{ color: '#fff', justifyContent: 'flex-start', fontWeight: 600, fontSize: '1.1rem', textTransform: 'none' }} 
                    onClick={() => {
                      if (loggedInUser) {
                        navigate('/wishlist');
                      } else {
                        sessionStorage.setItem('redirectAfterLogin', '/wishlist');
                        navigate('/login');
                      }
                      setDrawerOpen(false);
                    }}
                  >
                    Wishlist ({wishlistItems?.length || 0})
                  </Button>
                  
                  {/* User actions */}
                  {loggedInUser ? (
                    <>
                      <Button startIcon={<PersonIcon />} sx={{ color: '#fff', justifyContent: 'flex-start', fontWeight: 600, fontSize: '1.1rem', textTransform: 'none' }} onClick={() => { navigate('/profile'); setDrawerOpen(false); }}>Profile</Button>
                      {loggedInUser.isAdmin && (
                        <Button startIcon={<AssignmentIcon />} sx={{ color: '#fff', justifyContent: 'flex-start', fontWeight: 600, fontSize: '1.1rem', textTransform: 'none' }} onClick={() => { navigate('/admin/dashboard'); setDrawerOpen(false); }}>Admin Dashboard</Button>
                      )}
                      <Button startIcon={<LogoutIcon />} sx={{ color: '#fff', justifyContent: 'flex-start', fontWeight: 600, fontSize: '1.1rem', textTransform: 'none' }} onClick={() => { dispatch(logoutAsync()); setDrawerOpen(false); }}>Logout</Button>
                    </>
                  ) : (
                    <Button startIcon={<LoginIcon />} sx={{ color: '#fff', justifyContent: 'flex-start', fontWeight: 600, fontSize: '1.1rem', textTransform: 'none' }} onClick={() => { navigate('/login'); setDrawerOpen(false); }}>Login</Button>
                  )}
                </Box>
              </Drawer>
            </Box>
          )}

          {/* Logo - shown on all screens */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'serif',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: '#d4af37',
              textDecoration: 'none',
              fontSize: '1.5rem'
            }}
          >
            SILVER JEWELS
          </Typography>

          {/* Desktop menu items */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 3 }}>
              <Button
                onClick={() => navigate('/')}
                sx={{ 
                  my: 2, 
                  color: 'white',
                  display: 'block',
                  fontWeight: 500,
                  fontSize: '1rem',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(212,175,55,0.1)',
                    color: '#d4af37'
                  }
                }}
              >
                Home
              </Button>
              <Button
                onClick={() => navigate('/shop')}
                sx={{ 
                  my: 2, 
                  color: 'white',
                  display: 'block',
                  fontWeight: 500,
                  fontSize: '1rem',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(212,175,55,0.1)',
                    color: '#d4af37'
                  }
                }}
              >
                Shop
              </Button>
              <Button
                onClick={() => navigate('/chit-plans')}
                sx={{ 
                  my: 2, 
                  color: 'white',
                  display: 'block',
                  fontWeight: 500,
                  fontSize: '1rem',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(212,175,55,0.1)',
                    color: '#d4af37'
                  }
                }}
              >
                Chit Plans
              </Button>
              <Button
                onClick={() => navigate('/about')}
                sx={{ 
                  my: 2, 
                  color: 'white',
                  display: 'block',
                  fontWeight: 500,
                  fontSize: '1rem',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(212,175,55,0.1)',
                    color: '#d4af37'
                  }
                }}
              >
                About
              </Button>
            </Box>
          )}

          {/* Right side actions */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Filter button for product list */}
            {isProductList && (
              <IconButton
                onClick={handleToggleFilters}
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(212,175,55,0.2)',
                    color: '#d4af37'
                  }
                }}
              >
                <TuneIcon />
              </IconButton>
            )}

            {/* Wishlist - Hidden on mobile */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Tooltip title="Wishlist">
                <IconButton
                  onClick={() => {
                    if (loggedInUser) {
                      navigate('/wishlist');
                    } else {
                      // Store the intended destination and redirect to login
                      sessionStorage.setItem('redirectAfterLogin', '/wishlist');
                      navigate('/login');
                    }
                  }}
                  sx={{
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(212,175,55,0.2)',
                      color: '#d4af37'
                    }
                  }}
                >
                  <Badge badgeContent={wishlistItems?.length || 0} color="error">
                    <FavoriteBorderIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Box>

            {/* Cart - Hidden on mobile */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Tooltip title="Cart">
                <IconButton
                  onClick={() => {
                    if (loggedInUser) {
                      navigate('/cart');
                    } else {
                      // Store the intended destination and redirect to login
                      sessionStorage.setItem('redirectAfterLogin', '/cart');
                      navigate('/login');
                    }
                  }}
                  sx={{
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(212,175,55,0.2)',
                      color: '#d4af37'
                    }
                  }}
                >
                  <Badge badgeContent={cartItems?.length || 0} color="error">
                    <ShoppingCartOutlinedIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Box>

            {/* User menu - Hidden on mobile */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              {loggedInUser ? (
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Your Account">
                    <IconButton onClick={() => navigate('/user-dashboard')} sx={{ p: 0 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: '#d4af37',
                          color: '#1a1a1a',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 4px 12px rgba(212,175,55,0.3)'
                          }
                        }}
                      >
                        {loggedInUser.name?.charAt(0)?.toUpperCase() || 'U'}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  {loggedInUser.isAdmin && (
                    <Button
                      onClick={() => navigate('/admin/dashboard')}
                      sx={{
                        ml: 2,
                        color: 'white',
                        backgroundColor: 'rgba(212,175,55,0.2)',
                        border: '1px solid #d4af37',
                        fontWeight: 600,
                        textTransform: 'none',
                        px: 2,
                        py: 0.5,
                        fontSize: '0.875rem',
                        '&:hover': {
                          backgroundColor: '#d4af37',
                          color: '#1a1a1a'
                        }
                      }}
                    >
                      Admin
                    </Button>
                  )}
                </Box>
              ) : (
                <Button
                  onClick={() => navigate('/login')}
                  sx={{
                    color: 'white',
                    backgroundColor: 'rgba(212,175,55,0.2)',
                    border: '1px solid #d4af37',
                    fontWeight: 600,
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    '&:hover': {
                      backgroundColor: '#d4af37',
                      color: '#1a1a1a'
                    }
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}