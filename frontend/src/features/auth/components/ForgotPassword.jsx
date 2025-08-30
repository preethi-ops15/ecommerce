import { FormHelperText, Paper, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { clearForgotPasswordError, clearForgotPasswordSuccessMessage, forgotPasswordAsync,resetForgotPasswordStatus,selectForgotPasswordError, selectForgotPasswordStatus, selectForgotPasswordSuccessMessage } from '../AuthSlice'
import { LoadingButton } from '@mui/lab'
import { Link } from 'react-router-dom'
import {motion} from 'framer-motion'
import { Box } from '@mui/material'

export const ForgotPassword = () => {
    const {register,handleSubmit,reset,formState: { errors }} = useForm()
    const dispatch=useDispatch()
    const status=useSelector(selectForgotPasswordStatus)
    const error=useSelector(selectForgotPasswordError)
    const successMessage=useSelector(selectForgotPasswordSuccessMessage)
    const theme=useTheme()
    const is500=useMediaQuery(theme.breakpoints.down(500))

    useEffect(()=>{
        if(error){
            toast.error(error?.message)
        }
        return ()=>{
            dispatch(clearForgotPasswordError())
        }
    },[error])

    useEffect(()=>{
        if(status==='fullfilled'){
            toast.success(successMessage?.message)
        }
        return ()=>{
            dispatch(clearForgotPasswordSuccessMessage())
        }
    },[status])

    useEffect(()=>{
        return ()=>{
            dispatch(resetForgotPasswordStatus())
        }
    },[])

    const handleForgotPassword=async(data)=>{
        dispatch(forgotPasswordAsync(data))
        reset()
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
        <Stack rowGap={'1rem'} alignItems={'center'}>
          <Stack component={Paper} elevation={3} sx={{
            borderRadius: 3,
            p: { xs: 2, sm: 4 },
            width: { xs: '95vw', sm: '30rem' },
            maxWidth: '95vw',
            boxSizing: 'border-box',
            alignItems: 'center',
            backdropFilter: 'blur(16px)',
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            border: '1px solid rgba(255,255,255,0.18)',
          }}>
            <Stack component={'form'} width={'100%'} p={0} rowGap={'1rem'} noValidate onSubmit={handleSubmit(handleForgotPassword)}>
              <Stack rowGap={'.4rem'} alignItems={'center'}>
                <Typography variant='h5' fontWeight={600} textAlign="center">{status === 'fullfilled' ? "Email has been sent!" : "Forgot Your Password?"}</Typography>
                <Typography color={'text.secondary'} variant='body2' textAlign="center">{status === 'fullfilled' ? "Please check your inbox and click on the received link to reset your password" : "Enter your registered email below to receive password reset link"}</Typography>
              </Stack>
              {status !== 'fullfilled' && <>
                <motion.div whileHover={{ y: -2 }}>
                  <TextField fullWidth sx={{ mt: 1 }} {...register("email", { required: "Please enter a email", pattern: { value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, message: "Enter a valid email" } })} placeholder='Enter email' />
                  {errors.email && <FormHelperText sx={{ fontSize: ".9rem", mt: 1 }} error >{errors.email.message}</FormHelperText>}
                </motion.div>
                <motion.div whileHover={{ scale: 1.020 }} whileTap={{ scale: 1 }}>
                  <LoadingButton sx={{ height: '2.5rem' }} fullWidth loading={status === 'pending'} type='submit' variant='contained'>Send Password Reset Link</LoadingButton>
                </motion.div>
              </>}
            </Stack>
          </Stack>
          <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 1.050 }}>
            <Typography sx={{ textDecoration: "none", color: "text.primary", width: "fit-content" }} mt={2} to={'/login'} variant='body2' component={Link}>Go back to <span style={{ color: theme.palette.primary.dark }}>login</span></Typography>
          </motion.div>
        </Stack>
      </Stack>
    </Box>
  )
}
