// Hostinger Entry Point File
// This is the main entry point for your Node.js application on Hostinger
// Uses MySQL-compatible database connection

// Set production environment
process.env.NODE_ENV = 'production';

// Set default port for Hostinger
if (!process.env.PORT) {
    process.env.PORT = '3000';
}

// Load environment variables
import { config } from 'dotenv';
config();

console.log('🚀 Starting EduManage on Hostinger...');
console.log('📡 Port:', process.env.PORT);
console.log('🌍 Environment:', process.env.NODE_ENV);
console.log('💾 Database URL configured:', !!process.env.DATABASE_URL);

// Import the MySQL-compatible server
import './dist/index-mysql.js';