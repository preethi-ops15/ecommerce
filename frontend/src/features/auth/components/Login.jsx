import {Box, FormHelperText, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from "react-hook-form"
import {useDispatch,useSelector} from 'react-redux'
import { LoadingButton } from '@mui/lab';
import {selectLoggedInUser,loginAsync,selectLoginStatus, selectLoginError, clearLoginError, resetLoginStatus} from '../AuthSlice'
import { toast } from 'react-toastify'
import {MotionConfig, motion} from 'framer-motion'
import { Paper } from '@mui/material';

export const Login = () => {
  const dispatch=useDispatch()
  const status=useSelector(selectLoginStatus)
  const error=useSelector(selectLoginError)
  const loggedInUser=useSelector(selectLoggedInUser)
  const {register,handleSubmit,reset,formState: { errors }} = useForm()
  const navigate=useNavigate()
  const location=useLocation()
  const theme=useTheme()
  
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
    }
    else if(loggedInUser && !loggedInUser?.isVerified){
      navigate("/verify-otp")
    }
  },[loggedInUser, redirectTo, navigate, dispatch, reset])

  // handles login error and toast them
  useEffect(()=>{
    if(error){
      toast.error(error.message)
    }
  },[error])

  // handles login status and dispatches reset actions to relevant states in cleanup
  useEffect(()=>{
    // Avoid duplicate success toasts; LoginPopup handles success notification
    if(status==='fullfilled' && loggedInUser?.isVerified===true){
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

  return (
    <Box sx={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Box
        sx={{
          position: 'absolute',
          width: '100vw',
          height: '100vh',
          top: 0,
          left: 0,
          zIndex: 0,
          background: 'url(/auth-jewelry-bg.png) center/cover no-repeat, #fff',
          // Remove blur and opacity
        }}
      />
      <Stack
        width={'100vw'}
        height={'100vh'}
        justifyContent={'center'}
        alignItems={'center'}
        sx={{ position: 'relative', zIndex: 1 }}
      >
        <Stack
          spacing={2}
          component={Paper}
          elevation={3}
          sx={{
            borderRadius: 3,
            p: { xs: 2, sm: 4 },
            width: { xs: '95vw', sm: '28rem' },
            maxWidth: '95vw',
            boxSizing: 'border-box',
            alignItems: 'center',
            backdropFilter: 'blur(16px)',
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            border: '1px solid rgba(255,255,255,0.18)',
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
          
          <Stack mt={2} spacing={2} width={'100%'} component={'form'} noValidate onSubmit={handleSubmit(handleLogin)}>
            <motion.div whileHover={{ y: -5 }}>
              <TextField fullWidth {...register("email", { required: "Email is required", pattern: { value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, message: "Enter a valid email" } })} placeholder='Email' InputProps={{ style: { color: '#222' } }} InputLabelProps={{ style: { color: '#222' } }}/>
              {errors.email && <FormHelperText sx={{ mt: 1 }} error>{errors.email.message}</FormHelperText>}
            </motion.div>
            <motion.div whileHover={{ y: -5 }}>
              <TextField type='password' fullWidth {...register("password", { required: "Password is required" })} placeholder='Password' InputProps={{ style: { color: '#222' } }} InputLabelProps={{ style: { color: '#222' } }}/>
              {errors.password && <FormHelperText sx={{ mt: 1 }} error>{errors.password.message}</FormHelperText>}
            </motion.div>
            <motion.div whileHover={{ scale: 1.020 }} whileTap={{ scale: 1 }}>
              <LoadingButton fullWidth sx={{ height: '2.5rem' }} loading={status === 'pending'} type='submit' variant='contained'>Login</LoadingButton>
            </motion.div>
            <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap-reverse'}>
              <MotionConfig whileHover={{ x: 2 }} whileTap={{ scale: 1.050 }}>
                <motion.div>
                  <Typography mr={'1.5rem'} sx={{ textDecoration: "none", color: "text.primary" }} to={'/forgot-password'} component={Link}>Forgot password</Typography>
                </motion.div>
                <motion.div>
                  <Typography sx={{ textDecoration: "none", color: "text.primary" }} to={'/signup'} component={Link}>Don't have an account? <span style={{ color: theme.palette.primary.dark }}>Register</span></Typography>
                </motion.div>
              </MotionConfig>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}
