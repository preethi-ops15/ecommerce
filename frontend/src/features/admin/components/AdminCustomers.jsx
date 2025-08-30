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
  Alert
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

  useEffect(() => {
    dispatch(fetchAllUsersAsync());
  }, [dispatch]);

  const filteredCustomers = (users || []).filter(customer =>
    (customer.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">
            All Customers ({filteredCustomers.length})
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
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Join Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Last Login</TableCell>
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
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleViewCustomer(customer._id)}
                      sx={{ color: 'primary.main' }}
                    >
                      <ViewIcon />
                    </IconButton>
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
