import rateLimit from 'express-rate-limit'

export const apiLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        status: 429,
        error: 'Too many requests, please try again later.',
    },
});


// Rate limiter for sign-in
export const signInLimiter = rateLimit({
    windowMs: 3 * 60 * 1000, // 3 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        status: 429,
        error: 'Too many sign-in attempts, please try again later.',
    }
});

// Rate limiter for sign-up
export const signUpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 10 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        status: 429,
        error: 'Too many sign-up attempts, please try again later.',
    }
});