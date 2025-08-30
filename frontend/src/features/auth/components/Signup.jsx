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
          <Stack mt={2} spacing={2} width={'100%'} component={'form'} noValidate onSubmit={handleSubmit(handleSignup)}>
            <MotionConfig whileHover={{ y: -5 }}>
              <motion.div>
                <TextField fullWidth {...register("name", { required: "Username is required" })} placeholder='Username' InputProps={{ style: { color: '#222' } }} InputLabelProps={{ style: { color: '#222' } }}/>
                {errors.name && <FormHelperText error>{errors.name.message}</FormHelperText>}
              </motion.div>
              <motion.div>
                <TextField fullWidth {...register("email", { required: "Email is required", pattern: { value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, message: "Enter a valid email" } })} placeholder='Email' InputProps={{ style: { color: '#222' } }} InputLabelProps={{ style: { color: '#222' } }}/>
                {errors.email && <FormHelperText error>{errors.email.message}</FormHelperText>}
              </motion.div>
              <motion.div>
                <TextField type='password' fullWidth {...register("password", { required: "Password is required", pattern: { value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm, message: `at least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number, Can contain special characters` } })} placeholder='Password' InputProps={{ style: { color: '#222' } }} InputLabelProps={{ style: { color: '#222' } }}/>
                {errors.password && <FormHelperText error>{errors.password.message}</FormHelperText>}
              </motion.div>
              <motion.div>
                <TextField type='password' fullWidth {...register("confirmPassword", { required: "Confirm Password is required", validate: (value, fromValues) => value === fromValues.password || "Passwords doesn't match" })} placeholder='Confirm Password' InputProps={{ style: { color: '#222' } }} InputLabelProps={{ style: { color: '#222' } }}/>
                {errors.confirmPassword && <FormHelperText error>{errors.confirmPassword.message}</FormHelperText>}
              </motion.div>
            </MotionConfig>
            <motion.div whileHover={{ scale: 1.020 }} whileTap={{ scale: 1 }}>
              <LoadingButton sx={{ height: '2.5rem' }} fullWidth loading={status === 'pending'} type='submit' variant='contained'>Signup</LoadingButton>
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
