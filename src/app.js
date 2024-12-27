import dotenv from 'dotenv';
import express from 'express';
import corsMiddleware from './middleware/cors.js';
import passport from 'passport';
import userRoutes from './routes/user.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import cookieParser from 'cookie-parser';
import { apiLimiter } from './middleware/rateLimiter.js';
import throttle from './middleware/throttle.js';
import morgan from 'morgan';
import productRoutes from './routes/product.routes.js'
import isLoggedin from './utils/isLoggedin.js';




// Load environment variables if not in production
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// Initialize Express application
const app = express();

// Use Morgan for logging HTTP requests
app.use(morgan('dev'));

// Use the CORS middleware
app.use(corsMiddleware);

app.options('*', corsMiddleware);

// Apply general rate limiter before any API processing
app.use(throttle);

// To parse form data in POST request body
app.use(express.urlencoded({ extended: true }));

// To parse incoming JSON in POST request body
app.use(express.json({ limit: '2mb' }));

// Use cookieParser middleware
app.use(cookieParser());

// Initialize Passport for authentication
app.use(passport.initialize());

// Apply specific rate limiter to API routes
app.use('/api/', apiLimiter);

// Product-relatd routes
app.use('/api/products', productRoutes);

// Authentication-related routes
app.use('/api/auth', userRoutes);

//Authenticate Routes Below this middleware
app.use(isLoggedin);

// Payment-related routes
app.use('/api/payments', paymentRoutes);

//Cart-related routes
app.use('/api/cart', cartRoutes);

//Order-related routes
app.use('/api/orders', orderRoutes);


// Error handling middleware
app.use((err, res) => {
    // Extract status and message from the error object, defaulting to 500 and a generic message
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';

    // Log the error details to the console for debugging
    console.error(err);

    // Send the error response to the client
    res.status(status).json({ message });
});


export default app;
