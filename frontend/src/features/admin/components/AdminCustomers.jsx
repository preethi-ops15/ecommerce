import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import {
  Search as SearchIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { fetchAllUsersAsync, selectUsers, selectUsersStatus } from '../../user/UserSlice';
import { toast } from 'react-toastify';

export const AdminCustomers = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const usersStatus = useSelector(selectUsersStatus);
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState('users');

  useEffect(() => {
    dispatch(fetchAllUsersAsync());
  }, [dispatch]);

  const baseFiltered = (users || []).filter(customer =>
    (customer.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredCustomers = baseFiltered.filter(c => {
    const isMember = !!(c.chitPlan && c.chitPlan.status === 'active');
    return tab === 'members' ? isMember : !isMember;
  });

  const getStatusColor = (isVerified, isAdmin) => {
    if (isAdmin) return 'error';
    if (isVerified) return 'success';
    return 'warning';
  };

  const getStatusLabel = (isVerified, isAdmin) => {
    if (isAdmin) return 'Admin';
    if (isVerified) return 'Verified';
    return 'Pending';
  };

  // Helpers for Members tab
  const planMeta = {
    1: { name: 'Basic Plan', amount: 1000 },
    2: { name: 'Standard Plan', amount: 2500 },
    3: { name: 'Premium Plan', amount: 5000 }
  };

  const computeMemberStats = (customer) => {
    const cp = customer?.chitPlan;
    if (!cp || cp.status !== 'active' || !cp.startDate) {
      return { monthsCompleted: 0, pendingMonths: 10, amountPaid: 0, planName: 'N/A', startDate: null };
    }
    const base = planMeta[cp.planId] || { name: cp.planName || 'Plan', amount: 0 };
    const start = new Date(cp.startDate);
    const now = new Date();
    const months = Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000*60*60*24*30)));
    const capped = Math.min(10, months);
    const pending = Math.max(0, 10 - capped);
    const paid = capped * (base.amount || 0);
    return { monthsCompleted: capped, pendingMonths: pending, amountPaid: paid, planName: base.name, startDate: start };
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewCustomer = (customerId) => {
    // Navigate to customer details page or open modal
    toast.info(`Viewing customer: ${customerId}`);
  };

  if (usersStatus === 'pending') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (usersStatus === 'rejected') {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load customers. Please try again.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Customer Management
      </Typography>

      <Paper sx={{ p: 3 }}>
        {/* Users / Members Tabs */}
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          sx={{ mb: 2 }}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab value="users" label="Users" />
          <Tab value="members" label="Members" />
        </Tabs>

        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">
            {tab === 'members' ? 'Members' : 'Users'} ({filteredCustomers.length})
          </Typography>
          <TextField
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
        </Stack>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                {tab === 'members' ? (
                  <>
                    <TableCell sx={{ fontWeight: 600 }}>Chit Plan</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Amount Paid</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Pending Months</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Join Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Last Login</TableCell>
                  </>
                )}
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer._id} hover>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar 
                        sx={{ 
                          bgcolor: customer.isAdmin ? 'error.main' : 'primary.main',
                          width: 40,
                          height: 40
                        }}
                      >
                        {getInitials(customer.name)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {customer.name || 'Unknown User'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {customer._id?.slice(-8) || 'N/A'}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {customer.email}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {customer.phone || 'N/A'}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  {tab === 'members' ? (
                    <>
                      {(() => {
                        const stats = computeMemberStats(customer);
                        return (
                          <>
                            <TableCell>
                              <Typography variant="body2">{stats.planName}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{stats.startDate ? formatDate(stats.startDate) : 'N/A'}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">₹{Number(stats.amountPaid).toLocaleString('en-IN')}</Typography>
                            </TableCell>
                            <TableCell>
                              <Chip label={`${stats.pendingMonths} months`} size="small" />
                            </TableCell>
                          </>
                        );
                      })()}
                    </>
                  ) : (
                    <>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(customer.isVerified, customer.isAdmin)}
                          color={getStatusColor(customer.isVerified, customer.isAdmin)}
                          size="small"
                          variant={customer.isAdmin ? "filled" : "outlined"}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(customer.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(customer.lastLoginAt) || 'Never'}
                        </Typography>
                      </TableCell>
                    </>
                  )}
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewCustomer(customer._id)}
                        sx={{ color: 'primary.main' }}
                      >
                        <ViewIcon />
                      </IconButton>
                      {tab === 'members' && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            // Open shop in redeem mode – member should open from their account to apply redemption
                            window.open('/shop?redeem=true', '_blank');
                          }}
                        >
                          Redeem
                        </Button>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredCustomers.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary">
              No customers found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search terms' : 'No customers registered yet'}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
