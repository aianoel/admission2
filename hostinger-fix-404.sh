#!/bin/bash
# Quick Fix for Hostinger 404 Errors
# Run this script to rebuild and fix deployment issues

echo "🔧 Fixing Hostinger 404 Errors..."

# Step 1: Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -f production.env

# Step 2: Rebuild everything
echo "🔨 Rebuilding application..."
npm run build

# Step 3: Build MySQL server
echo "🏗️ Building MySQL-compatible server..."
npx esbuild server/index-mysql.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index-mysql.js

# Step 4: Copy static files
echo "📁 Organizing files for upload..."
mkdir -p hostinger-upload
cp -r dist/* hostinger-upload/
cp app.js hostinger-upload/
cp .htaccess hostinger-upload/
cp hostinger_mysql_schema.sql hostinger-upload/

# Step 5: Create production package.json
echo "📋 Creating production package.json..."
cat > hostinger-upload/package.json << 'EOF'
{
  "name": "edumanage-hostinger",
  "version": "1.0.0",
  "type": "module",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "drizzle-orm": "^0.28.6",
    "bcryptjs": "^2.4.3",
    "express-session": "^1.17.3",
    "socket.io": "^4.7.2",
    "drizzle-zod": "^0.5.1",
    "zod": "^3.22.4"
  }
}
EOF

# Step 6: Create environment template
echo "⚙️ Creating environment template..."
cat > hostinger-upload/.env.example << 'EOF'
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://u870495195_school:YOUR_PASSWORD@localhost:3306/u870495195_school
SESSION_SECRET=your-super-secret-key-change-this-immediately
EOF

# Step 7: Create deployment instructions
echo "📖 Creating deployment instructions..."
cat > hostinger-upload/README-HOSTINGER.txt << 'EOF'
HOSTINGER DEPLOYMENT INSTRUCTIONS
=================================

1. UPLOAD FILES:
   - Upload ALL files from hostinger-upload/ folder to your public_html directory
   - Make sure index.html is in the root of public_html

2. DATABASE SETUP:
   - Import hostinger_mysql_schema.sql to your MySQL database
   - Note your database credentials from Hostinger control panel

3. ENVIRONMENT SETUP:
   - Rename .env.example to .env
   - Update DATABASE_URL with your actual MySQL credentials
   - Change SESSION_SECRET to a random secure string

4. HOSTINGER NODE.JS SETTINGS:
   - Entry Point: app.js
   - Start Command: node app.js
   - Environment: production
   - Port: 3000

5. INSTALL DEPENDENCIES:
   - In Hostinger terminal, run: npm install

6. START APPLICATION:
   - Click "Start" in Node.js app settings

DEFAULT ADMIN LOGIN (CHANGE IMMEDIATELY):
- Email: admin@school.edu  
- Password: admin123

If you still get 404 errors:
- Check that index.html exists in public_html root
- Verify .htaccess file is uploaded
- Check Hostinger error logs
- Ensure Node.js app is running
EOF

echo ""
echo "✅ Hostinger 404 fix complete!"
echo ""
echo "📂 Upload entire hostinger-upload/ folder contents to your Hostinger public_html directory"
echo "🗃️ Import hostinger_mysql_schema.sql to your MySQL database"
echo "⚙️ Configure your .env file with database credentials"
echo "🚀 Set Node.js entry point to app.js and start the application"
echo ""
echo "📖 See hostinger-upload/README-HOSTINGER.txt for detailed instructions"