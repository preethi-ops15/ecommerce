import React from 'react';
import { Box, Typography, Stack } from '@mui/material';

export const AboutSection = () => (
  <Box sx={{py: 6, backgroundColor: '#f7f7f7'}}>
    <Stack alignItems="center" spacing={2} maxWidth={800} mx="auto">
      <Typography variant="h4" fontWeight={700} align="center">
        About Lumina Jewels
      </Typography>
      <Typography align="center" color="text.secondary">
        We are passionate about crafting pure silver jewelry that blends timeless elegance with modern style. Our mission is to make silver accessible and desirable for everyone, with flexible chit plans and a wide range of stunning designs.
      </Typography>
    </Stack>
  </Box>
);
