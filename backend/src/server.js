
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const apiRoutes = require('./routes/api');

const app = express();

/* ================================
   BASIC CONFIG
================================ */
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/* ================================
   MIDDLEWARE
================================ */
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================================
   REQUEST LOGGER
================================ */
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `${new Date().toISOString()} | ${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration}ms`
    );
  });

  next();
});

/* ================================
   API ROUTES
================================ */
app.use('/api', apiRoutes);

/* ================================
   HEALTH CHECK
================================ */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'Book Research Assistant API',
    version: '1.0.0',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    deepseekConfigured: !!(
      process.env.DEEPSEEK_API_KEY &&
      process.env.DEEPSEEK_API_KEY !== 'your_deepseek_api_key_here'
    )
  });
});

/* ================================
   SERVE REACT FRONTEND (PRODUCTION)
================================ */
if (NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../../frontend/build');

  // Serve static files
  app.use(express.static(buildPath));

  // React Router fallback
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

/* ================================
   ROOT ROUTE (DEV ONLY)
================================ */
if (NODE_ENV !== 'production') {
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to Book Research Assistant API',
      version: '1.0.0',
      endpoints: {
        health: 'GET /health',
        test: 'GET /api/test',
        search: 'POST /api/search'
      }
    });
  });
}

/* ================================
   404 HANDLER
================================ */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

/* ================================
   GLOBAL ERROR HANDLER
================================ */
app.use((err, req, res, next) => {
  console.error('🚨 Server Error:', err);

  res.status(err.statusCode || 500).json({
    success: false,
    error: 'Internal Server Error',
    message:
      NODE_ENV === 'production'
        ? 'Something went wrong'
        : err.message,
    ...(NODE_ENV !== 'production' && { stack: err.stack })
  });
});

/* ================================
   START SERVER
================================ */
const server = app.listen(PORT, () => {
  console.log(`
🚀 Server started successfully
📚 Book Research Assistant

🌐 Environment: ${NODE_ENV}
🔗 App URL: http://localhost:${PORT}
🔗 API Base: http://localhost:${PORT}/api
🔗 Health: http://localhost:${PORT}/health

🧠 DeepSeek API:
${process.env.DEEPSEEK_API_KEY &&
process.env.DEEPSEEK_API_KEY !== 'your_deepseek_api_key_here'
  ? '✅ Configured'
  : '⚠️ Not configured (mock data mode)'
}
`);
});

/* ================================
   PROCESS SAFETY
================================ */
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

module.exports = server;