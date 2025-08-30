import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  LinearProgress,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  ShoppingCart as OrdersIcon,
  Inventory as ProductsIcon,
  People as CustomersIcon,
  AttachMoney as RevenueIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthChecked, selectLoggedInUser } from '../../auth/AuthSlice';

const StatCard = ({ title, value, icon, color = 'primary' }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight={600}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}.main`,
            borderRadius: 2,
            p: 1.5,
            color: 'white'
          }}
        >
          {icon}
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const CategoryProgress = ({ name, sales, percentage }) => (
  <Stack spacing={1} mb={2}>
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="body2" fontWeight={500}>
        {name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {sales} units ({percentage}%)
      </Typography>
    </Stack>
    <LinearProgress
      variant="determinate"
      value={percentage}
      sx={{ height: 8, borderRadius: 4 }}
    />
  </Stack>
);

export const AdminAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const loggedInUser = useSelector(selectLoggedInUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics');
        if (!response.ok) throw new Error('Failed to fetch analytics');
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (loggedInUser?.isAdmin) {
      fetchAnalytics();
    }
  }, [loggedInUser]);

  if (!loggedInUser?.isAdmin) {
    return <Typography variant="h6">Access denied - Admin only</Typography>;
  }

  if (isLoading || !isAuthChecked) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Dashboard Analytics
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Revenue"
              value={analyticsData?.totalRevenue ? `₹${analyticsData.totalRevenue.toLocaleString()}` : 'Loading...'}
              icon={<RevenueIcon sx={{ fontSize: 24 }} />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Orders"
              value={analyticsData?.totalOrders || 'Loading...'}
              icon={<OrdersIcon sx={{ fontSize: 24 }} />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Products"
              value={analyticsData?.totalProducts || 'Loading...'}
              icon={<ProductsIcon sx={{ fontSize: 24 }} />}
              color="info"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Customers"
              value={analyticsData?.totalCustomers || 'Loading...'}
              icon={<CustomersIcon sx={{ fontSize: 24 }} />}
              color="warning"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Top Selling Categories
          </Typography>
          <Box sx={{ mt: 2 }}>
            {analyticsData?.topSellingCategories?.map((category) => (
              <CategoryProgress
                key={category._id}
                name={category._id}
                sales={category.sales}
                percentage={Math.round((category.sales / analyticsData.totalOrders) * 100)}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Recent Metrics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Chip
                label={`Conversion Rate: ${analyticsData?.recentMetrics?.conversionRate != null ? analyticsData.recentMetrics.conversionRate.toFixed(1) + '%' : 'N/A'}`}
                color="primary"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Chip
                label={`Avg Order Value: ₹${analyticsData?.recentMetrics?.averageOrderValue != null ? analyticsData.recentMetrics.averageOrderValue.toLocaleString() : 'N/A'}`}
                color="success"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Chip
                label={`Customer Retention: ${analyticsData?.recentMetrics?.customerRetention != null ? analyticsData.recentMetrics.customerRetention.toFixed(1) + '%' : 'N/A'}`}
                color="info"
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
            <Typography variant="body1">Customer Retention</Typography>
            <Chip
              label={`${analyticsData?.recentMetrics?.customerRetention != null ? analyticsData.recentMetrics.customerRetention + '%' : 'N/A'}`}
              color="info"
              variant="outlined"
            />
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
            <Typography variant="body1">Inventory Turnover</Typography>
            <Chip
              label={`${analyticsData?.recentMetrics?.inventoryTurnover != null ? analyticsData.recentMetrics.inventoryTurnover + 'x' : 'N/A'}`}
              color="warning"
              variant="outlined"
            />
          </Stack>
        </Box>

        {/* Additional Info */}
        <Box sx={{ p: 3, mt: 3 }}>
          <Paper>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Analytics Summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your jewelry business is performing well with consistent growth across all key metrics. 
              Rings continue to be your best-selling category, representing 35% of total sales. 
              Consider expanding your ring collection or introducing new designs to capitalize on this trend.
              Customer retention at 68% is above industry average, indicating strong customer satisfaction.
            </Typography>
          </Paper>
        </Box>
      </Paper>
    </Box>
  );
}
