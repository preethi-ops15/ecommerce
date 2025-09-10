import {Box, FormHelperText, Stack, TextField, Typography, useMediaQuery, useTheme, Dialog, DialogContent, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from "react-hook-form"
import {useDispatch,useSelector} from 'react-redux'
import { LoadingButton } from '@mui/lab';
import {selectLoggedInUser,loginAsync,selectLoginStatus, selectLoginError, clearLoginError, resetLoginStatus} from '../AuthSlice'
import { toast } from 'react-toastify'
import {MotionConfig, motion} from 'framer-motion'
import { Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ForgotPasswordPopup } from './ForgotPasswordPopup';
import { useLoginPopup } from '../../../contexts/LoginPopupContext';

export const LoginPopup = ({ open, onClose }) => {
  const dispatch=useDispatch()
  const status=useSelector(selectLoginStatus)
  const error=useSelector(selectLoginError)
  const loggedInUser=useSelector(selectLoggedInUser)
  const {register,handleSubmit,reset,formState: { errors }} = useForm()
  const navigate=useNavigate()
  const location=useLocation()
  const theme=useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const { openSignupPopup } = useLoginPopup();
  
  // Get redirect parameter from URL
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect');
  
  // handles user redirection
  useEffect(()=>{
    console.log('loggedInUser after login:', loggedInUser);
    if(loggedInUser && loggedInUser?.isVerified){
      // Check if there's a redirect parameter in URL
      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      } else if (loggedInUser.isAdmin) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
      onClose(); // Close popup after successful login
    }
    else if(loggedInUser && !loggedInUser?.isVerified){
      navigate("/verify-otp")
      onClose(); // Close popup when navigating to OTP verification
    }
  },[loggedInUser, redirectTo, navigate, dispatch, reset, onClose])

  // handles login error and toast them
  useEffect(()=>{
    if(error){
      toast.error(error.message)
    }
  },[error])

  // handles login status and dispatches reset actions to relevant states in cleanup
  useEffect(()=>{
    if(status==='fullfilled' && loggedInUser?.isVerified===true){
      toast.success(`Login successful`)
      reset()
    }
    return ()=>{ 
      dispatch(clearLoginError())
      dispatch(resetLoginStatus())
    }
  },[status])

  const handleLogin=(data)=>{
    const cred={...data}
    delete cred.confirmPassword
    dispatch(loginAsync(cred))
  }

  const handleClose = () => {
    reset();
    dispatch(clearLoginError());
    dispatch(resetLoginStatus());
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 4,
          overflow: 'hidden',
          background: 'transparent',
          boxShadow: 'none',
          margin: isMobile ? 0 : 'auto',
          maxHeight: isMobile ? '100vh' : '80vh',
          maxWidth: isMobile ? '100%' : '400px',
        }
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
        }
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        {/* Close button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: { xs: 8, sm: 16 },
            right: { xs: 8, sm: 16 },
            zIndex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: '#666',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>

        <Stack
          spacing={3}
          component={Paper}
          elevation={8}
          sx={{
            borderRadius: 4,
            p: { xs: 3, sm: 4 },
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            alignItems: 'center',
            backdropFilter: 'blur(20px)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            minHeight: isMobile ? 'auto' : '450px',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #d4af37, #f4d03f, #d4af37)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s ease-in-out infinite',
            },
            '@keyframes shimmer': {
              '0%': { backgroundPosition: '-200% 0' },
              '100%': { backgroundPosition: '200% 0' }
            }
          }}
        >
          <Stack flexDirection={'row'} justifyContent={'center'} alignItems={'center'}>
            <Stack rowGap={'.4rem'} alignItems={'center'}>
              <Typography variant='h2' sx={{ wordBreak: 'break-word' }} fontWeight={600} textAlign="center">Jewells</Typography>
              <Typography color={'GrayText'} variant='body2' textAlign="center">- Pure Silver. Pure Brilliance.</Typography>
            </Stack>
          </Stack>
          
          {redirectTo && (
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 2, width: '100%' }}>
              <Typography variant="body2" color="info.dark">
                Please log in to continue with your chit plan payment
              </Typography>
            </Box>
          )}
          
          <Stack mt={2} spacing={3} width={'100%'} component={'form'} noValidate onSubmit={handleSubmit(handleLogin)}>
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <TextField 
                fullWidth 
                {...register("email", { 
                  required: "Email is required", 
                  pattern: { 
                    value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, 
                    message: "Enter a valid email" 
                  } 
                })} 
                placeholder='Email' 
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255,255,255,1)',
                    }
                  }
                }}
                InputProps={{ style: { color: '#333', fontSize: '0.95rem' } }} 
                InputLabelProps={{ style: { color: '#666' } }}
              />
              {errors.email && <FormHelperText sx={{ mt: 1 }} error>{errors.email.message}</FormHelperText>}
            </motion.div>
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <TextField 
                type='password' 
                fullWidth 
                {...register("password", { required: "Password is required" })} 
                placeholder='Password' 
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255,255,255,1)',
                    }
                  }
                }}
                InputProps={{ style: { color: '#333', fontSize: '0.95rem' } }} 
                InputLabelProps={{ style: { color: '#666' } }}
              />
              {errors.password && <FormHelperText sx={{ mt: 1 }} error>{errors.password.message}</FormHelperText>}
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
              <LoadingButton 
                fullWidth 
                sx={{ 
                  height: '48px',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                  color: '#1a1a1a',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(212,175,55,0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #b8860b 0%, #d4af37 100%)',
                    boxShadow: '0 6px 16px rgba(212,175,55,0.4)',
                  },
                  '&:disabled': {
                    background: 'rgba(212,175,55,0.3)',
                    color: 'rgba(26,26,26,0.5)',
                  }
                }} 
                loading={status === 'pending'} 
                type='submit' 
                variant='contained'
              >
                Login
              </LoadingButton>
            </motion.div>
            <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap-reverse'}>
              <MotionConfig whileHover={{ x: 2 }} whileTap={{ scale: 1.050 }}>
                <motion.div>
                  <Typography 
                    mr={'1.5rem'} 
                    sx={{ textDecoration: "none", color: "text.primary", cursor: 'pointer' }} 
                    onClick={() => setForgotPasswordOpen(true)}
                  >
                    Forgot password
                  </Typography>
                </motion.div>
                <motion.div>
                  <Typography 
                    sx={{ textDecoration: "none", color: "text.primary", cursor: 'pointer' }} 
                    onClick={() => {
                      handleClose();
                      openSignupPopup();
                    }}
                  >
                    Don't have an account? <span style={{ color: theme.palette.primary.dark }}>Register</span>
                  </Typography>
                </motion.div>
              </MotionConfig>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
      
      {/* Forgot Password Popup */}
      <ForgotPasswordPopup 
        open={forgotPasswordOpen} 
        onClose={() => setForgotPasswordOpen(false)} 
      />
    </Dialog>
  )
}
