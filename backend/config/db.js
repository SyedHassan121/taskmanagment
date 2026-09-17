require('dotenv').config();
const sql = require('mssql');

const dbConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'taskflow_db',
  port: parseInt(process.env.DB_PORT, 10) || 1433,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true', // true for Azure/Cloud
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false', // true for local dev
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let poolPromise = null;

async function getPool() {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(dbConfig)
      .connect()
      .then((pool) => {
        console.log('✅ Connected to SQL Server database:', dbConfig.database);
        return pool;
      })
      .catch((err) => {
        console.error('❌ SQL Server connection error:', err.message);
        poolPromise = null;
        throw err;
      });
  }
  return poolPromise;
}

// Auto-initialize tables
async function initDB() {
  try {
    const pool = await getPool();
    const createTableQuery = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='tasks' AND xtype='U')
      BEGIN
        CREATE TABLE tasks (
          id INT IDENTITY(1,1) PRIMARY KEY,
          title NVARCHAR(255) NOT NULL,
          description NVARCHAR(MAX) NULL,
          status NVARCHAR(50) DEFAULT 'pending',
          priority NVARCHAR(50) DEFAULT 'medium',
          created_at DATETIME2 DEFAULT GETDATE()
        );

        INSERT INTO tasks (title, description, status, priority)
        VALUES 
          ('Set up local database', 'Create taskflow_db on SQL Server and configure .env', 'completed', 'high'),
          ('Test API endpoints', 'Verify GET, POST, PUT, DELETE /api/tasks', 'in_progress', 'high'),
          ('Deploy project to cloud', 'Deploy backend to Render/Railway and frontend to Vercel', 'pending', 'medium');
      END
    `;
    await pool.request().query(createTableQuery);
    console.log('✅ Database schema verified / initialized.');
  } catch (err) {
    console.warn('⚠️ SQL Server initialization note:', err.message);
  }
}

module.exports = {
  sql,
  getPool,
  initDB,
  dbConfig,
};
