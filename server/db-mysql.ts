// MySQL Database Connection for Hostinger
// This replaces the Neon PostgreSQL connection for production deployment

import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from '@shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to configure your MySQL database?",
  );
}

// Parse MySQL connection string
// Format: mysql://username:password@host:port/database
const connectionString = process.env.DATABASE_URL;

// Create MySQL connection
export const pool = mysql.createPool(connectionString);

// Create Drizzle instance
export const db = drizzle(pool, { schema, mode: 'default' });

// Test connection function
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL database connection failed:', error);
    return false;
  }
}