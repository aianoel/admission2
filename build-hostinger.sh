#!/bin/bash
# Build Script for Hostinger MySQL Deployment

echo "🔨 Building School Management System for Hostinger..."

# Step 1: Build the client (React app)
echo "📦 Building client..."
vite build

# Step 2: Build the MySQL-compatible server
echo "🖥️  Building MySQL-compatible server..."
npx esbuild server/index-mysql.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index-mysql.js

# Step 3: Build the database connections
echo "💾 Building MySQL database connection..."
npx esbuild server/db-mysql.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/db-mysql.js

# Step 4: Build the database adapter
echo "🔄 Building database adapter..."
npx esbuild server/db-adapter.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/db-adapter.js

# Step 5: Build the MySQL schema
echo "📋 Building MySQL schema..."
npx esbuild shared/mysql-schema.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/mysql-schema.js

echo "✅ Build complete!"
echo ""
echo "📂 Files ready for Hostinger upload:"
echo "   • dist/ (built application)"
echo "   • app.js (entry point)"
echo "   • .htaccess (routing)"
echo "   • hostinger-startup.js (environment)"
echo "   • node_modules/ (dependencies)"
echo "   • package.json"
echo ""
echo "🚀 Upload these files to your Hostinger public_html directory"
echo "⚙️  Set entry point to: app.js"
echo "🔗 Set DATABASE_URL to your MySQL connection string"