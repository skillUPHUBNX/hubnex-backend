import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/mongodb';
import fromRoutes from './routes/from.router';
import adminRoutes from './routes/admin.router';


// Load environment variables
dotenv.config();

// Destructure the port from the environment variables
const { PORT } = process.env;

// Create an Express app
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: ["https://hubnex-project-q12p.vercel.app","http://localhost:5173"], // Change this to your allowed frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// API route for "from" resource
app.use("/api/from", fromRoutes);
app.use("/api/admin", adminRoutes);

// Test Endpoint
app.get("/", (req, res) => {
  res.send("API is Working");
});

// Start the server after successfully connecting to the database
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API is working on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
