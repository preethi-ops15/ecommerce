import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { selectLoggedInUser, logoutAsync } from '../features/auth/AuthSlice';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Avatar,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  ShoppingCart as OrdersIcon,
  People as CustomersIcon,
  Analytics as AnalyticsIcon,
  AccountCircle,
  ExitToApp
} from '@mui/icons-material';
import { AdminDashBoard } from '../features/admin/components/AdminDashBoard';
import { AdminProducts } from '../features/admin/components/AdminProducts';
import { AdminOrders } from '../features/admin/components/AdminOrders';
import { AdminCustomers } from '../features/admin/components/AdminCustomers';
import { CustomerQueriesTable } from '../features/admin/components/CustomerQueriesTable';
import { AddProduct } from '../features/admin/components/AddProduct';
import { ProductUpdate } from '../features/admin/components/ProductUpdate';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, component: 'dashboard' },
  { text: 'Products', icon: <ProductsIcon />, component: 'products' },
  { text: 'Orders', icon: <OrdersIcon />, component: 'orders' },
  { text: 'Customers', icon: <CustomersIcon />, component: 'customers' },
  { text: 'Queries', icon: <AnalyticsIcon />, component: 'queries' },
  { text: 'Logout', icon: <ExitToApp />, action: 'logout' },
];

export const AdminPage = () => {
  const [selectedComponent, setSelectedComponent] = useState('products'); // Start with products
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loggedInUser = useSelector(selectLoggedInUser);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutAsync());
    navigate('/login');
  };

  // Sync selectedComponent with current location
  React.useEffect(() => {
    if (location.pathname === '/admin' || location.pathname === '/admin/dashboard') {
      // Only update selectedComponent when on main admin routes
      // Keep the current selection when on add-product or product-update routes
    }
  }, [location.pathname]);

  const handleMenuClick = (item) => {
    if (item.action === 'logout') {
      handleLogout();
    } else {
      setSelectedComponent(item.component);
      // Navigate to the admin dashboard when clicking sidebar items
      navigate('/admin');
    }
  };

  const renderComponent = () => {
    // Check if we're on a specific route
    if (location.pathname === '/admin/add-product') {
      return <AddProduct />;
    }
    
    if (location.pathname.startsWith('/admin/product-update/')) {
      return <ProductUpdate />;
    }

    // Default sidebar navigation
    switch (selectedComponent) {
      case 'dashboard':
        return <AdminDashBoard />;
      case 'products':
        return <AdminProducts />;
      case 'orders':
        return <AdminOrders />;
      case 'customers':
        return <AdminCustomers />;
      case 'queries':
        return <CustomerQueriesTable />;
      default:
        return <AdminProducts />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          bgcolor: '#1976d2'
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                bgcolor: '#fff',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                J
              </Typography>
            </Box>
            <Typography variant="h6" noWrap component="div" sx={{ color: '#fff' }}>
              Jewells Admin
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: '#fff' }}>
              Admin
            </Typography>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#fff', color: '#1976d2' }}>
                A
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <ExitToApp fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#f5f5f5'
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={item.component ? selectedComponent === item.component : false}
                onClick={() => handleMenuClick(item)}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: '#1976d2',
                    color: '#fff',
                    '&:hover': {
                      bgcolor: '#1565c0',
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#fff',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: item.component && selectedComponent === item.component ? '#fff' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f8f9fa',
          minHeight: '100vh',
          p: 3,
        }}
      >
        <Toolbar />
        {renderComponent()}
      </Box>
    </Box>
  );
};
