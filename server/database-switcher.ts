// Database switcher utility for PostgreSQL/MySQL compatibility
import { sql } from "drizzle-orm";

// PostgreSQL connection (existing)
export async function getPostgreSQLConnection() {
  const { db } = await import('./db');
  return db;
}

// MySQL connection (new)
export async function getMySQLConnection() {
  const { mysqlDb } = await import('./mysql-db');
  return mysqlDb;
}

// Database type detection from environment
export function getDatabaseType(): 'postgresql' | 'mysql' {
  const dbUrl = process.env.DATABASE_URL || '';
  const dbType = process.env.DB_TYPE?.toLowerCase();
  
  if (dbType === 'mysql' || dbUrl.startsWith('mysql://')) {
    return 'mysql';
  }
  
  return 'postgresql'; // Default to PostgreSQL
}

// Get appropriate database connection
export async function getDatabase() {
  const dbType = getDatabaseType();
  
  if (dbType === 'mysql') {
    console.log('Using MySQL database connection');
    return getMySQLConnection();
  } else {
    console.log('Using PostgreSQL database connection');
    return getPostgreSQLConnection();
  }
}

// Test database connection
export async function testDatabaseConnection() {
  const dbType = getDatabaseType();
  
  try {
    if (dbType === 'mysql') {
      const { testMySQLConnection } = await import('./mysql-db');
      return await testMySQLConnection();
    } else {
      // Test PostgreSQL connection
      const db = await getPostgreSQLConnection();
      await db.execute(sql`SELECT 1`);
      console.log('PostgreSQL connection successful');
      return true;
    }
  } catch (error) {
    console.error(`${dbType} connection failed:`, error);
    return false;
  }
}

// Export for convenience
export { getDatabaseType as getDbType };