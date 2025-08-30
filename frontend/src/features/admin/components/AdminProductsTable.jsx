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
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  Search,
  Add,
  RestoreFromTrash
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsAsync, deleteProductByIdAsync, undeleteProductByIdAsync, selectProducts, selectProductTotalResults } from '../../products/ProductSlice';
import { motion } from 'framer-motion';

const ITEMS_PER_PAGE = 10;

export const AdminProductsTable = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const totalResults = useSelector(selectProductTotalResults);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const finalFilters = {
      ...filters,
      search: searchTerm,
      pagination: { page, limit: ITEMS_PER_PAGE }
    };
    dispatch(fetchProductsAsync(finalFilters));
  }, [filters, searchTerm, page, dispatch]);

  const handleProductDelete = (productId) => {
    dispatch(deleteProductByIdAsync(productId));
  };

  const handleProductUnDelete = (productId) => {
    dispatch(undeleteProductByIdAsync(productId));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const getStatusColor = (isDeleted) => {
    return isDeleted ? 'error' : 'success';
  };

  const getStatusText = (isDeleted) => {
    return isDeleted ? 'Deleted' : 'Active';
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
            Products Management
          </Typography>
          <Button
            component={Link}
            to="/admin/add-product"
            variant="contained"
            startIcon={<Add />}
            sx={{ borderRadius: 2 }}
          >
            Add Product
          </Button>
        </Stack>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <TextField
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
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

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Brand</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product._id}
                  sx={{
                    '&:hover': { bgcolor: 'grey.50' },
                    opacity: product.isDeleted ? 0.6 : 1
                  }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        component="img"
                        src={product.thumbnail}
                        alt={product.title}
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: 1,
                          objectFit: 'cover'
                        }}
                      />
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {product.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {product._id.slice(-8)}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.brand?.name || 'Unknown'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.category?.name || 'Unknown'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      ₹{product.price?.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {product.stock || 0}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(product.isDeleted)}
                      color={getStatusColor(product.isDeleted)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        component={Link}
                        to={`/product-details/${product._id}`}
                        size="small"
                        color="primary"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        component={Link}
                        to={`/admin/product-update/${product._id}`}
                        size="small"
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      {product.isDeleted ? (
                        <IconButton
                          onClick={() => handleProductUnDelete(product._id)}
                          size="small"
                          color="success"
                        >
                          <RestoreFromTrash />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() => handleProductDelete(product._id)}
                          size="small"
                          color="error"
                        >
                          <Delete />
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
            count={Math.ceil(totalResults / ITEMS_PER_PAGE)}
            variant="outlined"
            shape="rounded"
          />
        </Stack>
      </motion.div>
    </Box>
  );
}; 