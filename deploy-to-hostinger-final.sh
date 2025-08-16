#!/bin/bash

echo "🚀 Preparing EduManage for Hostinger Deployment"
echo "================================================"

# Create deployment directory
mkdir -p hostinger-deployment
cd hostinger-deployment

echo "📦 Copying essential files..."

# Copy the main entry files
cp ../app.js .
cp ../hostinger-index.html ./index.html
cp ../.htaccess .
cp ../package.json .
cp ../package-lock.json .

# Copy the built application
cp -r ../dist .

# Create environment template
cat > .env << 'EOF'
NODE_ENV=production
DATABASE_URL=mysql://YOUR_USERNAME:YOUR_PASSWORD@localhost:3306/YOUR_DATABASE
SESSION_SECRET=your-super-secret-session-key-here-make-it-long-and-random
PORT=3000
EOF

echo "📝 Creating deployment checklist..."

cat > HOSTINGER_UPLOAD_CHECKLIST.md << 'EOF'
# 🚀 Hostinger Upload Checklist

## Before Upload:
- [ ] Update .env file with your actual database credentials
- [ ] Verify your Hostinger MySQL database is created
- [ ] Make sure Node.js is enabled in your Hostinger control panel

## Upload These Files to public_html:
- [ ] index.html (main entry point)
- [ ] app.js (Node.js server)
- [ ] .htaccess (routing configuration)
- [ ] .env (environment variables)
- [ ] package.json & package-lock.json
- [ ] dist/ folder (entire directory with built app)

## Hostinger Node.js Settings:
- [ ] Entry Point: app.js
- [ ] Startup File: app.js
- [ ] Port: 3000
- [ ] Environment: Production

## After Upload:
- [ ] Restart your Node.js application in Hostinger control panel
- [ ] Visit your domain to test
- [ ] Check browser console for any errors
- [ ] Verify login functionality works

## If You Get Errors:
1. Check Hostinger error logs
2. Verify database connection string
3. Ensure all files uploaded correctly
4. Contact support if needed

Your domain should show the EduManage loading screen, then the full application!
EOF

echo "✅ Deployment package ready!"
echo ""
echo "📁 Files in hostinger-deployment/:"
ls -la

echo ""
echo "🎯 Next Steps:"
echo "1. Update the .env file with your actual database credentials"
echo "2. Upload all files in this folder to your Hostinger public_html directory" 
echo "3. Set Node.js entry point to 'app.js' in Hostinger control panel"
echo "4. Restart your Node.js application"
echo "5. Visit your domain!"
echo ""
echo "📋 See HOSTINGER_UPLOAD_CHECKLIST.md for detailed instructions"