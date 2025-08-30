import { FormHelperText, Paper, Stack, Typography, useMediaQuery, useTheme, Box, Chip, Rating } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import Checkbox from '@mui/material/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { addToCartAsync,selectCartItems } from '../../cart/CartSlice';
import {motion} from 'framer-motion'
import { getImageUrl } from '../../../utils/imageUtils'
import { toast } from 'react-toastify'

export const ProductCard = ({id,title,price,thumbnail,brand,stockQuantity,handleAddRemoveFromWishlist,isWishlistCard,isAdminCard}) => {


    const navigate=useNavigate()
    const wishlistItems=useSelector(selectWishlistItems)
    const loggedInUser=useSelector(selectLoggedInUser)
    const cartItems=useSelector(selectCartItems)
    const dispatch=useDispatch()
    let isProductAlreadyinWishlist=-1


    const theme=useTheme()
    const is1410=useMediaQuery(theme.breakpoints.down(1410))
    const is932=useMediaQuery(theme.breakpoints.down(932))
    const is752=useMediaQuery(theme.breakpoints.down(752))
    const is500=useMediaQuery(theme.breakpoints.down(500))
    const is608=useMediaQuery(theme.breakpoints.down(608))
    const is488=useMediaQuery(theme.breakpoints.down(488))

    isProductAlreadyinWishlist=wishlistItems?.some((item)=>item?.product?._id===id) || false

    const isProductAlreadyInCart=cartItems?.some((item)=>item?.product?._id===id) || false

    const handleAddToCart=async(e)=>{
        e.stopPropagation()
        if(!loggedInUser?._id) {
            toast.error("Please login to add items to cart");
            return;
        }
        const data={user:loggedInUser._id,product:id}
        dispatch(addToCartAsync(data))
    }


  return (
    <>

    {

    isProductAlreadyinWishlist!==-1 ?
    <Paper 
      elevation={2} 
      sx={{
        p: 0,
        width: '100%',
        maxWidth: '320px',
        height: '100%',
        minHeight: '450px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        border: '1px solid #f0f0f0',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          borderColor: '#d4af37'
        }
      }} 
      onClick={() => navigate(`/product-details/${id}`)}
    >

        {/* Image Container */}
        <Box sx={{ position: 'relative', height: '280px', backgroundColor: '#fafafa' }}>
          <img 
            src={getImageUrl(thumbnail)} 
            alt={`${title} photo unavailable`} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain',
              padding: '1rem'
            }} 
          />
          
          {/* Wishlist Icon */}
          <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
            <Checkbox
              checked={isProductAlreadyinWishlist}
              onChange={(e) => {
                e.stopPropagation();
                if(!loggedInUser?._id) {
                  toast.error("Please login to manage wishlist");
                  return;
                }
                handleAddRemoveFromWishlist(e);
              }}
              icon={<FavoriteBorder sx={{ color: '#666', fontSize: 20 }} />}
              checkedIcon={<Favorite sx={{ color: '#d4af37', fontSize: 20 }} />}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: '50%',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,1)'
                }
              }}
            />
          </Box>

          {/* Stock Status */}
          {stockQuantity <= 0 && (
            <Chip 
              label="Out of Stock" 
              color="error" 
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                fontWeight: 600
              }}
            />
          )}
        </Box>

        {/* Product Details */}
        <Stack spacing={2} sx={{ p: 2, flexGrow: 1 }}>
          {/* Brand */}
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              fontWeight: 600,
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {brand}
          </Typography>

          {/* Title */}
          <Typography 
            variant="h6" 
            fontWeight={600}
            sx={{ 
              color: '#1a1a1a',
              lineHeight: 1.3,
              fontSize: '1rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {title}
          </Typography>

          {/* Rating */}
          <Stack flexDirection={'row'} alignItems={'center'} spacing={1}>
            <Rating 
              value={4.5} 
              readOnly 
              size="small"
              sx={{ color: '#d4af37' }}
            />
            <Typography variant="caption" color="text.secondary">
              (24 reviews)
            </Typography>
          </Stack>

          {/* Price */}
          <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
            <Typography 
              variant="h6" 
              fontWeight={700}
              sx={{ 
                color: '#1a1a1a',
                fontSize: '1.2rem'
              }}
            >
              ₹{price?.toLocaleString('en-IN')}
            </Typography>
            
            {/* Add to Cart Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(e);
                }}
                sx={{
                  backgroundColor: '#1a1a1a',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#000000'
                  }
                }}
              >
                {isProductAlreadyInCart ? 'In Cart' : 'Add to Cart'}
              </Box>
            </motion.div>
          </Stack>
        </Stack>
    </Paper>
    :''
    
    
    }
    
    </>
  )
}
