#!/bin/bash
# Complete Hostinger Deployment Script
# This script builds and prepares all files for Hostinger upload

echo "🚀 Starting Hostinger deployment preparation..."

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Build the application
echo "🔨 Building application..."
./build-hostinger.sh

# Step 3: Create production environment file
echo "⚙️  Creating production environment template..."
cat > production.env << EOF
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://u870495195_school:YOUR_PASSWORD@localhost:3306/u870495195_school
SESSION_SECRET=your-super-secret-key-change-this-immediately
EOF

# Step 4: Create .htaccess for SPA routing
echo "🔗 Creating .htaccess file..."
cat > .htaccess << 'EOF'
RewriteEngine On

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule . /index.html [L]

# Set headers for static files
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    Header set Cache-Control "public, max-age=31536000"
</FilesMatch>

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
EOF

# Step 5: Create package.json for production
echo "📋 Creating production package.json..."
cat > package-production.json << 'EOF'
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
    "connect-pg-simple": "^9.0.1",
    "drizzle-zod": "^0.5.1",
    "zod": "^3.22.4"
  }
}
EOF

# Step 6: Create deployment checklist
echo "📝 Creating deployment checklist..."
cat > HOSTINGER_DEPLOYMENT.md << 'EOF'
# 🚀 Hostinger Deployment Checklist

## Files to Upload to public_html:
- [ ] `app.js` - Entry point
- [ ] `.htaccess` - SPA routing  
- [ ] `dist/` folder - Built application
- [ ] `package-production.json` - Rename to `package.json`
- [ ] Create `.env` file with your MySQL credentials

## Environment Variables (.env):
```
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://u870495195_school:YOUR_PASSWORD@localhost:3306/u870495195_school
SESSION_SECRET=your-super-secret-key-change-this-immediately
```

## Hostinger Node.js Settings:
- **Entry Point**: `app.js`
- **Start Command**: `node app.js`
- **Environment**: Production
- **Port**: 3000

## Database Setup:
1. Import `hostinger_mysql_schema.sql` to your MySQL database
2. Update DATABASE_URL with your actual credentials
3. Test connection

## After Upload:
1. Run `npm install` in Hostinger terminal
2. Set entry point to `app.js`
3. Start the application
4. Check logs for any errors

## Default Admin Credentials (CHANGE IMMEDIATELY):
- Email: admin@school.edu
- Password: admin123
EOF

echo ""
echo "✅ Hostinger deployment preparation complete!"
echo ""
echo "📂 Files ready for upload:"
echo "   • app.js"
echo "   • .htaccess"
echo "   • dist/ (entire folder)"
echo "   • package-production.json (rename to package.json)"
echo "   • hostinger_mysql_schema.sql"
echo ""
echo "⚙️  Next steps:"
echo "   1. Upload files to Hostinger public_html"
echo "   2. Import MySQL schema to your database"
echo "   3. Create .env file with your MySQL credentials"
echo "   4. Set Node.js entry point to app.js"
echo "   5. Run npm install in Hostinger terminal"
echo ""
echo "📖 See HOSTINGER_DEPLOYMENT.md for detailed instructions"
echo ""
echo "🎉 Ready for Hostinger deployment!"