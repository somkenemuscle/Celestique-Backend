import mongoose from 'mongoose';


export default function connectDb() {

    // Get the MongoDB connection URL from environment variables

    if (!process.env.DB_URL) {
        console.error('Database URL is not defined in the environment variables');
        process.exit(1); // Exit the process with an error code
    }

    // Connect to MongoDB without deprecated options
    mongoose.connect(process.env.DB_URL)
        .then(() => console.log('Celestique app has connected to the database'))
        .catch(err => {
            console.error('Error connecting to database:', err);
            process.exit(1); // Exit the process with an error code on failure
        });
}
