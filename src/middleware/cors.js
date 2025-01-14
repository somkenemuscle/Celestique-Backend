import cors from 'cors';

// CORS Middleware Configuration
const corsMiddleware = cors({
  origin: process.env.VERCEL_FRONTEND_URL, // Use environment variable or localhost
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Allow cookies to be sent
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  optionsSuccessStatus: 200 // Handle legacy browsers' issues with 204 status
});

export default corsMiddleware;
