import mongoose from 'mongoose';


export default function connectDb() {

    // Get the MongoDB connection URL from environment variables
    const dbUrl = 'mongodb+srv://somkene:muscle$$090@celestiquecluster.uwhws.mongodb.net/?retryWrites=true&w=majority&appName=CelestiqueCluster';

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
