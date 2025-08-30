require("dotenv").config();
const express = require('express');
const cors = require('cors');
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const multer = require('multer');
const path = require('path');
const authRoutes = require("./routes/Auth");
const productRoutes = require("./routes/Product");
const orderRoutes = require("./routes/Order");
const cartRoutes = require("./routes/Cart");
const brandRoutes = require("./routes/Brand");
const categoryRoutes = require("./routes/Category");
const userRoutes = require("./routes/User");
const addressRoutes = require('./routes/Address');
const reviewRoutes = require("./routes/Review");
const wishlistRoutes = require("./routes/Wishlist");
const queryRoutes = require("./routes/Query");
const metalRatesRoutes = require("./routes/MetalRates");
const chitPlansRoutes = require("./routes/ChitPlans");
const adminRoutes = require("./routes/Admin");
const { connectToDB } = require("./database/db");

// server init
const server = express();

// database connection
connectToDB();

// CORS configuration (include OPTIONS preflight)
server.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.ORIGIN
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  exposedHeaders: ['X-Total-Count'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
server.options('*', cors());

// middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(morgan("tiny"));

// Serve static files from uploads directory
server.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Make upload middleware available to routes
server.locals.upload = upload;

// API routes prefixed with /api
const api = '/api';
server.use(`${api}/auth`, authRoutes);
server.use(`${api}/users`, userRoutes);
server.use(`${api}/products`, productRoutes);
server.use(`${api}/orders`, orderRoutes);
server.use(`${api}/cart`, cartRoutes);
server.use(`${api}/brands`, brandRoutes);
server.use(`${api}/categories`, categoryRoutes);
server.use(`${api}/address`, addressRoutes);
server.use(`${api}/reviews`, reviewRoutes);
server.use(`${api}/wishlist`, wishlistRoutes);
server.use(`${api}/queries`, queryRoutes);
server.use(`${api}/metal-rates`, metalRatesRoutes);
server.use(`${api}/chit-plans`, chitPlansRoutes);
server.use(`${api}/admin`, adminRoutes);

// health-check
server.get("/", (req, res) => {
  res.status(200).json({ message: 'running' });
});

// start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`server [STARTED] ~ http://localhost:${PORT}`);
});
