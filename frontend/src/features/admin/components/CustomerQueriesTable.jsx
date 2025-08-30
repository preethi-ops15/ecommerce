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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Visibility,
  CheckCircle,
  Pending,
  Search,
  Email,
  Phone,
  Person,
  Reply,
  PriorityHigh,
  Schedule
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const ITEMS_PER_PAGE = 10;

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'in-progress':
      return 'info';
    case 'resolved':
      return 'success';
    case 'closed':
      return 'default';
    default:
      return 'warning';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'resolved':
      return <CheckCircle />;
    case 'pending':
    case 'in-progress':
      return <Pending />;
    default:
      return <Pending />;
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'urgent':
      return 'error';
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    case 'low':
      return 'default';
    default:
      return 'info';
  }
};

export const CustomerQueriesTable = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchQueries();
  }, [page, searchTerm, statusFilter, categoryFilter]);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: ITEMS_PER_PAGE,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        category: categoryFilter || undefined
      };

      const response = await axios.get('/api/queries', { params });
      
      if (response.data.success) {
        setQueries(response.data.data.queries || []);
        setTotalResults(response.data.data.total || 0);
        setTotalPages(response.data.data.totalPages || 0);
      }
    } catch (error) {
      console.error('Error fetching queries:', error);
      setQueries([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (queryId, newStatus) => {
    try {
      await axios.put(`/api/queries/${queryId}/status`, { status: newStatus });
      fetchQueries(); // Refresh the list
    } catch (error) {
      console.error('Error updating query status:', error);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim() || !selectedQuery) return;

    try {
      await axios.put(`/api/queries/${selectedQuery._id}/reply`, {
        message: replyMessage
      });
      
      setReplyMessage('');
      setReplyDialogOpen(false);
      fetchQueries(); // Refresh the list
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const handleViewQuery = (query) => {
    setSelectedQuery(query);
    setDialogOpen(true);
  };

  const handleReplyClick = (query) => {
    setSelectedQuery(query);
    setReplyDialogOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Customer Queries
          </Typography>
          <Chip
            label={`${queries.filter(q => q.status === 'pending').length} Pending`}
            color="warning"
            variant="outlined"
          />
        </Stack>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            placeholder="Search queries..."
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
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              label="Category"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="investment">Investment</MenuItem>
              <MenuItem value="product">Product</MenuItem>
              <MenuItem value="order">Order</MenuItem>
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="technical">Technical</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </motion.div>

      {/* Queries Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {queries.map((query) => (
                <TableRow
                  key={query._id}
                  sx={{
                    '&:hover': { bgcolor: 'grey.50' },
                    cursor: 'pointer'
                  }}
                  onClick={() => handleViewQuery(query)}
                >
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Person sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {query.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {query.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {query.subject}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {query.message.substring(0, 50)}...
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={query.category}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={query.priority}
                      color={getPriorityColor(query.priority)}
                      size="small"
                      icon={query.priority === 'urgent' ? <PriorityHigh /> : undefined}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(query.status)}
                      label={query.status}
                      color={getStatusColor(query.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(query.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewQuery(query);
                        }}
                        size="small"
                        color="primary"
                      >
                        <Visibility />
                      </IconButton>
                      {query.status !== 'resolved' && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReplyClick(query);
                          }}
                          size="small"
                          color="success"
                        >
                          <Reply />
                        </IconButton>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1} to {Math.min(page * ITEMS_PER_PAGE, totalResults)} of {totalResults} results
          </Typography>
          <Pagination
            page={page}
            onChange={(e, newPage) => setPage(newPage)}
            count={totalPages}
            variant="outlined"
            shape="rounded"
          />
        </Stack>
      </motion.div>

      {/* Query Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedQuery && (
          <>
            <DialogTitle>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Query Details</Typography>
                <Stack direction="row" spacing={1}>
                  <Chip
                    icon={getStatusIcon(selectedQuery.status)}
                    label={selectedQuery.status}
                    color={getStatusColor(selectedQuery.status)}
                  />
                  <Chip
                    label={selectedQuery.priority}
                    color={getPriorityColor(selectedQuery.priority)}
                    size="small"
                  />
                </Stack>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Person sx={{ color: 'white', fontSize: 30 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {selectedQuery.name}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">{selectedQuery.email}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">{selectedQuery.phone}</Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>

                <Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                    {selectedQuery.subject}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedQuery.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Received on {formatDate(selectedQuery.createdAt)}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={2}>
                  <Chip label={`Category: ${selectedQuery.category}`} variant="outlined" />
                  <Chip label={`Priority: ${selectedQuery.priority}`} color={getPriorityColor(selectedQuery.priority)} />
                </Stack>

                {selectedQuery.adminReply && selectedQuery.adminReply.message && (
                  <Box sx={{ p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                      Admin Reply
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {selectedQuery.adminReply.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Replied by {selectedQuery.adminReply.repliedBy?.name || 'Admin'} on {formatDate(selectedQuery.adminReply.repliedAt)}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              {selectedQuery.status !== 'resolved' && (
                <Button 
                  onClick={() => {
                    setDialogOpen(false);
                    handleReplyClick(selectedQuery);
                  }}
                  variant="contained"
                  color="success"
                  startIcon={<Reply />}
                >
                  Reply
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Reply Dialog */}
      <Dialog
        open={replyDialogOpen}
        onClose={() => setReplyDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Send Reply</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Replying to: {selectedQuery?.name} ({selectedQuery?.email})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Subject: {selectedQuery?.subject}
            </Typography>
            <TextField
              fullWidth
              label="Your Reply"
              multiline
              rows={4}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply here..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleReply}
            variant="contained"
            disabled={!replyMessage.trim()}
          >
            Send Reply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 