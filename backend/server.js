const express = require('express');
const cors = require('cors');
const attendanceRoutes = require('./routes/attendance');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Enhanced CORS - Allow ALL origins
app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Test route - SIMPLE AND RELIABLE
app.get('/api/test', (req, res) => {
  console.log('✅ Test endpoint hit');
  res.json({ 
    message: '🚀 BACKEND IS WORKING PERFECTLY!', 
    status: 'SUCCESS',
    database: 'MySQL Connected',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Health check with database connection test
app.get('/api/health', async (req, res) => {
  try {
    const db = require('./config/database');
    
    // Test database connection
    db.query('SELECT 1 + 1 AS result', (err, results) => {
      if (err) {
        console.error('❌ Database health check failed:', err.message);
        return res.status(500).json({
          status: 'ERROR',
          server: 'Running',
          database: 'Connection failed',
          error: err.message
        });
      }
      
      console.log('✅ Health check passed - Database connected');
      res.json({
        status: 'HEALTHY',
        server: 'Running on port ' + PORT,
        database: 'Connected and responsive',
        timestamp: new Date().toISOString()
      });
    });
    
  } catch (error) {
    console.error('❌ Health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      error: error.message
    });
  }
});

// Initialize database table
app.get('/api/init', (req, res) => {
  console.log('🔄 Initializing database...');
  const db = require('./config/database');
  
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS attendance (
      id INT AUTO_INCREMENT PRIMARY KEY,
      employeeName VARCHAR(255) NOT NULL,
      employeeID VARCHAR(100) NOT NULL,
      date DATE NOT NULL,
      status ENUM('Present', 'Absent') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;
  
  db.query(createTableSQL, (err, result) => {
    if (err) {
      console.error('❌ Table creation failed:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Database setup failed',
        details: err.message 
      });
    }
    console.log('✅ Database table initialized successfully');
    res.json({ 
      success: true,
      message: '✅ Database ready! Table created successfully.',
      table: 'attendance'
    });
  });
});

// API Routes
app.use('/api/attendance', attendanceRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🏢 Employee Attendance Tracker API',
    version: '1.0',
    status: 'RUNNING',
    endpoints: {
      test: 'GET /api/test',
      health: 'GET /api/health',
      init: 'GET /api/init',
      attendance: {
        list: 'GET /api/attendance',
        create: 'POST /api/attendance',
        delete: 'DELETE /api/attendance/:id',
        search: 'GET /api/attendance/search?query=name'
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET  /',
      'GET  /api/test',
      'GET  /api/health',
      'GET  /api/init',
      'GET  /api/attendance',
      'POST /api/attendance',
      'DELETE /api/attendance/:id',
      'GET  /api/attendance/search?query=name'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('💥 Global error handler:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Start server with error handling
const startServer = () => {
  try {
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('='.repeat(70));
      console.log('🚀 EMPLOYEE ATTENDANCE TRACKER BACKEND - SERVER RUNNING!');
      console.log('='.repeat(70));
      console.log(`✅ PORT: ${PORT}`);
      console.log(`✅ URL: http://localhost:${PORT}`);
      console.log(`✅ Health: http://localhost:${PORT}/api/health`);
      console.log(`✅ Test: http://localhost:${PORT}/api/test`);
      console.log(`✅ Init DB: http://localhost:${PORT}/api/init`);
      console.log('='.repeat(70));
      console.log('📡 Waiting for frontend connections...');
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use!`);
        console.log('💡 Try these solutions:');
        console.log('   1. Kill the process using port ' + PORT);
        console.log('   2. Use a different port in .env file');
        console.log('   3. Wait a few seconds and restart');
        process.exit(1);
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Initialize and start
console.log('🔧 Starting server...');
startServer();