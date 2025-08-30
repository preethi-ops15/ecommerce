import { Box, IconButton, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import { Stack } from '@mui/material'
import React from 'react'
import { QRCodePng, appStorePng, googlePlayPng ,facebookPng,instagramPng,twitterPng,linkedinPng} from '../../assets'
import SendIcon from '@mui/icons-material/Send';
import { MotionConfig, motion } from 'framer-motion';
import { Link } from 'react-router-dom';



export const Footer = () => {

    const theme=useTheme()
    const is700=useMediaQuery(theme.breakpoints.down(700))
    const is480=useMediaQuery(theme.breakpoints.down(480))

    const labelStyles={
        fontWeight:300,
        cursor:'pointer',
        fontSize: is480 ? '0.8rem' : '0.9rem'
    }

  return (
    <Stack sx={{
        backgroundColor:theme.palette.primary.main,
        paddingTop:is480 ? "1rem" : "1.5rem",
        paddingLeft:is480 ? "0.25rem" : is700 ? "0.5rem" : "1.5rem",
        paddingRight:is480 ? "0.25rem" : is700 ? "0.5rem" : "1.5rem",
        paddingBottom:"0.5rem",
        rowGap:is480 ? "1.2rem" : "2rem",
        color:'#fff',
        justifyContent:"space-around"
    }}>

            {/* upper */}
            <Stack 
                flexDirection={'row'} 
                rowGap={'1rem'} 
                justifyContent={is700 ? "center" : 'space-around'} 
                flexWrap={'wrap'}
                sx={{
                    gap: is480 ? '2rem' : '3rem'
                }}
            >

                {/* Remove original Exclusive section */}
                {/* <Stack rowGap={'1rem'} padding={'1rem'} minWidth={is480 ? '100%' : is700 ? '45%' : 'auto'}>
                    <Typography variant='h6' fontSize={is480 ? '1.2rem' : '1.5rem'} sx={{color:'#fff'}}>Exclusive</Typography>
                    <Typography variant='h6' fontSize={is480 ? '1rem' : '1.2rem'} sx={{color:'#fff'}}>Subscribe</Typography>
                    <Typography sx={{...labelStyles, color:'#fff'}}>Get your exclusive chit plans</Typography>
                    <TextField 
                        placeholder='Enter your email' 
                        sx={{
                            border:'1px solid #fff',
                            borderRadius:"6px",
                            width: is480 ? '100%' : 'auto',
                            input: { color: '#fff' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#fff',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#fff',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#fff',
                                },
                            },
                        }} 
                        InputProps={{
                            endAdornment:<IconButton aria-label="Subscribe"><SendIcon sx={{color:'#fff'}}/></IconButton>,
                            style:{color:"#fff"}
                        }}
                    />
                </Stack> */}

                <Stack rowGap={'0.5rem'} padding={'0.5rem'} minWidth={is480 ? '100%' : is700 ? '45%' : 'auto'}>
                    <Typography variant='h6' fontSize={is480 ? '1rem' : '1.2rem'} sx={{color:'#fff'}}>Support</Typography>
                    <Typography sx={{...labelStyles, color:'#fff'}}>11th Main Street, chennai, India</Typography>
                    <Typography sx={{...labelStyles, color:'#fff'}}>jewells@gmail.com</Typography>
                    <Typography sx={{...labelStyles, color:'#fff'}}>+88015-88888-9999</Typography>
                </Stack>

                <Stack rowGap={'0.5rem'} padding={'0.5rem'} minWidth={is480 ? '100%' : is700 ? '45%' : 'auto'}>
                    <Typography variant='h6' fontSize={is480 ? '1rem' : '1.2rem'} sx={{color:'#fff'}}>Account</Typography>
                    <Typography sx={{...labelStyles, color:'#fff'}}>My Account</Typography>
                    <Typography sx={{...labelStyles, color:'#fff'}}>Login / Register</Typography>
                    <Typography sx={{...labelStyles, color:'#fff'}}>Cart</Typography>
                    <Typography sx={{...labelStyles, color:'#fff'}}>Wishlist</Typography>
                    <Typography component={Link} to="/shop" sx={{...labelStyles, color:'#fff', textDecoration:'none', '&:hover':{textDecoration:'underline'}}}>Shop</Typography>
                </Stack>

                <Stack rowGap={'0.5rem'} padding={'0.5rem'} minWidth={is480 ? '100%' : is700 ? '45%' : 'auto'}>
                    <Typography variant='h6' fontSize={is480 ? '1rem' : '1.2rem'} sx={{color:'#fff'}}>Quick Links</Typography>
                    <Typography component={Link} to="/chit-plan" sx={{...labelStyles, color:'#fff', textDecoration:'none', '&:hover':{textDecoration:'underline'}}}>Chit Plans</Typography>
                    <Typography component={Link} to="/about" sx={{...labelStyles, color:'#fff', textDecoration:'none', '&:hover':{textDecoration:'underline'}}}>About</Typography>
                    <Typography sx={{...labelStyles, color:'#fff'}}>Privacy Policy</Typography>
                    <Typography sx={{...labelStyles, color:'#fff'}}>Terms Of Use</Typography>
                    <Typography sx={{...labelStyles, color:'#fff'}}>FAQ</Typography>
                    <Typography sx={{...labelStyles, color:'#fff'}}>Contact</Typography>
                </Stack>

                {/* Last column: Shop name and exclusive content */}
                <Stack rowGap={'0.5rem'} padding={'0.5rem'} minWidth={is480 ? '100%' : is700 ? '45%' : 'auto'}>
                    <Typography variant='h6' fontSize={is480 ? '1rem' : '1.2rem'} sx={{color:'#fff'}}>Jewells</Typography>
                    <Typography variant='h6' fontSize={is480 ? '0.9rem' : '1rem'} sx={{color:'#fff'}}>Subscribe</Typography>
                    <Typography sx={{...labelStyles, color:'#fff', fontSize: is480 ? '0.7rem' : '0.8rem'}}>Get your exclusive chit plans</Typography>
                    <TextField 
                        placeholder='Enter your email' 
                        size="small"
                        sx={{
                            border:'1px solid #fff',
                            borderRadius:"6px",
                            width: is480 ? '100%' : 'auto',
                            input: { color: '#fff', fontSize: is480 ? '0.8rem' : '0.9rem' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#fff',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#fff',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#fff',
                                },
                            },
                        }} 
                        InputProps={{
                            endAdornment:<IconButton aria-label="Subscribe"><SendIcon sx={{color:'#fff', fontSize: is480 ? '1rem' : '1.2rem'}}/></IconButton>,
                            style:{color:"#fff"}
                        }}
                    />
                </Stack>

            </Stack>

           
            <Stack alignSelf={"center"} mt={is480 ? 0.5 : 1}>
                <Typography color={'#fff'} fontSize={is480 ? '0.7rem' : '0.8rem'} textAlign="center">&copy; jewells {new Date().getFullYear()}. All right reserved</Typography>
            </Stack>

    </Stack>
  )
}
