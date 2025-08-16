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
