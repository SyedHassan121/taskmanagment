require('dotenv').config();
const mysql = require('mysql2/promise');

// Build connection configuration (supports full URL or separate variables)
const getPoolConfig = () => {
  const connectionUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;

  if (connectionUrl && !connectionUrl.includes('${{')) {
    return {
      uri: connectionUrl,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }

  return {
    host: process.env.MYSQLHOST || process.env.DB_HOST || process.env.DB_SERVER || 'localhost',
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || process.env.DB_DATABASE || 'railway',
    port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT, 10) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
      rejectUnauthorized: false,
    },
  };
};

let pool = null;

function getPool() {
  if (!pool) {
    const config = getPoolConfig();
    pool = mysql.createPool(config);
    console.log(`🔌 Initialized MySQL connection pool for database: ${process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'railway'}`);
  }
  return pool;
}

// Auto-initialize MySQL tables
async function initDB() {
  try {
    const currentPool = getPool();
    // Test connection
    const connection = await currentPool.getConnection();
    console.log('✅ Connected to live MySQL Database successfully!');
    connection.release();

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        priority VARCHAR(50) DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await currentPool.query(createTableQuery);

    // Seed sample tasks if empty
    const [rows] = await currentPool.query('SELECT COUNT(*) as count FROM tasks');
    if (rows[0].count === 0) {
      await currentPool.query(`
        INSERT INTO tasks (title, description, status, priority)
        VALUES 
          ('Set up live Railway database', 'Connected live MySQL database to backend', 'completed', 'high'),
          ('Test API endpoints live', 'Verify GET, POST, PUT, DELETE /api/tasks with live MySQL', 'in_progress', 'high'),
          ('Deploy project to cloud', 'Deploy backend to Railway/Render and frontend to Vercel', 'pending', 'medium');
      `);
      console.log('🌱 Seeded sample tasks into live MySQL database.');
    }

    console.log('✅ Live MySQL database schema verified & ready.');
  } catch (err) {
    console.warn('⚠️ MySQL connection/initialization note:', err.message);
  }
}

module.exports = {
  getPool,
  initDB,
};
