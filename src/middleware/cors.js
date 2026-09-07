import cors from 'cors';

// Resolve the allowlist lazily (per request) so it works regardless of when
// dotenv loads relative to module import order.
// VERCEL_FRONTEND_URL may be a single origin or a comma-separated list,
// e.g. "https://celestique.vercel.app,https://celestique.com"
function getAllowedOrigins() {
  const origins = (process.env.VERCEL_FRONTEND_URL || '')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);

  if (process.env.NODE_ENV !== 'production') {
    origins.push('http://localhost:3000');
  }

  return origins;
}

// CORS Middleware Configuration
const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow non-browser tools / server-to-server requests (no Origin header)
    if (!origin) return callback(null, true);

    if (getAllowedOrigins().includes(origin.replace(/\/$/, ''))) {
      return callback(null, true);
    }
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true, // Allow cookies to be sent
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // Handle legacy browsers' issues with 204 status
});

export default corsMiddleware;
