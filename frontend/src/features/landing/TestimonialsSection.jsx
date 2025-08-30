import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  IconButton,
  Rating,
  useTheme,
  useMediaQuery
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import StarIcon from '@mui/icons-material/Star';

const TestimonialsSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "SUGANYA",
      review: "After a lot of research, I recently purchased a pair of diamond studs from kirtilals. They have a wonderful collection of diamond jewelry. I live in the USA and order online. I must say that their customer service was excellent.",
      rating: 5
    },
    {
      id: 2,
      name: "RAMYA",
      review: "I ordered a diamond pendant from Kirtilals through their online website. They have a very beautiful collection. Their delivery is secure and on time. I always prefer Kirtilals as they deliver a perfect and trustworthy diamond finishing.",
      rating: 5
    },
    {
      id: 3,
      name: "RADHA & RAMESH",
      review: "Kirtilals has been part of us from the beginning when we started our life 20 years back. We bought all our engagement Diamond jewelry from them. Since then, our journey with Kirtilals is quite impressive. We like their quality.",
      rating: 5
    },
    {
      id: 4,
      name: "ANJALI",
      review: "I purchased a beautiful diamond ring from Kirtilals for my wedding. The craftsmanship is exceptional and the diamonds are of excellent quality. Their customer service team was very helpful throughout the process.",
      rating: 5
    },
    {
      id: 5,
      name: "VIJAY & PRIYA",
      review: "We have been customers of Kirtilals for over 15 years. Their jewelry collection is timeless and the quality is consistently excellent. We recently bought diamond earrings and they exceeded our expectations.",
      rating: 5
    },
    {
      id: 6,
      name: "MEERA",
      review: "I love the variety of designs available at Kirtilals. I ordered a diamond necklace online and the delivery was prompt. The jewelry quality is outstanding and the packaging was very elegant.",
      rating: 5
    },
    {
      id: 7,
      name: "ARUN",
      review: "Kirtilals has the best collection of diamond jewelry. I bought a diamond bracelet for my wife's birthday and she absolutely loved it. The customer service is top-notch and delivery was on time.",
      rating: 5
    },
    {
      id: 8,
      name: "SUNITA",
      review: "I have been shopping at Kirtilals for years and they never disappoint. Their diamond jewelry is of premium quality and the designs are always in trend. Highly recommended for any jewelry purchase.",
      rating: 5
    },
    {
      id: 9,
      name: "RAHUL & DEEPTI",
      review: "We purchased our wedding rings from Kirtilals and couldn't be happier. The quality of diamonds is exceptional and the craftsmanship is beautiful. Their online shopping experience was smooth and secure.",
      rating: 5
    },
    {
      id: 10,
      name: "KAVYA",
      review: "I ordered a diamond pendant set from Kirtilals and I'm extremely satisfied with my purchase. The jewelry is stunning and the quality is exactly as promised. Their customer support is excellent.",
      rating: 5
    }
  ];

  const itemsPerView = isMobile ? 1 : isTablet ? 2 : 3;
  const maxIndex = testimonials.length - itemsPerView;

  const nextTestimonial = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevTestimonial = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <Box sx={{ 
      py: { xs: 6, md: 8 },
      backgroundColor: '#f5f5f5'
    }}>
      {/* Header Banner */}
      <Box sx={{ 
        backgroundColor: '#666666',
        color: 'white',
        textAlign: 'center',
        py: 2,
        mb: 4,
        position: 'relative'
      }}>
        <Typography 
          variant="h4" 
          fontWeight={700}
          sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
        >
          Testimonials
        </Typography>
        {/* Decorative triangle */}
        <Box sx={{
          position: 'absolute',
          bottom: -10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: '10px solid #666666'
        }} />
      </Box>

      <Box sx={{ 
        maxWidth: '1200px', 
        mx: 'auto', 
        px: { xs: 2, md: 4 },
        position: 'relative'
      }}>
        {/* Navigation Arrows */}
        <IconButton
          onClick={prevTestimonial}
          disabled={currentIndex === 0}
          sx={{
            position: 'absolute',
            left: { xs: -10, md: -20 },
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: '#666666',
            color: 'white',
            width: { xs: 40, md: 50 },
            height: { xs: 40, md: 50 },
            zIndex: 2,
            '&:hover': {
              backgroundColor: '#555555',
            },
            '&:disabled': {
              backgroundColor: '#cccccc',
              color: '#999999'
            }
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <IconButton
          onClick={nextTestimonial}
          disabled={currentIndex >= maxIndex}
          sx={{
            position: 'absolute',
            right: { xs: -10, md: -20 },
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: '#666666',
            color: 'white',
            width: { xs: 40, md: 50 },
            height: { xs: 40, md: 50 },
            zIndex: 2,
            '&:hover': {
              backgroundColor: '#555555',
            },
            '&:disabled': {
              backgroundColor: '#cccccc',
              color: '#999999'
            }
          }}
        >
          <ChevronRightIcon />
        </IconButton>

        {/* Testimonials Grid */}
        <Box sx={{ 
          display: 'flex',
          gap: { xs: 2, md: 3 },
          justifyContent: 'center',
          alignItems: 'stretch'
        }}>
          {visibleTestimonials.map((testimonial) => (
            <Card 
              key={testimonial.id}
              sx={{ 
                flex: 1,
                backgroundColor: '#f8f8f8',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                position: 'relative',
                minHeight: { xs: 300, md: 280 },
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Decorative triangle in top-right corner */}
              <Box sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 0,
                height: 0,
                borderLeft: '15px solid transparent',
                borderRight: '0px solid transparent',
                borderTop: '15px solid #8B4513'
              }} />

              <CardContent sx={{ 
                p: 3,
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Rating Stars */}
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                  {[...Array(testimonial.rating)].map((_, index) => (
                    <StarIcon 
                      key={index} 
                      sx={{ 
                        color: '#FFD700',
                        fontSize: '1.5rem'
                      }} 
                    />
                  ))}
                </Box>

                {/* Review Text */}
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 3,
                    flex: 1,
                    textAlign: 'center',
                    lineHeight: 1.6,
                    color: '#333333',
                    fontSize: { xs: '0.9rem', md: '1rem' }
                  }}
                >
                  "{testimonial.review}"
                </Typography>

                {/* Customer Name */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    textAlign: 'center',
                    color: '#8B4513',
                    textTransform: 'uppercase',
                    fontSize: { xs: '0.9rem', md: '1rem' }
                  }}
                >
                  {testimonial.name}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Carousel Indicators */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 4,
          gap: 1
        }}>
          {Array.from({ length: Math.ceil(testimonials.length / itemsPerView) }, (_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentIndex(index * itemsPerView)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: index === Math.floor(currentIndex / itemsPerView) ? '#8B4513' : '#cccccc',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: index === Math.floor(currentIndex / itemsPerView) ? '#8B4513' : '#aaaaaa'
                }
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export { TestimonialsSection };
