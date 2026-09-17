const { getPool } = require('../config/db');

// @desc    Check API and DB health
// @route   GET /api/health
const checkHealth = async (req, res) => {
  let dbStatus = 'disconnected';
  let dbError = null;

  try {
    const pool = await getPool();
    await pool.request().query('SELECT 1 AS health_check');
    dbStatus = 'connected';
  } catch (err) {
    dbError = err.message;
  }

  const isHealthy = dbStatus === 'connected';

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'ok' : 'degraded',
    message: 'TaskFlow API Server is running',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      engine: 'Microsoft SQL Server',
      error: dbError,
    },
    environment: process.env.NODE_ENV || 'development',
  });
};

module.exports = {
  checkHealth,
};
