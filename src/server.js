import app from "./app.js";
import connectDb from "./config/db.js";

const port = process.env.PORT || 4000;

// Connect to the database
connectDb();

// Start the server
app.listen(port, () => {
    console.log(`Celestique server is running on http://localhost:${port}`);
});
