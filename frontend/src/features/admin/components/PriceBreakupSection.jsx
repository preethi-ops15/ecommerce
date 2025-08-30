import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Stack,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Alert,
  Chip
} from '@mui/material';
import { Calculate as CalculateIcon, CurrencyRupee as CurrencyIcon } from '@mui/icons-material';

const PriceBreakupSection = ({ watch, register, errors, setValue }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const [priceBreakup, setPriceBreakup] = useState({
    currentRatePerGram: '',
    productWeight: '',
    totalValue: '',
    makingCost: '',
    wastageCost: '',
    totalPrice: ''
  });

  const selectedCategory = watch('category');
  const selectedMaterial = watch('brand');

  // Determine if this is a precious metal category
  const isPreciousMetal = selectedMaterial && (
    selectedMaterial.includes('gold') || 
    selectedMaterial.includes('silver')
  );

  const isGold = selectedMaterial && selectedMaterial.includes('gold');
  const isSilver = selectedMaterial && selectedMaterial.includes('silver');
  const isDiamond = selectedMaterial === 'diamond';

  // Watch form values for calculations
  const currentRatePerGram = watch('currentRatePerGram');
  const productWeight = watch('productWeight');
  const makingCost = watch('makingCost');
  const wastageCost = watch('wastageCost');
  const gstPercentage = watch('gstPercentage');

  // Calculate totals when inputs change
  useEffect(() => {
    if (productWeight) {
      // For now, use a placeholder rate since it will be calculated on the backend
      const placeholderRate = isGold ? 10166 : isSilver ? 115 : 50000; // Updated to current market rates
      const totalValue = placeholderRate * parseFloat(productWeight);
      setPriceBreakup(prev => ({ ...prev, totalValue: totalValue.toFixed(2) }));
      setValue('materialValue', totalValue.toFixed(2));
      setValue('currentRatePerGram', placeholderRate);
    }
  }, [productWeight, setValue, isGold, isSilver]);

  useEffect(() => {
    if (priceBreakup.totalValue && makingCost && wastageCost && gstPercentage) {
      const materialValue = parseFloat(priceBreakup.totalValue);
      const making = parseFloat(makingCost);
      const wastage = parseFloat(wastageCost);
      const gst = parseFloat(gstPercentage);
      
      // Calculate GST amount
      const subtotal = materialValue + making + wastage;
      const gstAmount = (subtotal * gst) / 100;
      
      const total = subtotal + gstAmount;
      
      setPriceBreakup(prev => ({ ...prev, totalPrice: total.toFixed(2) }));
      
      // Update the form's total price field for normal users
      setValue('price', total.toFixed(2));
      setValue('salePrice', total.toFixed(2));
      setValue('userPrice', total.toFixed(2));
      setValue('totalCalculatedPrice', total.toFixed(2));
      
      // Set member price as just the material value (no additional charges)
      setValue('memberPrice', priceBreakup.totalValue);
    }
  }, [priceBreakup.totalValue, makingCost, wastageCost, gstPercentage, setValue, priceBreakup.totalValue]);



  const getCategoryTitle = () => {
    if (isGold) return 'Gold Price Breakup';
    if (isSilver) return 'Silver Price Breakup';
    if (isDiamond) return 'Diamond Price Breakup';
    return 'Price Breakup';
  };

  const getMaterialLabel = () => {
    if (isGold) return 'Gold Rate (per gram)';
    if (isSilver) return 'Silver Rate (per gram)';
    if (isDiamond) return 'Diamond Rate (per carat)';
    return 'Material Rate (per gram)';
  };

  const getWeightLabel = () => {
    if (isGold) return 'Gold Weight (grams)';
    if (isSilver) return 'Silver Weight (grams)';
    if (isDiamond) return 'Diamond Weight (carats)';
    return 'Product Weight (grams)';
  };

  if (!isPreciousMetal && !isDiamond) {
    return (
      <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 1, bgcolor: '#f8f9fa' }}>
        <Typography variant="h6" fontWeight={600} gutterBottom color="text.secondary">
          Price Breakup
        </Typography>
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Price breakup is available for Gold, Silver, Platinum, and Diamond products.
          </Typography>
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 1 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <CalculateIcon color="primary" />
        <Typography variant="h6" fontWeight={600} color="primary">
          {getCategoryTitle()}
        </Typography>
        <Chip 
          label={isGold ? 'Gold' : isSilver ? 'Silver' : isDiamond ? 'Diamond' : 'Precious Metal'} 
          color="primary" 
          size="small" 
        />
      </Stack>

      <Stack spacing={3}>
        {/* Current Rate and Weight */}
        <Stack direction={isSmall ? 'column' : 'row'} spacing={2}>
          <Stack flex={1}>
            <Typography variant="body1" fontWeight={500} gutterBottom>
              {getMaterialLabel()}
            </Typography>
            <Box sx={{ 
              p: 2, 
              bgcolor: '#f0f8ff', 
              borderRadius: 1, 
              border: '1px dashed #ccc',
              textAlign: 'center'
            }}>
              <Typography variant="body2" color="text.secondary">
                Rate will be automatically calculated from live market prices
              </Typography>
            </Box>
            <TextField
              type="hidden"
              {...register("currentRatePerGram")}
              value="0"
              sx={{ display: 'none' }}
            />
          </Stack>
          
          <Stack flex={1}>
            <Typography variant="body1" fontWeight={500} gutterBottom>
              {getWeightLabel()} *
            </Typography>
                         <TextField
               type="number"
               placeholder={isGold ? "e.g., 8.05" : isSilver ? "e.g., 15.5" : "e.g., 1.5"}
               {...register("productWeight", {
                 required: "Product weight is required",
                 min: { value: 0, message: "Weight must be positive" }
               })}
               InputProps={{
                 endAdornment: <Typography variant="caption" color="text.secondary">
                   {isDiamond ? 'carats' : 'grams'}
                 </Typography>
               }}
               fullWidth
               error={!!errors.productWeight}
               helperText={errors.productWeight?.message}
             />
          </Stack>
        </Stack>

                 {/* Total Value Display */}
         {priceBreakup.totalValue && (
           <Paper elevation={0} sx={{ p: 2, bgcolor: '#f0f8ff', borderRadius: 1 }}>
             <Stack direction="row" justifyContent="space-between" alignItems="center">
               <Typography variant="body1" fontWeight={500}>
                 {isGold ? 'Gold Value' : isSilver ? 'Silver Value' : 'Diamond Value'}:
               </Typography>
               <Typography variant="h6" fontWeight={600} color="primary">
                 ₹{parseFloat(priceBreakup.totalValue).toLocaleString('en-IN')}
               </Typography>
             </Stack>
             <TextField
               type="hidden"
               {...register("materialValue")}
               value={priceBreakup.totalValue}
               sx={{ display: 'none' }}
             />
           </Paper>
         )}

        <Divider />

        {/* Additional Costs */}
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Additional Costs
        </Typography>

        <Stack direction={isSmall ? 'column' : 'row'} spacing={2}>
          <Stack flex={1}>
            <Typography variant="body1" fontWeight={500} gutterBottom>
              Making Cost (₹) *
            </Typography>
                         <TextField
               type="number"
               placeholder="e.g., 5000"
               {...register("makingCost", {
                 required: "Making cost is required",
                 min: { value: 0, message: "Making cost must be positive" }
               })}
               InputProps={{
                 startAdornment: <CurrencyIcon position="start" />
               }}
               fullWidth
               error={!!errors.makingCost}
               helperText={errors.makingCost?.message}
             />
          </Stack>
          
          <Stack flex={1}>
            <Typography variant="body1" fontWeight={500} gutterBottom>
              Wastage Cost (₹) *
            </Typography>
                         <TextField
               type="number"
               placeholder="e.g., 1000"
               {...register("wastageCost", {
                 required: "Wastage cost is required",
                 min: { value: 0, message: "Wastage cost must be positive" }
               })}
               InputProps={{
                 startAdornment: <CurrencyIcon position="start" />
               }}
               fullWidth
               error={!!errors.wastageCost}
               helperText={errors.wastageCost?.message}
             />
          </Stack>
        </Stack>

        <Stack>
          <Typography variant="body1" fontWeight={500} gutterBottom>
            GST Percentage (%) *
          </Typography>
                     <TextField
             type="number"
             placeholder="e.g., 3 (for 3% GST)"
             {...register("gstPercentage", {
               required: "GST percentage is required",
               min: { value: 0, message: "GST percentage must be positive" },
               max: { value: 28, message: "GST percentage cannot exceed 28%" }
             })}
             InputProps={{
               endAdornment: <Typography variant="caption" color="text.secondary">%</Typography>
             }}
             fullWidth
             error={!!errors.gstPercentage}
             helperText={errors.gstPercentage?.message}
           />
        </Stack>

        {/* Final Total */}
        {priceBreakup.totalPrice && (
          <Paper elevation={2} sx={{ p: 3, bgcolor: '#e8f5e8', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Pricing Summary
            </Typography>
            
            <Stack spacing={2}>
              {/* Price Breakdown */}
              <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <Typography variant="body2" fontWeight={500} gutterBottom>
                  Price Breakdown:
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Material Value:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      ₹{parseFloat(priceBreakup.totalValue).toLocaleString('en-IN')}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Making Cost:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      ₹{parseFloat(makingCost || 0).toLocaleString('en-IN')}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Wastage Cost:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      ₹{parseFloat(wastageCost || 0).toLocaleString('en-IN')}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      GST ({gstPercentage || 0}%):
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      ₹{((parseFloat(priceBreakup.totalValue || 0) + parseFloat(makingCost || 0) + parseFloat(wastageCost || 0)) * parseFloat(gstPercentage || 0) / 100).toFixed(2)}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
              
              {/* Normal User Price */}
              <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 1, border: '1px solid #4caf50' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" fontWeight={500} color="text.secondary">
                    Normal User Price:
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="success.main">
                    ₹{parseFloat(priceBreakup.totalPrice).toLocaleString('en-IN')}
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Includes: Material value + Making charges + Wastage charges + GST
                </Typography>
              </Box>
              
              {/* Member Price */}
              <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 1, border: '1px solid #ff9800' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" fontWeight={500} color="text.secondary">
                    Member Price (Chit Plan):
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="warning.main">
                    ₹{parseFloat(priceBreakup.totalValue).toLocaleString('en-IN')}
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Material value only (no additional charges or GST)
                </Typography>
              </Box>
            </Stack>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              <em>Prices will be automatically calculated using live metal rates when the product is viewed</em>
            </Typography>
            
            <TextField
              type="hidden"
              {...register("totalCalculatedPrice")}
              value={priceBreakup.totalPrice}
              sx={{ display: 'none' }}
            />
          </Paper>
        )}
      </Stack>
    </Paper>
  );
};

export default PriceBreakupSection; 