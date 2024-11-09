import 'dotenv/config';

export const secretKey = process.env.JWT_SECRET_KEY; 
export const refreshSecretKey = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;

