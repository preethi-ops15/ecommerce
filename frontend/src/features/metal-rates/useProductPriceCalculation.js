import { useState, useEffect } from 'react';
import { axiosi } from '../../config/axios';

export const useProductPriceCalculation = (product) => {
  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product && product.productWeight && product.brand) {
      calculatePrice();
    }
  }, [product]);

  const calculatePrice = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosi.post('/metal-rates/calculate-price', {
        brand: product.brand,
        productWeight: product.productWeight,
        makingCost: product.makingCost || 0,
        wastageCost: product.wastageCost || 0,
        gst: product.gst || 0
      });

      const data = response.data;

      if (data.success) {
        setCalculatedPrice(data.data);
      } else {
        throw new Error(data.message || 'Failed to calculate price');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error calculating product price:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshPrice = () => {
    calculatePrice();
  };

  return {
    calculatedPrice,
    loading,
    error,
    refreshPrice
  };
};
