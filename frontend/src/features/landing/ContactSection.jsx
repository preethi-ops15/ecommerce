import React from 'react';
import { Box, Typography, Stack, Button } from '@mui/material';

export const ContactSection = () => (
  <Box sx={{py: 6, backgroundColor: 'white'}}>
    <Stack alignItems="center" spacing={2} maxWidth={600} mx="auto">
      <Typography variant="h4" fontWeight={700} align="center">
        Contact Us
      </Typography>
      <Typography align="center" color="text.secondary">
        Have questions or need assistance? Reach out to our team and we’ll be happy to help you with your silver jewelry journey.
      </Typography>
      <Button variant="contained" color="primary" sx={{mt: 2}}>
        Email Us
      </Button>
    </Stack>
  </Box>
);
