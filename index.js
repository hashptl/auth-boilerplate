const express = require('express');
const { connectDB } = require('./config/database');
const userRoutes = require('./app/routes/userRoutes');
require('dotenv').config();

const app = express();

// Load environment variables
const port = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1/users', userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
