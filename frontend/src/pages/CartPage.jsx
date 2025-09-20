import React from 'react'
import { Cart } from '../features/cart/components/Cart'
import { Box, Button, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const CartPage = () => {
  const navigate = useNavigate();
  return (
    <>
    <Container maxWidth="xl" sx={{ pt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Button variant="outlined" onClick={() => navigate('/shop')} sx={{ borderColor: '#d4af37', color: '#d4af37', fontWeight: 600, textTransform: 'none', '&:hover': { borderColor: '#b8860b', color: '#b8860b' } }}>Back to Shop</Button>
      </Box>
    </Container>
    <Cart/>
    </>
  )
}
