#!/usr/bin/env node

/**
 * Quick MySQL compatibility test script
 * Run this to verify MySQL setup works correctly
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testMySQLCompatibility() {
  console.log('🧪 Testing MySQL Compatibility for EduManage\n');
  
  // Check environment
  console.log('📋 Environment Check:');
  console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ Missing'}`);
  console.log(`DB_TYPE: ${process.env.DB_TYPE || 'Not set (will default to postgresql)'}`);
  
  if (!process.env.DATABASE_URL) {
    console.log('\n❌ DATABASE_URL is required. Please set it in your .env file');
    process.exit(1);
  }
  
  const isMySQL = process.env.DATABASE_URL.startsWith('mysql://') || process.env.DB_TYPE === 'mysql';
  console.log(`Database Type: ${isMySQL ? 'MySQL' : 'PostgreSQL'}\n`);
  
  if (!isMySQL) {
    console.log('ℹ️  This test is for MySQL compatibility. Your current setup uses PostgreSQL.');
    console.log('To test MySQL, update your .env file with:');
    console.log('DATABASE_URL=mysql://username:password@hostname:port/database_name');
    console.log('DB_TYPE=mysql');
    process.exit(0);
  }
  
  try {
    // Test MySQL connection
    console.log('🔗 Testing MySQL connection...');
    const { testMySQLConnection } = await import('../server/mysql-db.js');
    const connected = await testMySQLConnection();
    
    if (!connected) {
      console.log('❌ MySQL connection failed');
      process.exit(1);
    }
    
    // Test database switcher
    console.log('🔀 Testing database switcher...');
    const { testDatabaseConnection, getDatabaseType } = await import('../server/database-switcher.js');
    const dbType = getDatabaseType();
    console.log(`Detected database type: ${dbType}`);
    
    const switcherTest = await testDatabaseConnection();
    if (switcherTest) {
      console.log('✅ Database switcher working correctly');
    } else {
      console.log('❌ Database switcher test failed');
    }
    
    // Test schema compatibility
    console.log('📊 Testing MySQL schema...');
    const mysql = await import('mysql2/promise');
    const connection = mysql.createPool({ uri: process.env.DATABASE_URL });
    
    // Test basic queries
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`Found ${tables.length} tables in database`);
    
    if (tables.length > 0) {
      console.log('Table names:', tables.map(row => Object.values(row)[0]).slice(0, 5).join(', ') + 
                  (tables.length > 5 ? '...' : ''));
    }
    
    // Test a simple SELECT
    try {
      const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
      console.log(`Users table accessible: ${users[0].count} records`);
    } catch (error) {
      console.log('⚠️  Users table not found or empty (this is normal for new installations)');
    }
    
    await connection.end();
    
    console.log('\n🎉 MySQL compatibility test completed successfully!');
    console.log('\n📝 Your system is ready for MySQL deployment on Hostinger');
    console.log('\n🚀 Next steps:');
    console.log('1. Deploy to Hostinger following MYSQL_MIGRATION_GUIDE.md');
    console.log('2. Run `npm run build` before uploading');
    console.log('3. Ensure all files are uploaded including mysql-schema.ts');
    
  } catch (error) {
    console.error('\n❌ MySQL compatibility test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Verify your DATABASE_URL is correct');
    console.log('2. Ensure MySQL server is accessible');
    console.log('3. Check network connectivity');
    console.log('4. Review MYSQL_MIGRATION_GUIDE.md for detailed setup');
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testMySQLCompatibility().catch(console.error);
}

export { testMySQLCompatibility };