import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectLoggedInUser } from '../features/auth/AuthSlice';

const TestPage = () => {
  const navigate = useNavigate();
  const loggedInUser = useSelector(selectLoggedInUser);

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Test Page - Routing Debug
      </Typography>
      
      <Typography variant="h6" gutterBottom>
        User Status: {loggedInUser ? 'Logged In' : 'Not Logged In'}
      </Typography>
      
      {loggedInUser && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1">
            User ID: {loggedInUser._id}
          </Typography>
          <Typography variant="body1">
            Name: {loggedInUser.name}
          </Typography>
          <Typography variant="body1">
            Email: {loggedInUser.email}
          </Typography>
          <Typography variant="body1">
            Is Verified: {loggedInUser.isVerified ? 'Yes' : 'No'}
          </Typography>
          <Typography variant="body1">
            Is Admin: {loggedInUser.isAdmin ? 'Yes' : 'No'}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button variant="contained" onClick={() => navigate('/')}>
          Go to Home
        </Button>
        <Button variant="contained" onClick={() => navigate('/user-dashboard')}>
          Go to Dashboard
        </Button>
        <Button variant="contained" onClick={() => navigate('/cart')}>
          Go to Cart
        </Button>
        <Button variant="contained" onClick={() => navigate('/wishlist')}>
          Go to Wishlist
        </Button>
        <Button variant="contained" onClick={() => navigate('/profile')}>
          Go to Profile
        </Button>
      </Box>
    </Box>
  );
};

export default TestPage; 