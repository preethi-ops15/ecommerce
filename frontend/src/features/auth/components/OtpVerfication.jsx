import {Button, FormHelperText, Paper, Stack, TextField, Typography, Box } from '@mui/material'
import React, { useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearOtpVerificationError, clearResendOtpError, clearResendOtpSuccessMessage, resendOtpAsync, resetOtpVerificationStatus, resetResendOtpStatus, selectLoggedInUser, selectOtpVerificationError, selectOtpVerificationStatus, selectResendOtpError, selectResendOtpStatus, selectResendOtpSuccessMessage, verifyOtpAsync } from '../AuthSlice'
import { LoadingButton } from '@mui/lab'
import { useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import {toast} from 'react-toastify'


export const OtpVerfication = () => {
    
    const {register,handleSubmit,formState: { errors }} = useForm()
    const dispatch=useDispatch()
    const loggedInUser=useSelector(selectLoggedInUser)
    const navigate=useNavigate()
    const resendOtpStatus=useSelector(selectResendOtpStatus)
    const resendOtpError=useSelector(selectResendOtpError)
    const resendOtpSuccessMessage=useSelector(selectResendOtpSuccessMessage)
    const otpVerificationStatus=useSelector(selectOtpVerificationStatus)
    const otpVerificationError=useSelector(selectOtpVerificationError)

    // handles the redirection
    useEffect(()=>{
        if(!loggedInUser){
            navigate('/login')
        }
        else if(loggedInUser && loggedInUser?.isVerified){
            navigate("/")
        }
    },[loggedInUser])

    const handleSendOtp=()=>{
        const data={user:loggedInUser?._id}
        dispatch(resendOtpAsync(data))
    }
    
    const handleVerifyOtp=(data)=>{
        const cred={...data,userId:loggedInUser?._id}
        dispatch(verifyOtpAsync(cred))
    }

    // handles resend otp error
    useEffect(()=>{
        if(resendOtpError){
            toast.error(resendOtpError.message)
        }
        return ()=>{
            dispatch(clearResendOtpError())
        }
    },[resendOtpError])

    // handles resend otp success message
    useEffect(()=>{
        if(resendOtpSuccessMessage){
            toast.success(resendOtpSuccessMessage.message)
        }
        return ()=>{
            dispatch(clearResendOtpSuccessMessage())
        }
    },[resendOtpSuccessMessage])

    // handles error while verifying otp
    useEffect(()=>{
        if(otpVerificationError){
            toast.error(otpVerificationError.message)
        }
        return ()=>{
            dispatch(clearOtpVerificationError())
        }
    },[otpVerificationError])

    useEffect(()=>{
        if(otpVerificationStatus==='fullfilled'){
            toast.success("Email verified! We are happy to have you here")
            dispatch(resetResendOtpStatus())
        }
        return ()=>{
            dispatch(resetOtpVerificationStatus())
        }
    },[otpVerificationStatus])

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
        rowGap={3}
      >
        <Stack alignItems={'center'} rowGap={1}>
          <Typography variant='h2' sx={{ wordBreak: 'break-word' }} fontWeight={600} textAlign="center">Jewells</Typography>
          <Typography color={'GrayText'} variant='body2' textAlign="center">- Pure Silver. Pure Brilliance.</Typography>
        </Stack>
        
        <Typography variant='h5' fontWeight={600} textAlign="center" color="primary.main">
          Verify Your Email Address
        </Typography>

            {
                resendOtpStatus==='fullfilled'?(
                    <Stack width={'100%'} rowGap={3} component={'form'} noValidate onSubmit={handleSubmit(handleVerifyOtp)}>
                        <Stack rowGap={2}> 
                            <Stack alignItems="center">
                                <Typography color={'GrayText'} textAlign="center">Enter the 4 digit OTP sent on</Typography>
                                <Typography fontWeight={'600'} color={'primary.main'} textAlign="center">{loggedInUser?.email}</Typography>
                            </Stack>
                            <Stack>
                                <TextField 
                                    {...register("otp",{required:"OTP is required",minLength:{value:4,message:"Please enter a 4 digit OTP"}})} 
                                    fullWidth 
                                    type='number' 
                                    placeholder="Enter 4-digit OTP"
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
                                    InputProps={{ 
                                        style: { color: '#333', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '0.5rem' } 
                                    }} 
                                    InputLabelProps={{ style: { color: '#666' } }}
                                />
                                {errors?.otp && <FormHelperText sx={{color:"red", mt: 1}}>{errors.otp.message}</FormHelperText>}
                            </Stack>
                       </Stack>
                        <LoadingButton 
                            loading={otpVerificationStatus==='pending'}  
                            type='submit' 
                            fullWidth 
                            variant='contained'
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
                        >
                            Verify Email
                        </LoadingButton>
                    </Stack>
                ):
                <>
                <Stack alignItems="center" rowGap={2}>
                    <Typography color={'GrayText'} textAlign="center">We will send you an OTP on</Typography>
                    <Typography fontWeight={'600'} color={'primary.main'} textAlign="center">{loggedInUser?.email}</Typography>
                </Stack>
                <LoadingButton 
                    onClick={handleSendOtp} 
                    loading={resendOtpStatus==='pending'} 
                    fullWidth 
                    variant='contained'
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
                >
                    Send OTP
                </LoadingButton>
                </>
             }

      </Stack>
    </Box>
  )
}
