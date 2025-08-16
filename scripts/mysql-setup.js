#!/usr/bin/env node

/**
 * MySQL Setup Script for Hostinger Migration
 * This script helps switch from PostgreSQL to MySQL
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

async function checkMySQLConnection() {
  console.log('Testing MySQL connection...');
  
  try {
    const { testMySQLConnection } = await import('../server/mysql-db.js');
    const connected = await testMySQLConnection();
    
    if (connected) {
      console.log('✅ MySQL connection successful!');
      return true;
    } else {
      console.log('❌ MySQL connection failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing MySQL connection:', error.message);
    return false;
  }
}

async function generateMySQLMigrations() {
  console.log('Generating MySQL migrations...');
  
  try {
    await execAsync('npx drizzle-kit generate --config=drizzle.mysql.config.ts');
    console.log('✅ MySQL migrations generated successfully');
  } catch (error) {
    console.error('❌ Failed to generate migrations:', error.message);
    throw error;
  }
}

async function pushMySQLSchema() {
  console.log('Pushing MySQL schema to database...');
  
  try {
    await execAsync('npx drizzle-kit push --config=drizzle.mysql.config.ts');
    console.log('✅ MySQL schema pushed successfully');
  } catch (error) {
    console.error('❌ Failed to push schema:', error.message);
    throw error;
  }
}

async function updateEnvironmentFile() {
  console.log('Updating environment configuration...');
  
  try {
    const envPath = '.env';
    let envContent = '';
    
    try {
      envContent = await fs.readFile(envPath, 'utf8');
    } catch {
      // File doesn't exist, create new one
    }
    
    // Add or update DB_TYPE
    if (envContent.includes('DB_TYPE=')) {
      envContent = envContent.replace(/DB_TYPE=.*/g, 'DB_TYPE=mysql');
    } else {
      envContent += '\nDB_TYPE=mysql\n';
    }
    
    await fs.writeFile(envPath, envContent);
    console.log('✅ Environment file updated with DB_TYPE=mysql');
  } catch (error) {
    console.error('❌ Failed to update environment file:', error.message);
  }
}

async function updateServerFiles() {
  console.log('Updating server configuration for MySQL...');
  
  try {
    // Update db.ts to use database switcher
    const dbContent = `// Auto-generated database connection
import { getDatabase } from './database-switcher';

export const db = await getDatabase();
`;
    
    await fs.writeFile('server/db.ts', dbContent);
    console.log('✅ Updated server/db.ts for database switching');
  } catch (error) {
    console.error('❌ Failed to update server files:', error.message);
  }
}

async function verifyMySQLTables() {
  console.log('Verifying MySQL tables...');
  
  try {
    const mysql = await import('mysql2/promise');
    const connection = mysql.createPool({
      uri: process.env.DATABASE_URL,
    });
    
    const [rows] = await connection.execute('SHOW TABLES');
    const tableCount = rows.length;
    
    if (tableCount > 0) {
      console.log(`✅ Found ${tableCount} tables in MySQL database`);
      console.log('Tables:', rows.map(row => Object.values(row)[0]).join(', '));
    } else {
      console.log('⚠️  No tables found in MySQL database');
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Failed to verify MySQL tables:', error.message);
  }
}

async function main() {
  console.log('🚀 MySQL Setup for Hostinger Migration\n');
  
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required');
    console.log('Please set your MySQL connection string in .env file:');
    console.log('DATABASE_URL=mysql://username:password@hostname:port/database_name');
    process.exit(1);
  }
  
  // Check if it's a MySQL URL
  if (!process.env.DATABASE_URL.startsWith('mysql://')) {
    console.error('❌ DATABASE_URL must be a MySQL connection string');
    console.log('Current DATABASE_URL appears to be for PostgreSQL');
    console.log('Please update to MySQL format: mysql://username:password@hostname:port/database_name');
    process.exit(1);
  }
  
  try {
    // Step 1: Test MySQL connection
    const connected = await checkMySQLConnection();
    if (!connected) {
      console.log('\n📋 MySQL Connection Troubleshooting:');
      console.log('1. Verify your DATABASE_URL is correct');
      console.log('2. Ensure MySQL server is running');
      console.log('3. Check firewall settings');
      console.log('4. Verify database credentials');
      process.exit(1);
    }
    
    // Step 2: Update environment
    await updateEnvironmentFile();
    
    // Step 3: Update server files
    await updateServerFiles();
    
    // Step 4: Generate and push migrations
    await generateMySQLMigrations();
    await pushMySQLSchema();
    
    // Step 5: Verify setup
    await verifyMySQLTables();
    
    console.log('\n🎉 MySQL setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Restart your application: npm run dev');
    console.log('2. Test all functionality with MySQL');
    console.log('3. Deploy to Hostinger following the MYSQL_MIGRATION_GUIDE.md');
    
  } catch (error) {
    console.error('\n❌ MySQL setup failed:', error.message);
    console.log('\n🔧 Please check the MYSQL_MIGRATION_GUIDE.md for troubleshooting help');
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main as setupMySQL };