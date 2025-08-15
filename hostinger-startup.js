// Hostinger Startup Configuration
// This file ensures proper initialization on Hostinger servers

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set production environment if not already set
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
}

// Set default port for Hostinger
if (!process.env.PORT) {
    process.env.PORT = '3000';
}

// Ensure database URL is set (update this with your actual MySQL connection)
if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not set. Please configure your MySQL connection string.');
    process.env.DATABASE_URL = 'mysql://your_db_user:your_password@localhost:3306/u870495195_school';
}

// Set session secret if not provided
if (!process.env.SESSION_SECRET) {
    process.env.SESSION_SECRET = 'hostinger-school-management-secret-key';
}

console.log('🚀 Hostinger Environment Configured');
console.log('📍 Environment:', process.env.NODE_ENV);
console.log('🔌 Port:', process.env.PORT);
console.log('💾 Database:', process.env.DATABASE_URL ? 'Configured' : 'Not configured');

// Start the application
import('./dist/index.js').catch(error => {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
});