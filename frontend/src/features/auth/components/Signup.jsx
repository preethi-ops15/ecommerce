import {FormHelperText, Stack, TextField, Typography,Box, useTheme, useMediaQuery, Paper} from '@mui/material'
import React, { useEffect } from 'react'
import Lottie from 'lottie-react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { ecommerceOutlookAnimation, shoppingBagAnimation} from '../../../assets'
import {useDispatch,useSelector} from 'react-redux'
import { LoadingButton } from '@mui/lab';
import {selectLoggedInUser, signupAsync,selectSignupStatus, selectSignupError, clearSignupError, resetSignupStatus} from '../AuthSlice'
import { toast } from 'react-toastify'
import { MotionConfig , motion} from 'framer-motion'

export const Signup = () => {
  const dispatch=useDispatch()
  const status=useSelector(selectSignupStatus)
  const error=useSelector(selectSignupError)
  const loggedInUser=useSelector(selectLoggedInUser)
  const {register,handleSubmit,reset,formState: { errors }} = useForm()
  const navigate=useNavigate()
  const theme=useTheme()
  const is900=useMediaQuery(theme.breakpoints.down(900))
  const is480=useMediaQuery(theme.breakpoints.down(480))

  // handles user redirection
  useEffect(()=>{
    if(loggedInUser && !loggedInUser?.isVerified){
      navigate("/verify-otp")
    }
    else if(loggedInUser && loggedInUser?.isVerified){
      navigate("/", { replace: true })
    }
  },[loggedInUser])


  // handles signup error and toast them
  useEffect(()=>{
    if(error){
      toast.error(error.message)
    }
  },[error])

  
  useEffect(()=>{
    if(status==='fullfilled'){
      toast.success("Welcome to Jewells! Verify your email to start exploring our exquisite silver jewelry collection.")
      reset()
    }
    return ()=>{
      dispatch(clearSignupError())
      dispatch(resetSignupStatus())
    }
  },[status])

  // this function handles signup and dispatches the signup action with credentails that api requires
  const handleSignup=(data)=>{
    const cred={...data}
    delete cred.confirmPassword
    dispatch(signupAsync(cred))
  }

  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Stack
        width={'100vw'}
        height={'100vh'}
        justifyContent={'center'}
        alignItems={'center'}
        sx={{ position: 'relative', zIndex: 1 }}
      >
        <Stack
          spacing={3}
          component={Paper}
          elevation={8}
          sx={{
            borderRadius: 4,
            p: { xs: 3, sm: 4 },
            width: { xs: '95vw', sm: '400px' },
            maxWidth: '95vw',
            boxSizing: 'border-box',
            alignItems: 'center',
            backdropFilter: 'blur(20px)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
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
          <Stack mt={2} spacing={3} width={'100%'} component={'form'} noValidate onSubmit={handleSubmit(handleSignup)}>
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <TextField 
                fullWidth 
                {...register("name", { required: "Username is required" })} 
                placeholder='Username' 
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
              {errors.name && <FormHelperText sx={{ mt: 1 }} error>{errors.name.message}</FormHelperText>}
            </motion.div>
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
                {...register("password", { 
                  required: "Password is required", 
                  pattern: { 
                    value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm, 
                    message: `at least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number, Can contain special characters` 
                  } 
                })} 
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
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <TextField 
                type='password' 
                fullWidth 
                {...register("confirmPassword", { 
                  required: "Confirm Password is required", 
                  validate: (value, fromValues) => value === fromValues.password || "Passwords doesn't match" 
                })} 
                placeholder='Confirm Password' 
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
              {errors.confirmPassword && <FormHelperText sx={{ mt: 1 }} error>{errors.confirmPassword.message}</FormHelperText>}
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
              <LoadingButton 
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
                fullWidth 
                loading={status === 'pending'} 
                type='submit' 
                variant='contained'
              >
                Signup
              </LoadingButton>
            </motion.div>
            <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap-reverse'}>
              <MotionConfig whileHover={{ x: 2 }} whileTap={{ scale: 1.050 }}>
                <motion.div>
                  <Typography mr={'1.5rem'} sx={{ textDecoration: "none", color: "text.primary" }} to={'/forgot-password'} component={Link}>Forgot password</Typography>
                </motion.div>
                <motion.div>
                  <Typography sx={{ textDecoration: "none", color: "text.primary" }} to={'/login'} component={Link}>Already a member? <span style={{ color: theme.palette.primary.dark }}>Login</span></Typography>
                </motion.div>
              </MotionConfig>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}
