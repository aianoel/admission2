# 🚀 Hostinger Deployment Package

## Files to Upload to Hostinger

### 1. Root Directory Files
Upload these files to your `public_html` folder:

```
public_html/
├── index.html                    ← Main entry point (use hostinger-index.html)
├── app.js                        ← Node.js entry point
├── .htaccess                     ← Apache routing rules
├── .env                          ← Environment variables
├── package.json                  ← Dependencies
├── package-lock.json             ← Lock file
└── dist/                         ← Built application
    ├── index.js                  ← Server bundle
    ├── index-mysql.js            ← MySQL server bundle
    └── public/                   ← Client assets
        ├── index.html
        └── assets/
            ├── index-B6FScPJb.js
            └── index-HoAxg1bp.css
```

### 2. Environment Configuration
Create a `.env` file in your root directory:

```env
NODE_ENV=production
DATABASE_URL=mysql://YOUR_USERNAME:YOUR_PASSWORD@localhost:3306/YOUR_DATABASE
SESSION_SECRET=your-super-secret-session-key-here
PORT=3000
```

### 3. Hostinger Node.js App Settings

In your Hostinger control panel:

1. **Application Type**: Node.js
2. **Entry Point**: `app.js`
3. **Startup File**: `app.js`
4. **Port**: 3000
5. **Environment**: Production

### 4. Database Setup

1. Create MySQL database in Hostinger control panel
2. Import the database schema using `hostinger_database_schema.sql`
3. Update the DATABASE_URL in your `.env` file

### 5. Quick Upload Instructions

1. **Rename Files**:
   - Copy `hostinger-index.html` as `index.html`
   - Ensure `app.js` is in root directory
   - Upload the entire `dist/` folder

2. **Set Permissions**:
   - Make sure all files are readable (644)
   - Directories should be executable (755)

3. **Test the Deployment**:
   - Go to your domain
   - Check if the loading screen appears
   - Verify API endpoints work at `/api/admin/system-stats`

## 🔧 Troubleshooting

### If you get 403 Forbidden:
- Check file permissions
- Ensure `index.html` is in the root directory
- Verify Node.js app is running in Hostinger panel

### If you get 500 Internal Server Error:
- Check Hostinger error logs
- Verify database connection string
- Ensure all required environment variables are set

### If static assets don't load:
- Check that `dist/public/assets/` folder was uploaded
- Verify `.htaccess` file is in root directory
- Clear browser cache

## 📞 Need Help?

If you continue to have issues:
1. Check the Hostinger error logs in your control panel
2. Verify all files were uploaded correctly
3. Test database connection separately
4. Contact Hostinger support if needed

## ✅ Success Indicators

When working correctly, you should see:
- ✅ Loading screen appears immediately
- ✅ EduManage application loads after a few seconds
- ✅ Login page is accessible
- ✅ API endpoints respond correctly
- ✅ No 403/404 errors in browser console