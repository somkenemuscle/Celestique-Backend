import { User } from '../models/user.model.js'
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../auth/auth.js'
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { refreshSecretKey } from '../auth/config.js';
import { signUpSchema, signInSchema } from '../validators/authValidators.js';
import { setRefreshToken, setAccessToken, removeAccessToken, removeRefreshToken } from '../utils/authCookies.js';
import axios from 'axios'




//Sign Up Controller Function
export const signUpUser = async (req, res) => {
    // Validate the request body using Joi
    const { error } = signUpSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { firstname, lastname, email, password, phoneNumber, recaptchaToken } = req.body;

    // Verify reCAPTCHA token
    const recaptchaResponse = await axios.post(process.env.RECAPTCHA_VERIFICATION_URL, null, {
        params: {
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: recaptchaToken
        }
    });

    const { success } = recaptchaResponse.data;

    if (!success) return res.status(400).json({ message: 'reCAPTCHA verification failed' });

    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
        const field = existingUser.email === email ? 'email' : 'phone number';
        return res.status(409).json({ message: `User with this ${field} already exists` });
    }

    // Hash the password before storing in the database (hash and salt)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        phoneNumber
    });

    // Save the user to the database
    await newUser.save();

    // Generate token using the imported function
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    //set cookies
    setAccessToken(res, accessToken);
    setRefreshToken(res, refreshToken);

    //Respond with success message
    res.status(200).json({ message: 'User registered successfully', firstname });

}


//Sign In Controller Function
export const signInUser = async (req, res) => {

    // Validate the request body using Joi
    const { error } = signInSchema.validate(req.body);

    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;

    // Check if the user exists by their ue email
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
        // Passwords match, generate JWT token
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        //set cookies
        setAccessToken(res, accessToken);
        setRefreshToken(res, refreshToken);

        return res.status(200).json({ message: 'Sign In successful', firstname: user.firstname });
    } else {
        // Passwords don't match
        return res.status(400).json({ message: 'Invalid email or password', code: 'INVALID_EMAIL_OR_PASSWORD' });
    }
}



//Log out Controller Function
export const logOutUser = async (req, res) => {
    removeRefreshToken(res);
    removeAccessToken(res);
    res.status(200).json({ message: 'Logged out successfully' });
}



//Refresh token controller function
export const refreshToken = (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    // Check if refreshToken is present in cookies
    if (!refreshToken) return res.status(401).json(
        {
            message: 'You dont have the permission for this, Please log in.',
            code: 'REFRESH_TOKEN_NOT_FOUND'
        });


    // Verify the refresh token
    jwt.verify(refreshToken, refreshSecretKey, (err, user) => {
        if (err) return res.status(403).json({ message: 'Session timed out. Please log in again.' });

        // Generate a new access token
        const accessToken = generateAccessToken({ email: user.email, _id: user._id });

        // Set the new access token in the cookies
        setAccessToken(res, accessToken);

        return res.status(200).json({ message: 'Access token refreshed successfully' });
    });
};
