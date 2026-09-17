require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./config/db');

// Route Imports
const healthRoutes = require('./routes/healthRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middlewares
app.use(cors({
  origin: '*', // Allows all origins in development and deployment
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/tasks', taskRoutes);

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Start Server
app.listen(PORT, async () => {
  console.log(`🚀 TaskFlow Backend running on port ${PORT}`);
  console.log(`🩺 Health check available at: http://localhost:${PORT}/api/health`);
  await initDB();
});
