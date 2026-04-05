import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'meroghar_db',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

// Test connection
const testConnection = async () => {
	try {
		const connection = await pool.getConnection();
		console.log('Database connected successfully');
		connection.release();
	} catch (error) {
		console.error('Database connection failed:', error);
	}
};

testConnection();

export default pool;
