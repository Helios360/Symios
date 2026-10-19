import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
const u = new URL(DATABASE_URL);

console.log('Connecting with:', {
  host: u.hostname,
  port: Number(u.port) || 3306,
  user: decodeURIComponent(u.username),
  password: decodeURIComponent(u.password),
  database: u.pathname.replace(/^\//, ''),
});

const pool = mysql.createPool({
  host: u.hostname,
  port: Number(u.port) || 3306,
  user: decodeURIComponent(u.username),
  password: decodeURIComponent(u.password),
  database: u.pathname.replace(/^\//, ''),
  charset: 'utf8mb4',
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 1,
  queueLimit: 10,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

async function warmUp() {
  try {
    const conn = await pool.getConnection();
    await conn.execute('SELECT 1');
    conn.release();
    console.log('Warmup OK');
  } catch (e) {
    console.error('Warmup FAIL:', e.message);
  }
}

async function test() {
  await warmUp();
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as n FROM articles');
    console.log('Articles:', rows[0].n);
  } catch (e) {
    console.error('Query FAIL:', e.message);
  }
  process.exit(0);
}

test();