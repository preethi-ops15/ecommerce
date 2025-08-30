# Silver Ecommerce Platform

A full-stack ecommerce platform built with React.js frontend and Node.js backend, featuring silver jewelry products, chit plans, and comprehensive user management.

## ✅ Quick Start: Run on a New Laptop (Client Instructions)

Follow these steps exactly. No prior setup needed besides Node.js and MongoDB.

1) Install prerequisites
- Install Node.js LTS: https://nodejs.org/
- Install MongoDB Community Server: https://www.mongodb.com/try/download/community
  - Start MongoDB service (it usually starts automatically). No extra config needed.

2) Backend setup (API)
- Open a terminal in `Ecommerce/backend/`
- Install packages:
  ```bash
  npm install
  ```
- Create env file from template:
  ```bash
  copy .env.example .env   # Windows
  # or: cp .env.example .env
  ```
- Edit `backend/.env` and set at least:
  ```env
  MONGO_URI=mongodb://localhost:27017/jewellerydb
  JWT_SECRET=any_strong_random_text
  ORIGIN=http://localhost:3000
  ```
  Optional (only if payments/email are needed): `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `EMAIL`, `PASSWORD`.
- Run the backend (port 8000):
  ```bash
  npm run dev
  ```
  Keep this terminal running.

3) Frontend setup (Website)
- Open a second terminal in `Ecommerce/frontend/`
- Install packages:
  ```bash
  npm install
  ```
- Create env file from template:
  ```bash
  copy .env.example .env   # Windows
  # or: cp .env.example .env
  ```
- Edit `frontend/.env` and set:
  ```env
  REACT_APP_BASE_URL=http://localhost:8000
  ```
  Optional: `REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxx` if testing Razorpay checkout.
- Start the frontend (port 3000):
  ```bash
  npm start
  ```

4) Login and test
- Open http://localhost:3000
- Create an account and login.
- Browse products, add to cart, checkout.
  - If you did not set Razorpay keys, use COD to test order flow.

Notes
- If you see “Unauthorized (401)”, login first and try again.
- If frontend can’t connect, ensure backend is running on port 8000.



## 📁 Project Structure

```
Ecommerce/
├── frontend/          # React.js frontend application
├── backend/           # Node.js backend API
├── README.md         # This file
└── LICENSE
```

## 🎯 Pages & Features

### Public Pages
| Page | Route | Description |
|------|-------|-------------|
| **HomePage** | `/` | Landing page with featured products and benefits calculator |
| **ShopPage** | `/shop` | Product catalog with filtering and search |
| **ProductDetailsPage** | `/product-details/:id` | Individual product view with reviews |
| **ChitPlanPage** | `/chit-plan` | Silver investment calculator and plans |
| **AboutPage** | `/about` | Company information and mission |
| **LoginPage** | `/login` | User authentication |
| **SignupPage** | `/signup` | User registration |
| **ForgotPasswordPage** | `/forgot-password` | Password recovery |
| **OtpVerificationPage** | `/verify-otp` | OTP verification for signup |
| **ResetPasswordPage** | `/reset-password/:userId/:token` | Password reset |
| **NotFoundPage** | `*` | 404 error page |

### Protected User Pages
| Page | Route | Description |
|------|-------|-------------|
| **UserDashboardPage** | `/user-dashboard` | User dashboard with orders and profile |
| **UserProfilePage** | `/profile` | User profile management |
| **UserOrdersPage** | `/orders` | Order history and tracking |
| **CartPage** | `/cart` | Shopping cart management |
| **WishlistPage** | `/wishlist` | Saved products |
| **CheckoutPage** | `/checkout` | Order checkout process |
| **OrderSuccessPage** | `/order-success/:id` | Order confirmation |

### Admin Pages
| Page | Route | Description |
|------|-------|-------------|
| **AdminDashboardPage** | `/admin/dashboard` | Admin analytics and overview |
| **AdminProductsPage** | `/admin/products` | Product management |
| **AdminOrdersPage** | `/admin/orders` | Order management |
| **AdminCustomersPage** | `/admin/customers` | Customer management |
| **AdminAnalyticsPage** | `/admin/analytics` | Sales analytics |
| **AddProductPage** | `/admin/add-product` | Add new products |
| **ProductUpdatePage** | `/admin/update-product/:id` | Edit products |
| **AdminQueriesPage** | `/admin/queries` | Customer queries management |

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   ```env
   PORT=8000
   MONGO_URI=mongodb://localhost:27017/silver-ecommerce
   JWT_SECRET=your_jwt_secret_key
   ORIGIN=http://localhost:3000
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

5. **Start the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📦 Package Dependencies

### Backend Dependencies
```json
{
  "bcryptjs": "^2.4.3",        // Password hashing
  "cookie-parser": "^1.4.6",    // Cookie parsing
  "cors": "^2.8.5",            // Cross-origin resource sharing
  "dotenv": "^16.3.1",         // Environment variables
  "express": "^4.18.2",        // Web framework
  "jsonwebtoken": "^9.0.2",    // JWT authentication
  "mongoose": "^8.0.2",        // MongoDB ODM
  "morgan": "^1.10.0",         // HTTP request logger
  "multer": "^2.0.2",          // File upload handling
  "nodemailer": "^6.9.7"       // Email sending
}
```

### Frontend Dependencies
```json
{
  "@emotion/react": "^11.11.1",           // CSS-in-JS styling
  "@emotion/styled": "^11.11.0",          // Styled components
  "@mui/icons-material": "^5.14.19",      // Material-UI icons
  "@mui/lab": "^5.0.0-alpha.155",        // Material-UI lab components
  "@mui/material": "^5.14.20",            // Material-UI components
  "@reduxjs/toolkit": "^2.0.1",           // State management
  "axios": "^1.6.2",                      // HTTP client
  "framer-motion": "^10.18.0",            // Animations
  "lottie-react": "^2.4.0",               // Lottie animations
  "react": "^18.2.0",                     // React library
  "react-dom": "^18.2.0",                 // React DOM
  "react-hook-form": "^7.48.2",           // Form handling
  "react-redux": "^9.0.2",                // Redux React bindings
  "react-router-dom": "^6.26.1",          // Routing
  "react-scripts": "5.0.1",               // Create React App scripts
  "react-toastify": "^9.1.3",             // Toast notifications
  "swiper": "^11.2.10"                    // Carousel/slider
}
```

## 🗄️ Database Setup

### MongoDB Connection

1. **Local MongoDB:**
   - Install MongoDB locally
   - Start MongoDB service
   - Create database: `silver-ecommerce`

2. **MongoDB Atlas (Cloud):**
   - Create account at [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new cluster
   - Get connection string
   - Update `MONGO_URI` in `.env`

### Database Models

The application uses the following MongoDB models:
- **User** - User accounts and profiles
- **Product** - Product catalog
- **Order** - Order management
- **Cart** - Shopping cart items
- **Review** - Product reviews
- **Wishlist** - Saved products
- **Address** - User addresses
- **Brand** - Product brands
- **Category** - Product categories
- **Query** - Customer queries

## 🔗 Frontend-Backend Connection

### API Configuration

The frontend connects to the backend through:

1. **Base URL Configuration:**
   ```javascript
   // In API files
   const BASE_URL = 'http://localhost:8000/api';
   ```

2. **CORS Configuration (Backend):**
   ```javascript
   server.use(cors({
     origin: [
       'http://localhost:3000',
       'http://localhost:3001',
       process.env.ORIGIN
     ],
     credentials: true
   }));
   ```

3. **API Endpoints:**
   - Authentication: `/api/auth`
   - Products: `/api/products`
   - Orders: `/api/orders`
   - Cart: `/api/cart`
   - Users: `/api/users`
   - Reviews: `/api/reviews`
   - Wishlist: `/api/wishlist`
   - Address: `/api/address`

### Authentication Flow

1. **Login/Signup** → JWT token generation
2. **Token storage** → HTTP-only cookies
3. **Protected routes** → Token verification
4. **Auto-logout** → Token expiration handling

## 🚀 Running the Application

### Development Mode

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:8000
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm start
   # App runs on http://localhost:3000
   ```

### Production Mode

1. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

3. **Serve Frontend:**
   ```bash
   npm install -g serve
   serve -s build
   ```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/silver-ecommerce
JWT_SECRET=your_secure_jwt_secret
ORIGIN=http://localhost:3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_BASE_URL=http://localhost:3000
```

## 📱 Features Overview

### User Features
- ✅ User registration and authentication
- ✅ Product browsing and search
- ✅ Shopping cart management
- ✅ Wishlist functionality
- ✅ Order placement and tracking
- ✅ Product reviews and ratings
- ✅ Address management
- ✅ Profile management

### Admin Features
- ✅ Product management (CRUD)
- ✅ Order management
- ✅ Customer management
- ✅ Analytics dashboard
- ✅ Query management
- ✅ Category and brand management

### Special Features
- ✅ **Chit Plan Calculator** - Silver investment planning
- ✅ **Benefits Calculator** - Investment returns calculation
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Real-time Updates** - Live order status
- ✅ **Email Notifications** - Order confirmations

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Ensure network connectivity

2. **CORS Errors:**
   - Verify CORS configuration in backend
   - Check frontend URL in backend CORS settings

3. **JWT Token Issues:**
   - Ensure JWT_SECRET is set in `.env`
   - Check token expiration settings

4. **File Upload Issues:**
   - Verify uploads directory exists
   - Check file size limits
   - Ensure proper permissions

### Development Tips

1. **Use nodemon for backend development:**
   ```bash
   npm run dev
   ```

2. **Enable React Developer Tools** for debugging

3. **Use Redux DevTools** for state management debugging

4. **Check browser console** for frontend errors

5. **Monitor backend logs** for API issues

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Happy Coding! 🚀**"# ECommerce1" 
