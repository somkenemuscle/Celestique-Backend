import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// CORS Middleware Configuration
const corsMiddleware = cors({
  // origin: `${process.env.VERCEL_FRONTEND_URL}`, // Replace with your frontend URL
  // origin: process.env.VERCEL_FRONTEND_URL || 'http://localhost:3000', // Use environment variable or localhost
   origin: 'https://celestique.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Allow cookies to be sent
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  optionsSuccessStatus: 200 // Handle legacy browsers' issues with 204 status
});

export default corsMiddleware;
