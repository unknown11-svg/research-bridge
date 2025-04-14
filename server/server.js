require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Import routes properly
const authRoutes = require('./routes/authRoutes');
// const researchRoutes = require('./routes/researchRoutes'); // Uncomment when ready

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Research Bridge Backend is Running!');
});

// API Routes - Ensure these are properly required
app.use('/api/auth', authRoutes);
// app.use('/api/research', researchRoutes); // Uncomment when ready

// Database connection and server start
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`
        ✅ Server running on port ${PORT}
        🛠️  API: http://localhost:${PORT}/api
        🌐 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}
      `);
    });
  })
  .catch(err => {
    console.error('🔥 Database connection failed:', err);
    process.exit(1);
  });