import React from 'react'
import { Wishlist } from '../features/wishlist/components/Wishlist'
import { Box, Button, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const WishlistPage = () => {
  const navigate = useNavigate();
  return (
    <>
    <Container maxWidth="xl" sx={{ pt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Button variant="outlined" onClick={() => navigate('/shop')} sx={{ borderColor: '#d4af37', color: '#d4af37', fontWeight: 600, textTransform: 'none', '&:hover': { borderColor: '#b8860b', color: '#b8860b' } }}>Back to Shop</Button>
      </Box>
    </Container>
    <Wishlist/>
    </>
  )
}
