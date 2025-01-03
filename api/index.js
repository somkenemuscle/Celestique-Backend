import app from "../src/app.js"; // Import the app from the src folder
import { createServer } from "@vercel/node";

export default createServer(app); // Export the serverless function
