import React, { useEffect } from 'react'
import { CartItem } from './CartItem'
import { Button, Chip, Paper, Stack, Typography, useMediaQuery, useTheme, Divider } from '@mui/material'
import { resetCartItemRemoveStatus, selectCartItemRemoveStatus, selectCartItems, resetCartByUserIdAsync } from '../CartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { SHIPPING, TAXES } from '../../../constants'
import { toast } from 'react-toastify'
import {motion} from 'framer-motion'
import { selectLoggedInUser } from '../../auth/AuthSlice'

export const Cart = ({checkout}) => {
    const items=useSelector(selectCartItems)
    const loggedInUser=useSelector(selectLoggedInUser)
    const subtotal=items.reduce((acc,item)=>item.product.price*item.quantity+acc,0)
    const totalItems=items.reduce((acc,item)=>acc+item.quantity,0)
    const shipping = 0 // Free shipping
    const taxes = Math.round(subtotal * 0.18) // 18% GST
    const total = subtotal + shipping + taxes
    const navigate=useNavigate()
    const theme=useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))

    const cartItemRemoveStatus=useSelector(selectCartItemRemoveStatus)
    const dispatch=useDispatch()

    const handleEmptyCart = async () => {
        if (!loggedInUser?._id) {
            toast.error("Please login to manage your cart");
            return;
        }
        
        try {
            await dispatch(resetCartByUserIdAsync(loggedInUser._id)).unwrap();
            toast.success("Cart emptied successfully");
        } catch (error) {
            toast.error("Failed to empty cart. Please try again.");
        }
    }

    useEffect(()=>{
        window.scrollTo({
            top:0,
            behavior:"instant"
        })
    },[])

    // Removed auto-navigation when cart is empty to show chit plan option
    // useEffect(()=>{
    //     if(items.length===0){
    //         navigate("/")
    //     }
    // },[items])

    useEffect(()=>{
        if(cartItemRemoveStatus==='fulfilled'){
            toast.success("Product removed from cart")
        }
        else if(cartItemRemoveStatus==='rejected'){
            toast.error("Error removing product from cart, please try again later")
        }
    },[cartItemRemoveStatus])

    useEffect(()=>{
        return ()=>{
            dispatch(resetCartItemRemoveStatus())
        }
    },[])

  // Show empty cart with chit plan option if cart is empty
  if (items.length === 0) {
    return (
      <Stack 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        spacing={4}
        px={2}
      >
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', maxWidth: 600, width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Start shopping or check out our Chit Plan options to begin your jewelry savings journey!
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" mt={4}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              component={Link}
              to="/shop"
              fullWidth={isMobile}
            >
              Continue Shopping
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              component={Link}
              to="/chit-plans"
              fullWidth={isMobile}
              sx={{
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                }
              }}
            >
              Explore Chit Plans
            </Button>
          </Stack>
        </Paper>
      </Stack>
    );
  }

  return (
    <Stack justifyContent={'flex-start'} alignItems={'center'} mb={{xs: '3rem', md: '5rem'}} >
        <Stack 
          width={{xs: '100%', sm: '80%', md: '50rem'}} 
          mt={{xs: '1.5rem', md: '3rem'}} 
          px={{xs: 2, md: checkout ? 0 : 2}}
          rowGap={{xs: 3, md: 4}} 
        >

            {/* cart summary */}
            {items.length > 1 && (
                <Paper sx={{ p: 3, backgroundColor: '#f8f8f8', borderRadius: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack>
                            <Typography variant="h6" fontWeight={600} color="primary.main">
                                Cart Summary
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {totalItems} items in your cart
                            </Typography>
                        </Stack>
                        <Stack alignItems="flex-end">
                            <Typography variant="h5" fontWeight={700} color="primary.main">
                                ₹{subtotal.toLocaleString('en-IN')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Subtotal
                            </Typography>
                        </Stack>
                    </Stack>
                </Paper>
            )}

            {/* cart items */}
            <Stack rowGap={{xs: 1.5, md: 2}}>
            {
                items && items.map((item)=>(
                    <CartItem 
                        key={item._id} 
                        id={item._id} 
                        title={item.product.title} 
                        brand={item.product.brand?.name || 'Unknown Brand'} 
                        category={item.product.category?.name || 'Unknown Category'} 
                        price={item.product.price} 
                        quantity={item.quantity} 
                        thumbnail={item.product.thumbnail} 
                        stockQuantity={item.product.stockQuantity} 
                        productId={item.product._id}
                    />
                ))
            }
            </Stack>
            
            {/* subtotal */}
            <Stack 
              flexDirection={{xs: 'column', sm: 'row'}} 
              justifyContent={'space-between'} 
              alignItems={{xs: 'flex-start', sm: 'center'}}
              gap={{xs: 1, sm: 0}}
            >

                {
                    checkout?(
                        <Stack rowGap={2} width={'100%'}>

                            <Stack flexDirection={'row'} justifyContent={'space-between'}>
                                <Typography variant={isMobile ? 'body1' : 'body1'} fontWeight={500}>Subtotal ({totalItems} items)</Typography>
                                <Typography variant={isMobile ? 'body1' : 'body1'} fontWeight={500}>₹{subtotal.toLocaleString('en-IN')}</Typography>
                            </Stack>

                            <Stack flexDirection={'row'} justifyContent={'space-between'}>
                                <Typography variant={isMobile ? 'body1' : 'body1'}>Shipping</Typography>
                                <Typography variant={isMobile ? 'body1' : 'body1'} color="success.main" fontWeight={600}>FREE</Typography>
                            </Stack>

                            <Stack flexDirection={'row'} justifyContent={'space-between'}>
                                <Typography variant={isMobile ? 'body1' : 'body1'}>GST (18%)</Typography>
                                <Typography variant={isMobile ? 'body1' : 'body1'}>₹{taxes.toLocaleString('en-IN')}</Typography> 
                            </Stack>

                            <Divider sx={{my: 1}} />

                            <Stack flexDirection={'row'} justifyContent={'space-between'}>
                                <Typography variant={isMobile ? 'h6' : 'h6'} fontWeight={600}>Total Amount</Typography>
                                <Typography variant={isMobile ? 'h6' : 'h6'} fontWeight={600} color="primary.main">₹{total.toLocaleString('en-IN')}</Typography>
                            </Stack>
                            

                        </Stack>
                    ):(
                        <>
                            <Stack>
                                <Typography variant={isMobile ? 'h6' : 'h6'} fontWeight={500}>Subtotal ({totalItems} items)</Typography>
                                <Typography variant={isMobile ? 'body2' : 'body1'}>Total items in cart: {totalItems}</Typography>
                                <Typography variant={isMobile ? 'caption' : 'body2'} color={'text.secondary'} mt={{xs: 0.5, sm: 0}}>
                                  Shipping and taxes calculated at checkout
                                </Typography>
                            </Stack>

                            <Stack>
                                <Typography variant={isMobile ? 'h6' : 'h6'} fontWeight={500} color="primary.main">₹{subtotal.toLocaleString('en-IN')}</Typography>
                            </Stack>
                        </>
                    )
                }

            </Stack>
            
            {/* checkout or continue shopping */}
            {
            !checkout && 
            <Stack rowGap={{xs: '0.75rem', md: '1rem'}} mt={{xs: 1, md: 0}}>
                <Stack direction="row" spacing={2}>
                    <Button 
                      variant='contained' 
                      component={Link} 
                      to='/checkout'
                      size={isMobile ? 'medium' : 'large'}
                      fullWidth={isMobile}
                      sx={{
                        backgroundColor: '#d32f2f',
                        color: 'white',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: '#b71c1c'
                        }
                      }}
                    >
                      Proceed to Checkout - ₹{total.toLocaleString('en-IN')}
                    </Button>
                </Stack>
                
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1}>
                        <motion.div whileHover={{y:2}}>
                          <Chip 
                            sx={{
                              cursor:"pointer",
                              borderRadius:"8px",
                              fontSize: isMobile ? '0.8rem' : '0.9rem'
                            }} 
                            component={Link} 
                            to={'/'} 
                            label="Continue shopping" 
                            variant='outlined'
                          />
                        </motion.div>
                        
                        <motion.div whileHover={{y:2}}>
                          <Chip 
                            sx={{
                              cursor:"pointer",
                              borderRadius:"8px",
                              fontSize: isMobile ? '0.8rem' : '0.9rem',
                              color: 'error.main',
                              borderColor: 'error.main',
                              '&:hover': {
                                backgroundColor: 'error.main',
                                color: 'white'
                              }
                            }} 
                            onClick={handleEmptyCart}
                            label="Empty Cart" 
                            variant='outlined'
                          />
                        </motion.div>
                    </Stack>
                    
                    <Typography variant="body2" color="text.secondary">
                        Secure checkout with SSL encryption
                    </Typography>
                </Stack>
            </Stack>
            }
    
        </Stack>

    </Stack>
  )
}
