import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// Create MySQL connection
const connection = mysql.createPool(process.env.DATABASE_URL!, {
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
});

// Create Drizzle instance
export const mysqlDb = drizzle(connection);

// Test connection function
export async function testMySQLConnection() {
  try {
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('MySQL connection successful:', rows);
    return true;
  } catch (error) {
    console.error('MySQL connection failed:', error);
    return false;
  }
}