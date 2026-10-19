import mysql from 'mysql2/promise';
import { DATABASE_URL } from '$env/static/private';

const u = new URL(DATABASE_URL);

console.log('[db] connecting to', u.hostname, ':', u.port, 'as', u.username);
console.log('[db] database:', u.pathname.replace(/^\//, ''));

export const pool = mysql.createPool({
	host: u.hostname,
	port: Number(u.port) || 3306,
	user: decodeURIComponent(u.username),
	password: decodeURIComponent(u.password),
	database: u.pathname.replace(/^\//, ''),
	charset: 'utf8mb4',
	ssl: { rejectUnauthorized: false },
	waitForConnections: true,
	connectionLimit: 2,
	queueLimit: 10,
	enableKeepAlive: true,
	keepAliveInitialDelay: 0,
	authPlugins: {}
});

// Pre-warm the pool: MySQL 8 + mysql2 has a race where parallel connection
// creation can fail with ER_ACCESS_DENIED_ERROR even with valid credentials.
// We create exactly one connection on startup so the pool never needs to
// create connections in response to concurrent user requests.
async function warmUp() {
	try {
		const conn = await pool.getConnection();
		await conn.execute('SELECT 1');
		conn.release();
	} catch (e: any) {
		console.error('[db warmup] failed:', e.message);
	}
}
warmUp();