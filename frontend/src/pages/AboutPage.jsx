import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar, Stack, Divider, CircularProgress } from '@mui/material';
import DiamondIcon from '@mui/icons-material/Diamond';
import VerifiedIcon from '@mui/icons-material/Verified';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useTheme, useMediaQuery } from '@mui/material';
import StoreDetailsPage from './StoreDetailsPage';

export const AboutPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const values = [
    {
      icon: <DiamondIcon sx={{ fontSize: { xs: 32, md: 40 }, color: 'primary.main' }} />,
      title: "Premium Quality",
      description: "We source only the finest materials and work with skilled artisans to create jewelry that lasts a lifetime."
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: { xs: 32, md: 40 }, color: 'success.main' }} />,
      title: "Authentic & Certified",
      description: "All our jewelry comes with proper certification and authenticity guarantees for your peace of mind."
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: { xs: 32, md: 40 }, color: 'error.main' }} />,
      title: "Customer First",
      description: "Your satisfaction is our priority. We provide exceptional service and support throughout your journey."
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: { xs: 32, md: 40 }, color: 'warning.main' }} />,
      title: "Award Winning",
      description: "Recognized for excellence in jewelry design and customer service across the industry."
    }
  ];

  const team = [
    {
      name: "Priya Sharma",
      role: "Founder & CEO",
      description: "20+ years in jewelry design with a passion for creating timeless pieces."
    },
    {
      name: "Rajesh Kumar",
      role: "Head of Operations",
      description: "Expert in jewelry manufacturing and quality assurance processes."
    },
    {
      name: "Meera Patel",
      role: "Chief Designer",
      description: "Award-winning designer specializing in contemporary and traditional styles."
    }
  ];

  return (
    <Box>
      {/* Hero Section with Background Image and Glow */}
      <Box 
        id="hero"
        sx={{ 
          position: 'relative',
          minHeight: '45vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url('/about-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          overflow: 'hidden'
        }}
      >
        {/* Glowing overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.45) 0%, rgba(156, 39, 176, 0.35) 100%)',
            boxShadow: '0 0 80px 20px rgba(156,39,176,0.15) inset',
            zIndex: 1
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white', width: '100%' }}>
          <Typography variant="h2" fontWeight={800} sx={{ mb: 2, textShadow: '0 4px 24px #000' }}>
            About Us
          </Typography>
          <Typography variant="h5" sx={{ textShadow: '0 2px 8px #000', fontWeight: 400 }}>
            Crafting beautiful jewelry with passion, precision, and pure brilliance since 2010
          </Typography>
        </Box>
      </Box>

      {/* Our Story Section with Workshop Image */}
      <Box sx={{ bgcolor: 'white', py: { xs: 6, md: 10 }, px: { xs: 2, md: 6 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ bgcolor: '#f8f9fa', borderRadius: 3, boxShadow: 1, p: { xs: 2, md: 4 } }}>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
                Our Story
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Founded in 2010, Jewells began as a small family business with a simple vision: to create exquisite jewelry that celebrates life's precious moments. What started in a modest workshop has grown into a trusted name in the jewelry industry.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We believe that jewelry is more than just an accessory – it's a reflection of your personality, a symbol of your achievements, and a treasure that can be passed down through generations. Every piece we create is crafted with meticulous attention to detail and genuine care.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ width: '100%', borderRadius: 3, overflow: 'hidden', boxShadow: 2 }}>
              <img
                src="/workshop.jpg"
                alt="Jewelry Workshop"
                style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Team Cards Section */}
      <Box sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, md: 6 }, background: 'linear-gradient(90deg, #f8f9fa 0%, #e3f0ff 100%)' }}>
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {team.map((member, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card sx={{ borderRadius: 3, boxShadow: 2, p: 2, textAlign: 'center' }}>
                <CardContent>
                  <Stack alignItems="center" spacing={2}>
                    <Avatar
                      sx={{ 
                        bgcolor: 'primary.main',
                        width: 64,
                        height: 64,
                        fontSize: 32,
                        fontWeight: 'bold'
                      }}
                    >
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      {member.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.description}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Our Mission Section */}
      <Box sx={{ my: 6, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{
          bgcolor: 'linear-gradient(135deg, #e3f0ff 0%, #fbeaff 100%)',
          borderRadius: 3,
          boxShadow: 2,
          p: { xs: 3, md: 5 },
          maxWidth: 700,
          textAlign: 'center'
        }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
            Our Mission
          </Typography>
          <Typography variant="h6" sx={{ fontStyle: 'italic', color: 'primary.main' }}>
            "To create exceptional jewelry that captures the essence of pure brilliance, making every moment special and every customer feel truly valued."
          </Typography>
        </Box>
      </Box>

      {/* Store Details & Contact Us Section */}
      <StoreDetailsPage />
    </Box>
  );
};
