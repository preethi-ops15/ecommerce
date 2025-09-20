import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge, Button, useMediaQuery, useTheme, Container, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo } from '../../user/UserSlice';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { selectCartItems } from '../../cart/CartSlice';
import { selectLoggedInUser, logoutAsync } from '../../auth/AuthSlice';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import { useLoginPopup } from '../../../contexts/LoginPopupContext';
import TuneIcon from '@mui/icons-material/Tune';
import { selectProductIsFilterOpen, toggleFilters } from '../../products/ProductSlice';
import MenuIcon from '@mui/icons-material/Menu';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HomeIcon from '@mui/icons-material/Home';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InfoIcon from '@mui/icons-material/Info';
import LoginIcon from '@mui/icons-material/Login';
import Calculate from '@mui/icons-material/Calculate';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

export const Navbar = ({ isProductList = false }) => {
  const cartItems = useSelector(selectCartItems)
  const loggedInUser = useSelector(selectLoggedInUser)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [showNavOptions, setShowNavOptions] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const { openLoginPopup } = useLoginPopup();

  const wishlistItems = useSelector(selectWishlistItems)
  const isHome = location.pathname === '/'
  const isShop = location.pathname.startsWith('/shop')
  const isShopOrHome = isShop || isHome

  // Handle scroll effect (blur/elevation) and hide-on-scroll for Shop and Home pages
  React.useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 50);

      // Apply hide-on-scroll only on Shop and Home pages
      const isShopOrHome = location.pathname.startsWith('/shop') || location.pathname === '/';
      if (!isShopOrHome) {
        setShowNavOptions(true);
        setLastScrollY(currentY);
        return;
      }

      const delta = currentY - lastScrollY;
      const threshold = 6; // minimal movement to toggle
      if (Math.abs(delta) > threshold) {
        if (delta > 0) {
          // Scrolling down -> hide options
          setShowNavOptions(false);
        } else {
          // Scrolling up -> show options
          setShowNavOptions(true);
        }
        setLastScrollY(currentY);
      }
      // If near top, always show
      if (currentY < 10) setShowNavOptions(true);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, location.pathname]);

  const handleToggleFilters = () => {
    dispatch(toggleFilters())
  }



  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: isScrolled ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.12)',
        backdropFilter: 'saturate(180%) blur(12px)',
        WebkitBackdropFilter: 'saturate(180%) blur(12px)',
        boxShadow: isScrolled ? '0 8px 24px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.08)',
        borderBottom: '1px solid rgba(212,175,55,0.35)',
        top: 0,
        zIndex: 1100,
        transition: 'all 0.3s ease-in-out',
        transform: (isShopOrHome && !showNavOptions) ? 'translateY(-120%)' : 'translateY(0)',
        pointerEvents: (isShopOrHome && !showNavOptions) ? 'none' : 'auto'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '70px' }}>
          {isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              <Box
                component="a"
                href="/"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: '#d4af37',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
                  }
                }}
              >
                <Typography
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    fontFamily: 'serif'
                  }}
                >
                  SJ
                </Typography>
              </Box>
          
              {(!location.pathname.startsWith('/shop') || showNavOptions) && (
              <IconButton
                size="large"
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
                color="inherit"
                sx={{ 
                  color: isScrolled ? '#1a1a1a' : '#f5f5f5',
                  backgroundColor: isScrolled ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.08)',
                  border: isScrolled ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#d4af37',
                    color: 'white',
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 12px rgba(212,175,55,0.3)'
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
              )}
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
                  <Button startIcon={<AssignmentIcon />} sx={{ color: '#fff', justifyContent: 'flex-start', fontWeight: 600, fontSize: '1.1rem', textTransform: 'none' }} onClick={() => { 
                    setDrawerOpen(false);
                    const chitPlansElement = document.getElementById('chit-plans');
                    if (chitPlansElement) {
                      chitPlansElement.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      navigate('/');
                      setTimeout(() => {
                        const element = document.getElementById('chit-plans');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 100);
                    }
                  }}>Chit Plan</Button>
                  <Button startIcon={<Calculate />} sx={{ color: '#fff', justifyContent: 'flex-start', fontWeight: 600, fontSize: '1.1rem', textTransform: 'none' }} onClick={() => { 
                    setDrawerOpen(false);
                    const calculatorElement = document.getElementById('calculator');
                    if (calculatorElement) {
                      calculatorElement.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      navigate('/');
                      setTimeout(() => {
                        const element = document.getElementById('calculator');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 100);
                    }
                  }}>Calculator</Button>
                  
                  {/* Cart and Wishlist for mobile - hidden on home */}
                  {!isHome && (
                    <>
                      <Button 
                        startIcon={<ShoppingCartOutlinedIcon />} 
                        sx={{ color: '#fff', justifyContent: 'flex-start', fontWeight: 600, fontSize: '1.1rem', textTransform: 'none' }} 
                        onClick={() => {
                          if (loggedInUser) {
                            navigate('/cart');
                          } else {
                            sessionStorage.setItem('redirectAfterLogin', '/cart');
                            openLoginPopup();
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
                            openLoginPopup();
                          }
                          setDrawerOpen(false);
                        }}
                      >
                        Wishlist ({wishlistItems?.length || 0})
                      </Button>
                    </>
                  )}
                  
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
                    <Button startIcon={<LoginIcon />} sx={{ color: '#fff', justifyContent: 'flex-start', fontWeight: 600, fontSize: '1.1rem', textTransform: 'none' }} onClick={() => { openLoginPopup(); setDrawerOpen(false); }}>Login</Button>
                  )}
                </Box>
              </Drawer>
            </Box>
          )}

          {/* Logo - shown on all screens */}
          <Box
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: 40, md: 50 },
              height: { xs: 40, md: 50 },
              borderRadius: '50%',
              backgroundColor: '#d4af37',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
              }
            }}
          >
            {/* Logo Icon - Replace with your actual logo image */}
            <Typography
              sx={{
                color: 'white',
                fontWeight: 700,
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                fontFamily: 'serif'
              }}
            >
              SJ
            </Typography>
            {/* 
              To add your logo image, replace the Typography above with:
              <img 
                src="/path-to-your-logo.png" 
                alt="Silver Jewels Logo" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  borderRadius: '50%'
                }} 
              />
            */}
          </Box>

          {/* Desktop menu items */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: ((!location.pathname.startsWith('/shop') && location.pathname !== '/') || showNavOptions) ? 'flex' : 'none', justifyContent: 'center', gap: 3, alignItems: 'center' }}>
              {location.pathname.startsWith('/shop') && (
                <Typography sx={{
                  color: isScrolled ? '#1a1a1a' : '#f5f5f5',
                  fontWeight: 700,
                  letterSpacing: 1,
                  mr: 2
                }}>
                  Explore our products
                </Typography>
              )}
              <Button
                onClick={() => navigate('/')}
                sx={{ 
                  my: 2, 
                  color: isScrolled ? '#1a1a1a' : '#f5f5f5',
                  display: 'block',
                  fontWeight: 500,
                  fontSize: '1rem',
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#d4af37',
                    color: 'white',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(212,175,55,0.3)'
                  }
                }}
              >
                Home
              </Button>
              <Button
                onClick={() => navigate('/shop')}
                sx={{ 
                  my: 2, 
                  color: isScrolled ? '#1a1a1a' : '#f5f5f5',
                  display: 'block',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  '&:hover': {
                    backgroundColor: '#d4af37',
                    color: 'white',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(212,175,55,0.3)'
                  }
                }}
              >
                Shop
              </Button>
              <Button
                onClick={() => {
                  const chitPlansElement = document.getElementById('chit-plans');
                  if (chitPlansElement) {
                    chitPlansElement.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/');
                    setTimeout(() => {
                      const element = document.getElementById('chit-plans');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }
                }}
                sx={{ 
                  my: 2, 
                  color: isScrolled ? '#1a1a1a' : '#f5f5f5',
                  display: 'block',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  '&:hover': {
                    backgroundColor: '#d4af37',
                    color: 'white',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(212,175,55,0.3)'
                  }
                }}
              >
                Chit Plans
              </Button>
              <Button
                onClick={() => {
                  const calculatorElement = document.getElementById('calculator');
                  if (calculatorElement) {
                    calculatorElement.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/');
                    setTimeout(() => {
                      const element = document.getElementById('calculator');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }
                }}
                sx={{ 
                  my: 2, 
                  color: isScrolled ? '#1a1a1a' : '#f5f5f5',
                  display: 'block',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  '&:hover': {
                    backgroundColor: '#d4af37',
                    color: 'white',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(212,175,55,0.3)'
                  }
                }}
              >
                Calculator
              </Button>
            </Box>
          )}

          {/* Right side actions */}
          <Box sx={{ flexGrow: 0, display: ((!location.pathname.startsWith('/shop') && location.pathname !== '/') || showNavOptions) ? 'flex' : 'none', alignItems: 'center', gap: 2 }}>
            {/* Filter button for product list */}
            {isProductList && (
              <IconButton
                onClick={handleToggleFilters}
                sx={{
                  color: isScrolled ? '#1a1a1a' : '#f5f5f5',
                  backgroundColor: isScrolled ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.08)',
                  border: isScrolled ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#d4af37',
                    color: 'white',
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 12px rgba(212,175,55,0.3)'
                  }
                }}
              >
                <TuneIcon />
              </IconButton>
            )}

            {/* Wishlist - Hidden on mobile and hidden on home */}
            {!isHome && (
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Tooltip title="Wishlist">
                <IconButton
                  onClick={() => {
                    if (loggedInUser) {
                      navigate('/wishlist');
                    } else {
                      // Store the intended destination and redirect to login
                      sessionStorage.setItem('redirectAfterLogin', '/wishlist');
                      openLoginPopup();
                    }
                  }}
                  sx={{
                    color: isScrolled ? '#1a1a1a' : '#f5f5f5',
                    backgroundColor: isScrolled ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.08)',
                    border: isScrolled ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#d4af37',
                      color: 'white',
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 12px rgba(212,175,55,0.3)'
                    }
                  }}
                >
                  <Badge badgeContent={wishlistItems?.length || 0} color="error">
                    <FavoriteBorderIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Box>
            )}

            {/* Cart - Hidden on mobile and hidden on home */}
            {!isHome && (
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Tooltip title="Cart">
                <IconButton
                  onClick={() => {
                    if (loggedInUser) {
                      navigate('/cart');
                    } else {
                      // Store the intended destination and redirect to login
                      sessionStorage.setItem('redirectAfterLogin', '/cart');
                      openLoginPopup();
                    }
                  }}
                  sx={{
                    color: isScrolled ? '#1a1a1a' : '#f5f5f5',
                    backgroundColor: isScrolled ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.08)',
                    border: isScrolled ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#d4af37',
                      color: 'white',
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 12px rgba(212,175,55,0.3)'
                    }
                  }}
                >
                  <Badge badgeContent={cartItems?.length || 0} color="error">
                    <ShoppingCartOutlinedIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Box>
            )}
            {/* User menu - Hidden on mobile */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              {loggedInUser ? (
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Your Account">
                    <IconButton onClick={() => navigate('/user-dashboard')} sx={{ p: 0 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: '#d4af37',
                          color: isScrolled ? '#1a1a1a' : '#666666',
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
                  onClick={() => openLoginPopup()}
                  sx={{
                    color: 'white',
                    backgroundColor: '#d4af37',
                    border: '1px solid #d4af37',
                    fontWeight: 600,
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(212,175,55,0.3)',
                    '&:hover': {
                      backgroundColor: '#b8860b',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(212,175,55,0.4)'
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