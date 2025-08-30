# Chit Plans Payment Integration Setup

## Prerequisites

1. **Razorpay Account**: Sign up at [razorpay.com](https://razorpay.com)
2. **Backend Dependencies**: Install required packages
3. **Environment Variables**: Configure your backend environment

## Installation

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/your_database_name

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
COOKIE_EXPIRATION_DAYS=30

# Server Configuration
PORT=8000
ORIGIN=http://localhost:3000
PRODUCTION=false

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_key_here

# Email Configuration (if using nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# OTP Configuration
OTP_EXPIRATION_TIME=300000
```

### 3. Get Razorpay Keys

1. Log in to your Razorpay Dashboard
2. Go to Settings → API Keys
3. Generate a new key pair
4. Copy the Key ID and Key Secret to your `.env` file

**Note**: Use test keys for development, live keys for production

### 4. Frontend Environment Variables
Create a `.env` file in the frontend directory:

```env
REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
REACT_APP_BASE_URL=http://localhost:8000
```

## Running the Application

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm start
```

## Payment Flow

1. **User selects a chit plan** → `/chit-plans`
2. **Review plan details** → `/chit-plans/summary?plan=2`
3. **Proceed to payment** → `/chit-plans/payment?plan=2`
4. **Payment gateway opens** → Razorpay popup
5. **Payment completion** → Success confirmation

## API Endpoints

- `POST /api/chit-plans/create-payment-order` - Create payment order
- `POST /api/chit-plans/verify-payment` - Verify payment
- `GET /api/chit-plans/user-plan` - Get user's active plan
- `GET /api/chit-plans/plans` - Get all available plans

## Database Models

### ChitPlanOrder
- Stores payment orders and their status
- Links to user and plan information
- Tracks Razorpay order IDs

### User (Updated)
- Added `chitPlan` field to track subscriptions
- Stores plan details, start date, and status

## Testing

1. Use Razorpay test cards for development
2. Test with different plan amounts
3. Verify payment flow end-to-end
4. Check database updates after successful payment

## Security Notes

- JWT tokens are stored in HTTP-only cookies
- Payment verification uses cryptographic signatures
- User authentication required for all payment endpoints
- Input validation on all API endpoints

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check JWT token and authentication
2. **Payment Order Creation Failed**: Verify Razorpay keys
3. **Payment Verification Failed**: Check signature verification
4. **Database Connection**: Ensure MongoDB is running

### Debug Steps

1. Check backend console logs
2. Verify environment variables
3. Test API endpoints with Postman
4. Check browser console for frontend errors
