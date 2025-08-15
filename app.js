// Hostinger Entry Point File
// This is the main entry point for your Node.js application on Hostinger
// Uses MySQL-compatible database connection

// Set production environment
process.env.NODE_ENV = 'production';

// Set default port for Hostinger
if (!process.env.PORT) {
    process.env.PORT = '3000';
}

// Import the MySQL-compatible server
import './dist/index-mysql.js';