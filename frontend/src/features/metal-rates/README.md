# Metal Rates Feature

This feature provides live gold and silver rates for your ecommerce jewelry website, along with a price calculator.

## Components

### 1. MetalRatesWidget
A beautiful widget that displays live gold and silver rates with:
- Real-time price updates
- Price change indicators (up/down arrows)
- Change percentage chips
- Auto-refresh every 5 minutes
- Fallback rates if APIs fail

### 2. MetalCalculator
A comprehensive calculator for jewelry pricing:
- Input: Metal type, weight, purity, making charges
- Support for multiple weight units (grams, ounces, tolas, carats)
- Support for different purity levels (24K, 22K, 18K, 14K, 10K)
- Real-time calculation based on current rates
- Detailed price breakdown

### 3. MetalRatesPage
A complete page that combines both components with additional information.

## Usage

### Basic Integration
```jsx
import { MetalRatesWidget } from '../features/metal-rates';

// In your component/page
<MetalRatesWidget />
```

### Calculator Integration
```jsx
import { MetalCalculator } from '../features/metal-rates';

// In your component/page
<MetalCalculator />
```

### Full Page
```jsx
import MetalRatesPage from '../features/metal-rates/MetalRatesPage';

// In your routing
<Route path="/metal-rates" element={<MetalRatesPage />} />
```

## API Endpoints

### GET /api/metal-rates/live
Returns current gold and silver rates:
```json
{
  "success": true,
  "data": {
    "gold": {
      "price": 1950.50,
      "unit": "USD/oz",
      "change": 5.20,
      "changePercent": 0.27
    },
    "silver": {
      "price": 23.45,
      "unit": "USD/oz",
      "change": -0.15,
      "changePercent": -0.64
    },
    "lastUpdated": "2024-01-15T10:30:00.000Z",
    "source": "metals.live"
  }
}
```

### GET /api/metal-rates/historical?days=30&metal=both
Returns historical data for charts (currently sample data).

## Data Sources

The system tries multiple APIs in order:
1. **metals.live** - Primary source for live rates
2. **CoinGecko** - Backup source
3. **Fallback data** - If all APIs fail

## Features

- **Real-time updates** every 5 minutes
- **Caching** to reduce API calls
- **Multiple weight units** support
- **Purity calculations** for different karat values
- **Making charges** calculation
- **Responsive design** for all devices
- **Error handling** with fallback data
- **Auto-refresh** functionality

## Installation

1. Install axios in backend:
   ```bash
   cd backend && npm install axios
   ```

2. The routes are automatically added to your main server

3. Import and use components in your frontend

## Customization

You can customize:
- Update frequency (change the interval in MetalRatesWidget)
- Cache duration (modify expiresIn in backend controller)
- Weight units (add more in weightConversions object)
- Purity levels (modify purityOptions object)
- Making charges default (change initial state)

## Notes

- Rates are cached for 5 minutes to avoid excessive API calls
- The system gracefully falls back to sample data if APIs fail
- All calculations are done in real-time using current rates
- The calculator supports both gold and silver jewelry pricing
