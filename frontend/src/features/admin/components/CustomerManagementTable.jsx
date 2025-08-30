import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Stack,
  Button,
  TextField,
  InputAdornment,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  LinearProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Visibility,
  Person,
  Star,
  Email,
  Phone,
  CalendarToday,
  ShoppingCart,
  AccountBalanceWallet,
  Search,
  FilterList,
  CheckCircle,
  Schedule
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const ITEMS_PER_PAGE = 10;

const getMemberStatus = (user) => {
  // Check if user has chit plans or investment history
  if (user.chitPlans && user.chitPlans.length > 0) {
    return 'member';
  }
  if (user.totalInvestment && user.totalInvestment > 0) {
    return 'member';
  }
  return 'customer';
};

const getMemberStatusColor = (status) => {
  switch (status) {
    case 'member':
      return 'success';
    case 'customer':
      return 'primary';
    default:
      return 'default';
  }
};

const getMemberStatusIcon = (status) => {
  switch (status) {
    case 'member':
      return <Star />;
    case 'customer':
      return <Person />;
    default:
      return <Person />;
  }
};

const getChitPlanProgress = (chitPlan) => {
  if (!chitPlan) return { paid: 0, total: 10, percentage: 0 };
  
  const paid = chitPlan.payments?.length || 0;
  const total = 10; // Fixed 10-month duration
  const percentage = (paid / total) * 100;
  
  return { paid, total, percentage };
};

export const CustomerManagementTable = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchCustomers();
  }, [page, searchTerm, activeTab]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: ITEMS_PER_PAGE,
        search: searchTerm || undefined
      };

      const response = await axios.get('/api/users', { params });
      
      if (response.data.success) {
        setCustomers(response.data.users || []);
        setTotalResults(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(1);
  };

  const filteredCustomers = customers.filter(customer => {
    const status = getMemberStatus(customer);
    if (activeTab === 0) return true; // All customers
    if (activeTab === 1) return status === 'customer'; // Only customers
    if (activeTab === 2) return status === 'member'; // Only members
    return true;
  });

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
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Customer Management
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip
              label={`${customers.filter(c => getMemberStatus(c) === 'customer').length} Customers`}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`${customers.filter(c => getMemberStatus(c) === 'member').length} Members`}
              color="success"
              variant="outlined"
            />
          </Stack>
        </Stack>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="All Customers" />
          <Tab label="Regular Customers" />
          <Tab label="Members" />
        </Tabs>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <TextField
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
        </Stack>
      </motion.div>

      {/* Customers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Orders</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total Spent</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Investment</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Chit Plans</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) => {
                const memberStatus = getMemberStatus(customer);
                const activeChitPlan = customer.chitPlans?.find(plan => plan.status === 'active');
                const chitProgress = getChitPlanProgress(activeChitPlan);
                
                return (
                  <TableRow
                    key={customer._id}
                    sx={{
                      '&:hover': { bgcolor: 'grey.50' },
                      cursor: 'pointer'
                    }}
                    onClick={() => handleViewCustomer(customer)}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ 
                          width: 40, 
                          height: 40, 
                          borderRadius: '50%', 
                          bgcolor: memberStatus === 'member' ? 'success.main' : 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {getMemberStatusIcon(memberStatus)}
                        </Box>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {customer.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {customer.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getMemberStatusIcon(memberStatus)}
                        label={memberStatus === 'member' ? 'Member' : 'Customer'}
                        color={getMemberStatusColor(memberStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ShoppingCart sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {customer.totalOrders || 0}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        ₹{customer.totalSpent?.toLocaleString() || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        ₹{customer.totalInvestment?.toLocaleString() || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {activeChitPlan ? (
                        <Stack spacing={1}>
                          <Typography variant="caption" fontWeight={500}>
                            {activeChitPlan.plan}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Schedule sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption">
                              {chitProgress.paid}/{chitProgress.total} months
                            </Typography>
                          </Stack>
                          <LinearProgress 
                            variant="determinate" 
                            value={chitProgress.percentage} 
                            size="small"
                            sx={{ height: 4 }}
                          />
                        </Stack>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          No active plan
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(customer.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewCustomer(customer);
                        }}
                        size="small"
                        color="primary"
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1} to {Math.min(page * ITEMS_PER_PAGE, totalResults)} of {totalResults} results
          </Typography>
          <Pagination
            page={page}
            onChange={(e, newPage) => setPage(newPage)}
            count={Math.ceil(totalResults / ITEMS_PER_PAGE)}
            variant="outlined"
            shape="rounded"
          />
        </Stack>
      </motion.div>

      {/* Customer Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedCustomer && (
          <>
            <DialogTitle>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Customer Details</Typography>
                <Chip
                  icon={getMemberStatusIcon(getMemberStatus(selectedCustomer))}
                  label={getMemberStatus(selectedCustomer) === 'member' ? 'Member' : 'Customer'}
                  color={getMemberStatusColor(getMemberStatus(selectedCustomer))}
                />
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    bgcolor: getMemberStatus(selectedCustomer) === 'member' ? 'success.main' : 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getMemberStatusIcon(getMemberStatus(selectedCustomer))}
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {selectedCustomer.name}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">{selectedCustomer.email}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">{selectedCustomer.phone}</Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Orders
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {selectedCustomer.totalOrders || 0}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Spent
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      ₹{selectedCustomer.totalSpent?.toLocaleString() || 0}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Investment
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      ₹{selectedCustomer.totalInvestment?.toLocaleString() || 0}
                    </Typography>
                  </Box>
                </Stack>

                {selectedCustomer.chitPlans && selectedCustomer.chitPlans.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                      Chit Plans
                    </Typography>
                    <Stack spacing={2}>
                      {selectedCustomer.chitPlans.map((plan, index) => {
                        const progress = getChitPlanProgress(plan);
                        return (
                          <Box key={index} sx={{ p: 2, border: '1px solid', borderColor: 'grey.200', borderRadius: 1 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                              <Typography variant="body2" fontWeight={600}>
                                {plan.plan} - ₹{plan.amount.toLocaleString()}/month
                              </Typography>
                              <Chip 
                                label={plan.status} 
                                color={plan.status === 'active' ? 'success' : 'default'}
                                size="small"
                              />
                            </Stack>
                            <Stack spacing={1}>
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="caption" color="text.secondary">
                                  Progress: {progress.paid}/{progress.total} months
                                </Typography>
                                <Typography variant="caption" fontWeight={600}>
                                  {Math.round(progress.percentage)}% complete
                                </Typography>
                              </Stack>
                              <LinearProgress 
                                variant="determinate" 
                                value={progress.percentage} 
                                sx={{ height: 6, borderRadius: 3 }}
                              />
                              {plan.payments && plan.payments.length > 0 && (
                                <Typography variant="caption" color="text.secondary">
                                  Last payment: {formatDate(plan.payments[plan.payments.length - 1].date)}
                                </Typography>
                              )}
                            </Stack>
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>
                )}

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Member since {formatDate(selectedCustomer.createdAt)}
                  </Typography>
                  {selectedCustomer.lastOrderDate && (
                    <Typography variant="subtitle2" color="text.secondary">
                      Last order: {formatDate(selectedCustomer.lastOrderDate)}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}; 