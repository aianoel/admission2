# 🚀 Hostinger Deployment Fix Guide

## The Problem
Your app shows a 404 error because:
1. **Database Connection**: Your app uses PostgreSQL but Hostinger uses MySQL
2. **Static Files**: Routing not configured properly for Single Page Application (SPA)
3. **Environment Variables**: Missing production configuration

## 🔧 Quick Fix Steps

### Step 1: Upload These New Files
I've created 4 new files for you. Upload these to your Hostinger root directory:

1. **`app.js`** - Main entry point for Hostinger
2. **`.htaccess`** - Handles client-side routing  
3. **`hostinger-startup.js`** - Environment configuration
4. **`production.env`** - Environment variables template

### Step 2: Update Your Database Connection
⚠️ **CRITICAL**: Your app uses PostgreSQL, but Hostinger uses MySQL.

**In your Hostinger control panel:**

1. **Set Environment Variables:**
   ```
   NODE_ENV=production
   DATABASE_URL=mysql://u870495195_school:YOUR_PASSWORD@localhost:3306/u870495195_school
   SESSION_SECRET=your-secret-key-here
   ```

2. **Or create a `.env` file** in your root directory:
   ```env
   NODE_ENV=production
   DATABASE_URL=mysql://u870495195_school:YOUR_PASSWORD@localhost:3306/u870495195_school
   SESSION_SECRET=your-super-secret-key
   PORT=3000
   ```

### Step 3: Update Hostinger App Settings
In your Hostinger Node.js app settings:

1. **Entry Point**: Set to `app.js` (not `dist/index.js`)
2. **Start Command**: `node app.js`
3. **Port**: 3000
4. **Environment**: Production

### Step 4: Database Connection Fix
Since you're using MySQL on Hostinger, you need to install MySQL driver:

**Add to your dependencies** (if not already installed):
```bash
npm install mysql2
```

### Step 5: File Structure on Hostinger
Make sure you have this structure in your public_html:

```
public_html/
├── app.js                    ← Entry point
├── .htaccess                 ← SPA routing
├── hostinger-startup.js      ← Environment setup
├── .env                      ← Environment variables
├── dist/                     ← Built application
│   ├── index.js             ← Server bundle
│   └── public/              ← Client assets
│       ├── index.html
│       └── assets/
├── node_modules/            ← Dependencies
└── package.json
```

### Step 6: Restart Your Application
In Hostinger control panel:
1. Go to **Node.js App**
2. Click **Restart** 
3. Check the logs for any errors

## 🔍 Troubleshooting

### If you still get 404:
1. **Check Node.js App Status** - Make sure it's running
2. **Check Logs** - Look for error messages in Hostinger logs
3. **Verify Files** - Ensure all files uploaded correctly
4. **Test Database** - Make sure MySQL connection works

### Common Issues:
- **Entry Point**: Must be `app.js`
- **Database URL**: Must use `mysql://` not `postgresql://`
- **File Permissions**: Ensure files are readable
- **Domain**: Make sure domain points to the right directory

### Database Connection String Format:
```
mysql://username:password@host:port/database_name
```

Example:
```
mysql://u870495195_school:mypassword123@localhost:3306/u870495195_school
```

## 🎯 Expected Result
After following these steps:
- ✅ Your app should load at `https://admission.icnl-ict.com`
- ✅ All routes should work (no more 404s)
- ✅ Database should connect properly
- ✅ Login/registration should work

## 📞 Need Help?
If you still have issues:
1. Check Hostinger error logs
2. Verify all environment variables are set
3. Make sure MySQL database credentials are correct
4. Ensure all files are in the correct location

The main issue is the database connection type - your app needs to connect to MySQL, not PostgreSQL!