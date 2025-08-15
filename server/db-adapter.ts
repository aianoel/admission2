// Database Adapter - Automatically selects PostgreSQL or MySQL based on environment
// This file detects the database type and provides the correct connection

const isDevelopment = process.env.NODE_ENV === 'development';
const databaseUrl = process.env.DATABASE_URL || '';
const isPostgreSQL = databaseUrl.includes('postgresql://') || databaseUrl.includes('postgres://');

// Auto-detect database type or default based on environment
const usePostgreSQL = isDevelopment && isPostgreSQL;

export const dbType = usePostgreSQL ? 'postgresql' : 'mysql';

// Dynamic import and export based on database type
if (usePostgreSQL) {
  console.log('🐘 Using PostgreSQL database');
  export { db } from './db.js';
} else {
  console.log('🐬 Using MySQL database');  
  export { db } from './db-mysql.js';
}