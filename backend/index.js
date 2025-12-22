require('dotenv').config();
const express = require('express');
const authRoutes =  require('./routes/authRoutes')
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// DB Connection
const connectDB = require('./DbConfig/db.config');
connectDB();

// ✅ Body Parser (MUST be before routes)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Routes

app.use(authRoutes)

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is up and running on port ${PORT}`);
});
