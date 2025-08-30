import React, { useState } from 'react';
import { Box, Typography, Stack, MenuItem, Select, InputLabel, FormControl, Paper } from '@mui/material';

const plans = [
  { value: 1000, label: '₹1000/month', months: 10 },
  { value: 2500, label: '₹2500/month', months: 10 },
  { value: 5000, label: '₹5000/month', months: 10 },
];

export const ChitPlanCalculatorSection = () => {
  const [selected, setSelected] = useState(plans[0].value);
  const plan = plans.find(p => p.value === selected);
  return (
    <Box sx={{py: 6, background: 'white'}}>
      <Paper elevation={2} sx={{maxWidth: 500, mx: 'auto', p: 4, borderRadius: 4}}>
        <Typography variant="h5" fontWeight={700} mb={2} align="center">Chit Plan Calculator</Typography>
        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel id="chit-plan-select-label">Select Plan</InputLabel>
            <Select
              labelId="chit-plan-select-label"
              value={selected}
              label="Select Plan"
              onChange={e => setSelected(Number(e.target.value))}
            >
              {plans.map(p => (
                <MenuItem value={p.value} key={p.value}>{p.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography align="center" color="text.secondary">
            Duration: <b>{plan.months} months</b>
          </Typography>
          <Typography align="center" color="text.secondary">
            Total Savings: <b>₹{plan.value * plan.months}</b>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};
