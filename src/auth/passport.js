import { User } from '../models/user.model.js';
import { secretKey } from './config.js';
import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';


// Function to extract token from cookies
const extractJwtFromCookies = (req) => {
    return req.cookies.accessToken;
};

const opts = {
    jwtFromRequest: extractJwtFromCookies,
    secretOrKey: secretKey
};

export default passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload._id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

