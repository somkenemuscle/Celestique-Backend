import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables if not already loaded
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

export default function connectDb() {
    // Get the MongoDB connection URL from environment variables
    const dbUrl = process.env.DB_URL;

    if (!dbUrl) {
        console.error('Database URL is not defined in the environment variables');
        process.exit(1); // Exit the process with an error code
    }

    // Connect to MongoDB without deprecated options
    mongoose.connect(dbUrl)
    .then(() => console.log('Celestique app has connected to the database'))
    .catch(err => {
        console.error('Error connecting to database:', err);
        process.exit(1); // Exit the process with an error code on failure
    });
}
