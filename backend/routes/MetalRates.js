const express = require('express');
const router = express.Router();
const { getLiveMetalRates, getHistoricalRates, calculateProductPrice } = require('../controllers/metalRatesController');

// Get live gold and silver rates
router.get('/live', getLiveMetalRates);

// Get historical rates for charts
router.get('/historical', getHistoricalRates);

// Calculate product price based on live rates
router.post('/calculate-price', calculateProductPrice);

module.exports = router;
