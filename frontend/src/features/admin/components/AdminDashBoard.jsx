import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Stack,
  Chip,
  LinearProgress,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  TrendingUp,
  People,
  ShoppingCart,
  AttachMoney,
  Inventory,
  QueryBuilder,
  Star,
  Visibility
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const StatCard = ({ title, value, icon, color, subtitle, percentage }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card sx={{ 
      height: '100%', 
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      border: `1px solid ${color}20`
    }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight={700} color={color}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ 
            p: 2, 
            borderRadius: 2, 
            bgcolor: `${color}15`,
            color: color 
          }}>
            {icon}
          </Box>
        </Stack>
        {percentage && (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
            <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
            <Typography variant="caption" color="success.main">
              +{percentage}% from last month
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

export const AdminDashBoard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    pendingQueries: 0,
    resolvedQueries: 0
  });
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch data from multiple endpoints
      const [ordersRes, productsRes, usersRes, queriesRes] = await Promise.all([
        axios.get('/api/orders'),
        axios.get('/api/products'),
        axios.get('/api/users'),
        axios.get('/api/queries')
      ]);

      // Calculate revenue from orders
      const orders = ordersRes.data.orders || [];
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const totalOrders = orders.length;

      // Get product count
      const products = productsRes.data.products || [];
      const totalProducts = products.filter(p => !p.isDeleted).length;

      // Get user count
      const users = usersRes.data.users || [];
      const totalCustomers = users.length;

      // Get query statistics
      const queries = queriesRes.data.queries || [];
      const pendingQueries = queries.filter(q => q.status === 'pending').length;
      const resolvedQueries = queries.filter(q => q.status === 'resolved').length;

      setStats({
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        pendingQueries,
        resolvedQueries
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default values if API fails
      setStats({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
        pendingQueries: 0,
        resolvedQueries: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: <AttachMoney sx={{ fontSize: 32 }} />,
      color: 'success.main',
      subtitle: 'This month',
      percentage: 15
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <ShoppingCart sx={{ fontSize: 32 }} />,
      color: 'primary.main',
      subtitle: 'Orders placed',
      percentage: 8
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: <People sx={{ fontSize: 32 }} />,
      color: 'info.main',
      subtitle: 'Registered users',
      percentage: 12
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <Inventory sx={{ fontSize: 32 }} />,
      color: 'warning.main',
      subtitle: 'Active products',
      percentage: 5
    },
    {
      title: 'Pending Queries',
      value: stats.pendingQueries,
      icon: <QueryBuilder sx={{ fontSize: 32 }} />,
      color: 'error.main',
      subtitle: 'Need attention',
      percentage: -3
    },
    {
      title: 'Resolved Queries',
      value: stats.resolvedQueries,
      icon: <Star sx={{ fontSize: 32 }} />,
      color: 'secondary.main',
      subtitle: 'Completed',
      percentage: 25
    }
  ];

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
          Dashboard Overview
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Query Management Focus */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Query Management Priority
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%', 
                    bgcolor: 'error.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <QueryBuilder sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      Pending Queries Need Attention
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stats.pendingQueries} queries waiting for response
                    </Typography>
                  </Box>
                </Stack>
                <Chip label="High Priority" color="error" size="small" />
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%', 
                    bgcolor: 'success.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Star sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      Successfully Resolved
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stats.resolvedQueries} queries completed
                    </Typography>
                  </Box>
                </Stack>
                <Chip label="Completed" color="success" size="small" />
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%', 
                    bgcolor: 'info.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <People sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      Customer Satisfaction
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stats.totalCustomers} total customers
                    </Typography>
                  </Box>
                </Stack>
                <Chip label="Active" color="info" size="small" />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};
