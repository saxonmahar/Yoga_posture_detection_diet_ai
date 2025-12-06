require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5001;
const connectDB = require('./Db.config/Dbconfig');

app.use(express.json());
// Connect to Database
connectDB();

// Simple test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Yoga API is Working!', 
    status: 'OK',
    endpoints: {
      poses: 'GET /api/yoga/poses',
      health: 'GET /health'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Yoga poses endpoint
app.get('/api/yoga/poses', (req, res) => {
  res.json({
    success: true,
    poses: [
      { id: 1, name: 'Mountain Pose', difficulty: 'Beginner' },
      { id: 2, name: 'Tree Pose', difficulty: 'Beginner' },
      { id: 3, name: 'Warrior II', difficulty: 'Intermediate' }
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(50));
  console.log('YOGA POSE DETECTION API STARTED!');
  console.log('='.repeat(50));
  console.log('Server: http://localhost:' + PORT);
  console.log('Health: http://localhost:' + PORT + '/health');
  console.log('Poses:  http://localhost:' + PORT + '/api/yoga/poses');
  console.log('='.repeat(50));
  console.log('');
});
