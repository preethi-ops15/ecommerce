import { Stack, TextField, Typography ,Button, Menu, MenuItem, Select, Grid, FormControl, Radio, Paper, IconButton, Box, useTheme, useMediaQuery, Alert} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import React, { useEffect, useState } from 'react'
import { Cart } from '../../cart/components/Cart'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addAddressAsync, selectAddressStatus, selectAddresses } from '../../address/AddressSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { useNavigate } from 'react-router-dom'
import { createOrderAsync, selectCurrentOrder, selectOrderStatus } from '../../order/OrderSlice'
import { resetCartByUserIdAsync, selectCartItems } from '../../cart/CartSlice'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SHIPPING, TAXES } from '../../../constants'
import {motion} from 'framer-motion'
import { axiosi } from '../../../config/axios'
import { toast } from 'react-toastify'


export const Checkout = () => {

    const status=''
    const addresses=useSelector(selectAddresses)
    const [selectedAddress,setSelectedAddress]=useState(addresses[0])
    const [selectedPaymentMethod,setSelectedPaymentMethod]=useState('razorpay')
    const { register, handleSubmit, watch, reset,formState: { errors }} = useForm()
    const dispatch=useDispatch()
    const loggedInUser=useSelector(selectLoggedInUser)
    const addressStatus=useSelector(selectAddressStatus)
    const navigate=useNavigate()
    const cartItems=useSelector(selectCartItems)
    const orderStatus=useSelector(selectOrderStatus)
    const currentOrder=useSelector(selectCurrentOrder)
    const orderTotal=cartItems.reduce((acc,item)=>(item.product.price*item.quantity)+acc,0)
    const theme=useTheme()
    const is900=useMediaQuery(theme.breakpoints.down(900))
    const is480=useMediaQuery(theme.breakpoints.down(480))
    const [paymentLoading, setPaymentLoading] = useState(false)
    const [paymentError, setPaymentError] = useState('')
    
    useEffect(()=>{
        if(addressStatus==='fulfilled'){
            reset()
        }
        else if(addressStatus==='rejected'){
            alert('Error adding your address')
        }
    },[addressStatus])

    useEffect(()=>{
        if(currentOrder && currentOrder?._id){
            dispatch(resetCartByUserIdAsync(loggedInUser?._id))
            navigate(`/order-success/${currentOrder?._id}`)
        }
    },[currentOrder, dispatch, navigate, loggedInUser?._id])
    
    const handleAddAddress=(data)=>{
        const address={...data,user:loggedInUser._id}
        dispatch(addAddressAsync(address))
    }

    const handleCreateOrder=async ()=>{
        if (selectedPaymentMethod === 'razorpay') {
            await handleRazorpayPayment()
        } else {
            // Handle COD order
        const order={user:loggedInUser._id,item:cartItems,address:selectedAddress,paymentMode:selectedPaymentMethod,total:orderTotal+SHIPPING+TAXES}
        dispatch(createOrderAsync(order))
    }
    }

    const handleRazorpayPayment = async () => {
        if (!selectedAddress) {
            setPaymentError('Please select a delivery address');
            return;
        }

        setPaymentLoading(true);
        setPaymentError('');

        try {
            // Create payment order on backend
            const response = await axiosi.post('/orders/create-payment-order', {
                userId: loggedInUser._id,
                items: cartItems,
                address: selectedAddress,
                total: orderTotal + SHIPPING + TAXES,
                paymentMode: 'razorpay'
            });

            if (response.data.success) {
                // Initialize Razorpay
                const options = {
                    key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_HERE',
                    amount: response.data.order.amount * 100, // Convert to paise
                    currency: 'INR',
                    name: 'Jewells - Silver Jewelry',
                    description: `Order for ${cartItems.length} items`,
                    order_id: response.data.order.razorpayOrderId,
                    handler: function (paymentResponse) {
                        handlePaymentSuccess(paymentResponse, response.data.order._id);
                    },
                    prefill: {
                        name: loggedInUser.name || loggedInUser.email,
                        email: loggedInUser.email,
                        contact: selectedAddress.phoneNumber || ''
                    },
                    theme: {
                        color: '#1976d2'
                    },
                    modal: {
                        ondismiss: function() {
                            setPaymentLoading(false);
                        }
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                throw new Error(response.data.message || 'Failed to create payment order');
            }
        } catch (err) {
            console.error('Payment error:', err);
            setPaymentError(err.message || 'Payment initialization failed. Please try again.');
        } finally {
            setPaymentLoading(false);
        }
    };

    const handlePaymentSuccess = async (paymentResponse, orderId) => {
        try {
            // Verify payment with backend
            const verifyResponse = await axiosi.post('/orders/verify-payment', {
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                orderId: orderId,
                userId: loggedInUser._id
            });

            if (verifyResponse.data.success) {
                // Payment verified, order will be automatically updated
                toast.success('Payment successful! Your order has been placed.');
                navigate(`/order-success/${orderId}`);
            } else {
                throw new Error(verifyResponse.data.message || 'Payment verification failed');
            }
        } catch (err) {
            console.error('Payment verification error:', err);
            setPaymentError('Payment verification failed. Please contact support.');
        }
    };

  return (
    <Stack flexDirection={'row'} p={2} rowGap={10} justifyContent={'center'} flexWrap={'wrap'} mb={'5rem'} mt={2} columnGap={4} alignItems={'flex-start'}>

        {/* left box */}
        <Stack rowGap={4}>

            {/* heading */}
            <Stack flexDirection={'row'} columnGap={is480?0.3:1} alignItems={'center'}>
                <IconButton onClick={()=>navigate(-1)}>
                    <ArrowBackIcon/>
                </IconButton>
                <Typography variant='h5' fontWeight={600}>Checkout</Typography>
            </Stack>

            {/* address form */}
            <Stack rowGap={3}>
                    <Stack>
                    <Typography variant='h6'>Add New Address</Typography>
                    <Typography variant='body2' color={'text.secondary'}>Add a new delivery address</Typography>
                    </Stack>

                <form onSubmit={handleSubmit(handleAddAddress)}>
                    <Stack rowGap={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    fullWidth 
                                    label='Street' 
                                    {...register('street',{required:'Street is required'})}
                                    error={!!errors.street}
                                    helperText={errors.street?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    fullWidth 
                                    label='City' 
                                    {...register('city',{required:'City is required'})}
                                    error={!!errors.city}
                                    helperText={errors.city?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    fullWidth 
                                    label='State' 
                                    {...register('state',{required:'State is required'})}
                                    error={!!errors.state}
                                    helperText={errors.state?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    fullWidth 
                                    label='Country' 
                                    {...register('country',{required:'Country is required'})}
                                    error={!!errors.country}
                                    helperText={errors.country?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    fullWidth 
                                    label='Postal Code' 
                                    {...register('postalCode',{required:'Postal code is required'})}
                                    error={!!errors.postalCode}
                                    helperText={errors.postalCode?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    fullWidth 
                                    label='Phone Number' 
                                    {...register('phoneNumber',{required:'Phone number is required'})}
                                    error={!!errors.phoneNumber}
                                    helperText={errors.phoneNumber?.message}
                                />
                            </Grid>
                        </Grid>
                        
                        <Button type='submit' variant='contained' sx={{alignSelf:'flex-start'}}>
                            Add Address
                        </Button>
                    </Stack>
                </form>
                    </Stack>

            {/* existing addresses */}
            <Stack rowGap={3}>
                <Stack>
                    <Typography variant='h6'>Select Delivery Address</Typography>
                    <Typography variant='body2' color={'text.secondary'}>Choose from your saved addresses</Typography>
                </Stack>

                <Grid container spacing={2}>
                        {
                            addresses.map((address,index)=>(
                            <Grid item xs={12} sm={6} md={4} key={address._id}>
                                    <Stack key={address._id} p={is480?2:2} width={is480?'100%':'20rem'} height={is480?'auto':'15rem'}  rowGap={2} component={is480?Paper:Paper} elevation={1}>

                                        <Stack flexDirection={'row'} alignItems={'center'}>
                                            <Radio checked={selectedAddress===address} name='addressRadioGroup' value={selectedAddress} onChange={(e)=>setSelectedAddress(addresses[index])}/>
                                            <Typography>{address.type}</Typography>
                                        </Stack>

                                        {/* details */}
                                        <Stack>
                                            <Typography>{address.street}</Typography>
                                            <Typography>{address.state}, {address.city}, {address.country}, {address.postalCode}</Typography>
                                            <Typography>{address.phoneNumber}</Typography>
                                        </Stack>
                                    </Stack>
                            </Grid>
                            ))
                        }
                </Grid>

            </Stack>
            
            {/* payment methods */}
            <Stack rowGap={3}>

                    <Stack>
                        <Typography variant='h6'>Payment Methods</Typography>
                        <Typography variant='body2' color={'text.secondary'}>Please select a payment method</Typography>
                    </Stack>
                    
                    <Stack rowGap={2}>

                        <Stack flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'}>
                            <Radio value={selectedPaymentMethod} name='paymentMethod' checked={selectedPaymentMethod==='COD'} onChange={()=>setSelectedPaymentMethod('COD')}/>
                            <Typography>Cash on Delivery</Typography>
                        </Stack>

                        <Stack flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'}>
                            <Radio value={selectedPaymentMethod} name='paymentMethod' checked={selectedPaymentMethod==='razorpay'} onChange={()=>setSelectedPaymentMethod('razorpay')}/>
                            <Typography>Online Payment (Cards, UPI, Net Banking)</Typography>
                        </Stack>

                    </Stack>

            </Stack>
        </Stack>

        {/* right box */}
        <Stack  width={is900?'100%':'auto'} alignItems={is900?'flex-start':''}>
            <Typography variant='h4'>Order summary</Typography>
            <Cart checkout={true}/>
            
            {paymentError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {paymentError}
                </Alert>
            )}
            
            <LoadingButton 
                fullWidth 
                loading={orderStatus==='pending' || paymentLoading} 
                variant='contained' 
                onClick={handleCreateOrder} 
                size='large'
                disabled={!selectedAddress}
            >
                {selectedPaymentMethod === 'razorpay' ? 'Pay Online' : 'Place Order (COD)'}
            </LoadingButton>
        </Stack>

    </Stack>
  )
}
