require('dotenv').config();
const mysql = require('mysql2/promise');

// Helper to ignore unresolved Railway template strings like ${{...}}
const sanitize = (val) => {
  if (!val || typeof val !== 'string') return undefined;
  if (val.includes('${{')) return undefined;
  return val.trim();
};

const getPoolConfig = () => {
  // Support MYSQL_PRIVATE_URL, MYSQL_URL, and DATABASE_URL
  const connectionUrl = 
    sanitize(process.env.MYSQL_PRIVATE_URL) || 
    sanitize(process.env.MYSQL_URL) || 
    sanitize(process.env.DATABASE_URL);

  if (connectionUrl) {
    console.log('🔌 Connecting using MySQL private/public connection URL...');
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

  const host = sanitize(process.env.MYSQLHOST) || sanitize(process.env.DB_HOST) || 'localhost';
  const user = sanitize(process.env.MYSQLUSER) || sanitize(process.env.DB_USER) || 'root';
  const password = sanitize(process.env.MYSQLPASSWORD) || sanitize(process.env.MYSQL_ROOT_PASSWORD) || sanitize(process.env.DB_PASSWORD) || '';
  const database = sanitize(process.env.MYSQLDATABASE) || sanitize(process.env.MYSQL_DATABASE) || sanitize(process.env.DB_NAME) || 'railway';
  const port = parseInt(sanitize(process.env.MYSQLPORT) || sanitize(process.env.DB_PORT) || '3306', 10);

  console.log(`🔌 Connecting to MySQL at ${host}:${port} [DB: ${database}, User: ${user}]`);

  return {
    host,
    user,
    password,
    database,
    port,
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
