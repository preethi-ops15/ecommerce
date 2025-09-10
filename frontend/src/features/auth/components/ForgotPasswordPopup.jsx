import {Box, FormHelperText, Stack, TextField, Typography, useMediaQuery, useTheme, Dialog, DialogContent, IconButton } from '@mui/material'
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import {useDispatch,useSelector} from 'react-redux'
import { LoadingButton } from '@mui/lab';
import {selectLoggedInUser, forgotPasswordAsync, selectForgotPasswordStatus, selectForgotPasswordError, clearForgotPasswordError, resetForgotPasswordStatus} from '../AuthSlice'
import { toast } from 'react-toastify'
import {MotionConfig, motion} from 'framer-motion'
import { Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const ForgotPasswordPopup = ({ open, onClose }) => {
  const dispatch=useDispatch()
  const status=useSelector(selectForgotPasswordStatus)
  const error=useSelector(selectForgotPasswordError)
  const loggedInUser=useSelector(selectLoggedInUser)
  const {register,handleSubmit,reset,formState: { errors }} = useForm()
  const navigate=useNavigate()
  const theme=useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  // handles forgot password error and toast them
  useEffect(()=>{
    if(error){
      toast.error(error.message)
    }
  },[error])

  // handles forgot password status and dispatches reset actions to relevant states in cleanup
  useEffect(()=>{
    if(status==='fullfilled'){
      toast.success("Password reset link sent to your email!")
      reset()
      onClose()
    }
    return ()=>{ 
      dispatch(clearForgotPasswordError())
      dispatch(resetForgotPasswordStatus())
    }
  },[status])

  const handleForgotPassword=(data)=>{
    dispatch(forgotPasswordAsync(data))
  }

  const handleClose = () => {
    reset();
    dispatch(clearForgotPasswordError());
    dispatch(resetForgotPasswordStatus());
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
            minHeight: isMobile ? 'auto' : '400px',
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
          <Stack alignItems={'center'} rowGap={1}>
            <Typography variant='h2' sx={{ wordBreak: 'break-word' }} fontWeight={600} textAlign="center">Jewells</Typography>
            <Typography color={'GrayText'} variant='body2' textAlign="center">- Pure Silver. Pure Brilliance.</Typography>
          </Stack>
          
          <Typography variant='h5' fontWeight={600} textAlign="center" color="primary.main">
            Reset Your Password
          </Typography>
          
          <Typography variant='body2' color="text.secondary" textAlign="center" sx={{ maxWidth: '300px' }}>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>
          
          <Stack mt={2} spacing={3} width={'100%'} component={'form'} noValidate onSubmit={handleSubmit(handleForgotPassword)}>
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
                placeholder='Enter your email address' 
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
                Send Reset Link
              </LoadingButton>
            </motion.div>
            
            <Stack alignItems="center" spacing={1}>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                textAlign="center"
              >
                Remember your password?
              </Typography>
              <Typography 
                sx={{ 
                  color: '#d4af37', 
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  '&:hover': {
                    color: '#b8860b'
                  }
                }} 
                onClick={() => {
                  handleClose();
                  // You can add logic to open login popup here
                }}
              >
                Back to Login
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
