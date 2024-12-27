import passport from '../auth/passport.js';

const isLoggedin = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err) {
            // Handle any errors that occurred during authentication
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (!user) {
            // If user is not authenticated, return 401 Unauthorized
            return res.status(401).json({
                message: 'Unauthorized, You dont have permission for this',
                code: 'UNAUTHORIZED'
            });
        }
        // If authentication is successful, attach user information to request object
        req.user = user;

        // Call next middleware or route handler
        next();
    })(req, res, next); // Pass the next parameter
};

export default isLoggedin;
