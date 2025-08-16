// Database Adapter - Automatically selects PostgreSQL or MySQL based on environment
// This file detects the database type and provides the correct connection

const isDevelopment = process.env.NODE_ENV === 'development';
const databaseUrl = process.env.DATABASE_URL || '';
const isPostgreSQL = databaseUrl.includes('postgresql://') || databaseUrl.includes('postgres://');

// Auto-detect database type or default based on environment
const usePostgreSQL = isDevelopment && isPostgreSQL;

export const dbType = usePostgreSQL ? 'postgresql' : 'mysql';

// Export the correct database connection
let dbExport;

if (usePostgreSQL) {
  console.log('🐘 Using PostgreSQL database');
  dbExport = require('./db.js');
} else {
  console.log('🐬 Using MySQL database');
  dbExport = require('./db-mysql.js');
}

export const db = dbExport.db;