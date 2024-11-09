import cors from 'cors';
import dotenv from 'dotenv'
// Load environment variables from .env file
dotenv.config();


// Create and export the CORS middleware configuration
const corsMiddleware = cors({
  // origin: `${process.env.VERCEL_FRONTEND_URL}`, // Replace with your frontend URL
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
});

export default corsMiddleware;
