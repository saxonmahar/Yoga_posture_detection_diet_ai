require("dotenv").config();
const express = require("express");
const cors = require('cors')
const cookieParser = require("cookie-parser");


const authRoutes = require("./routes/authRoutes");
const connectDB = require("./DbConfig/db.config");

const app = express();
const PORT = process.env.PORT || 5001;

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

// CORS (simple + controlled)
app.use(cookieParser())
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3001", // your frontend
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true // allow cookies
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
|--------------------------------------------------------------------------
| Database
|--------------------------------------------------------------------------
*/
connectDB();

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/
app.use("/api/auth", authRoutes);

// Health check / root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running"
  });
});

/*
|--------------------------------------------------------------------------
| Server
|--------------------------------------------------------------------------
*/
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
