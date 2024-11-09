import app from "./app.js";
import connectDb from "./config/db.js";

const PORT = process.env.PORT || 4000;

// Connect to the database
connectDb();

// Start the server
app.listen(PORT, () => {
    console.log(`Retweet server is running on http://localhost:${PORT}`);
});
